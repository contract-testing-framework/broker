import axios from "axios";

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

export const getAllData = async () => {
  const { data } = await axios.get("/api/deploy/data");
  console.log("data:", data);
  return data;
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
