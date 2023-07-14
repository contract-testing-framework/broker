import axios from "axios";
import Participant from "../models/Participant";
import { unique } from "../utils/helpers";

const getCurrentParticipant = (name, allParticipants) => {
  return allParticipants.find((part) => {
    if (part.name === name) return part;
  });
};

const getVersions = (currParticipant) => {
  return currParticipant.versions;
};

export const getCurrentParticipantVersions = (name, allParticipants) => {
  const currentParticipant = getCurrentParticipant(name, allParticipants);

  const currentVersions = getVersions(currentParticipant).map((vers) => {
    return vers.version;
  });

  return currentVersions;
};

export const getCurrentEnvironments = (name, allParticipants) => {
  let allEnvironments = [];

  const currParticipant = getCurrentParticipant(name, allParticipants);

  const allParticipantVersions = getVersions(currParticipant);

  const environments = allParticipantVersions.map((version) => {
    return version.environments.map((env) => env.name);
  });

  environments.forEach((env) => {
    allEnvironments = allEnvironments.concat(env);
  });

  return unique(allEnvironments);
};

export const getAllData = async () => {
  const { data } = await axios.get("/api/deploy/data");
  console.log("data:", data);
  return data.map((datum) => new Participant(datum));
};

export const readyToDeployResults = async (
  participantName,
  participantVersion,
  environmentName
) => {
  try {
    const { data } = await axios.get("/api/deploy", {
      params: {
        participantName,
        participantVersion,
        environmentName,
      },
    });

    return data;
  } catch (error) {
    throw new Error("Failed to fetch deploy results");
  }
};
