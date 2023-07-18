import { useState, useEffect } from "react";
import { Select, Text, Button, Paper, Card, Title } from "@mantine/core";
import Participant from "../models/Participant";
import {
  getCurrentParticipantVersions,
  getAllData,
  readyToDeployResults,
} from "../services/deployGuardService";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Checks } from "tabler-icons-react";

const DeployGuard = () => {
  const [environment, setEnvironment] = useState("");
  const [participant, setParticipant] = useState("");
  const [version, setVersion] = useState("");
  const [versionData, setVersionData] = useState([]);
  const [environmentData, setEnvironmentData] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isReadyToDeploy, setIsReadyToDeploy] = useState(false);
  const [results, setResults] = useState({ status: null, errors: [] });

  useEffect(() => {
    const setData = async () => {
      const deploymentData = await getAllData();
      setParticipants(
        deploymentData.participantData.map((datum) => new Participant(datum))
      );
      const allEnvs = deploymentData.allEnvs.map((env) => {
        return env.environmentName;
      });

      setEnvironmentData(allEnvs);
    };

    setData();
  }, []);

  const handleParticipantChange = (value) => {
    setParticipant(value);
    const currentVersions = getCurrentParticipantVersions(value, participants);
    setVersionData(currentVersions);
    setVersion("");
    setIsReadyToDeploy(false);
    setResults({ status: null, errors: [] });
  };

  const handleVersionChange = (value) => {
    setVersion(value);
    setIsReadyToDeploy(participant && value && environment);
    setResults({ status: null, errors: [] });
  };

  const handleEnvironmentChange = (value) => {
    setEnvironment(value);
    setIsReadyToDeploy(participant && version && value);
    setResults({ status: null, errors: [] });
  };

  const handleReadyToDeploy = async () => {
    const deploymentResults = await readyToDeployResults(
      participant,
      version,
      environment
    );
    console.log(deploymentResults);
    setResults(deploymentResults);
  };

  return (
    <div
      style={{ marginTop: "1rem", marginBottom: "4rem", position: "relative" }}
    >
      <Card
        padding="lg"
        shadow="sm"
        radius="md"
        style={{ padding: "2rem", border: "1px solid rgba(0, 0, 0, 0.1)" }}
      >
        <Title
          variant="gradient"
          style={{
            fontSize: "200%",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          Deploy Guard
        </Title>
        <hr
          style={{
            margin: "2rem 0",
            border: 0,
            borderBottom: "1px solid #ddd",
          }}
        />
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "7em",
          }}
        >
          <Text style={{ textAlign: "left", marginTop: "0.25rem" }}>
            Service:
            <span style={{ color: "red", marginLeft: "0.25rem" }}>*</span>
          </Text>
          <Select
            data={participants.map((part) => ({
              label: part.name,
              value: part.name,
            }))}
            style={{ width: "40%" }}
            value={participant}
            onChange={(value) => handleParticipantChange(value)}
            placement="bottom-start"
          />
          <Text style={{ textAlign: "left", marginTop: "0.25rem" }}>
            Version:
            <span style={{ color: "red", marginLeft: "0.25rem" }}>*</span>
          </Text>
          <Select
            data={versionData}
            placeholder=""
            style={{ width: "40%" }}
            value={version}
            onChange={(value) => handleVersionChange(value)}
            placement="bottom-start"
          />
          <Text style={{ textAlign: "left", marginTop: "0.25rem" }}>
            Deploy to:
            <span style={{ color: "red", marginLeft: "0.25rem" }}>*</span>
          </Text>
          <Select
            data={environmentData}
            placeholder="Environment"
            style={{ width: "40%" }}
            value={environment}
            onChange={(value) => handleEnvironmentChange(value)}
            placement="bottom-start"
          />
          <Button
            style={{ marginTop: "2rem", borderRadius: "20px", width: "18%" }}
            variant="gradient"
            fullWidth
            onClick={handleReadyToDeploy}
            disabled={!isReadyToDeploy}
          >
            Ready to Deploy?
          </Button>
          {results.status === true && (
            <div
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "2rem",
                right: "2rem",
              }}
            >
              <Paper
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem",
                  border: "1px solid #0F9D58",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <Checks
                    size={26}
                    style={{ color: "#0F9D58", marginRight: "0.5rem" }}
                  />
                  <span style={{ color: "#0F9D58", fontWeight: "bold" }}>
                    Ready to Deploy: Success
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "0.5rem",
                    textAlign: "left",
                    marginLeft: "1.6rem",
                  }}
                >
                  All required verification results are published and successful
                </div>
              </Paper>
            </div>
          )}
          {results.status === false && (
            <div
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "2rem",
                right: "2rem",
              }}
            >
              <Paper
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem",
                  border: "1px solid #DC2626",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <AiOutlineCloseCircle
                    size={21}
                    style={{ color: "#DC2626", marginRight: "0.5rem" }}
                  />
                  <span style={{ color: "#DC2626", fontWeight: "bold" }}>
                    Ready to Deploy: Error
                  </span>
                </div>
                {results.errors.length > 0 && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      textAlign: "left",
                      marginLeft: "1.7rem",
                    }}
                  >
                    {results.errors[0].details}
                  </div>
                )}
              </Paper>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default DeployGuard;
