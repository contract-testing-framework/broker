import express from "express";
import db from "../../db/databaseClient.js";
import deployService from "../../services/deployService.js";
import "express-async-errors";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { participantName, participantVersion, environmentName } = req.query;

    if (!participantName) {
      return res.status(400).send({ error: "participantName not given" });
    }
    if (!participantVersion) {
      return res.status(400).send({ error: "participantVersion not given" });
    }
    if (!environmentName) {
      return res.status(400).send({ error: "environmentName not given" });
    }

    const environment = await db.createEnvironment(environmentName);

    const version = await db.getParticipantVersion(
      participantName,
      participantVersion
    );

    if (!version) {
      return res.status(400).send({ error: "Cannot find participant version" });
    }

    const errors = [
      ...(await deployService.checkWithConsumers(
        version.participantVersionId,
        environment.environmentId
      )),
      ...(await deployService.checkWithProviders(
        version.participantVersionId,
        environment.environmentId
      )),
    ];

    const status = errors.length === 0 ? "true" : "false";

    return res.send({ status, errors });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: "Deploy check failed to finish" });
  }
});

router.get("/data", async (_req, res) => {
  try {
    const deployData = await db.getDeployGuardData();
    const allEnvs = await db.getEnvironments();

    res.json({ participantData: deployData, allEnvs });
  } catch (error) {
    res.status(400).send({ error: "There are no participants in the system." });
  }
});

export default router;
