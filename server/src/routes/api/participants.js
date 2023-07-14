import express from "express";
import db from "../../db/databaseClient.js";
import "express-async-errors";

const router = express.Router();

// updates the deployment status of a participant version in an environment
router.patch("/", async (req, res) => {
  const { participantName, participantVersion, environmentName, deployed } =
    req.body;

  if (
    !participantName ||
    !participantVersion ||
    !environmentName ||
    deployed === undefined
  ) {
    return res.status(400).json({ error: "Request body is invalid" });
  }

  const environmentRecord = await db.createEnvironment(environmentName);

  const participantVersionRecord = await db.getParticipantVersion(
    participantName,
    participantVersion
  );

  if (!participantVersionRecord) {
    return res
      .status(400)
      .json({ error: "Participant version does not exist" });
  }

  if (deployed) {
    await db.addParticipantVersionToEnvironment(
      participantVersionRecord.participantVersionId,
      environmentRecord.environmentId
    );
  } else {
    await db.removeParticipantFromEnvironment(
      participantVersionRecord.participantVersionId,
      environmentRecord.environmentId
    );
  }

  res.status(200).json(req.body);
});

export default router;
