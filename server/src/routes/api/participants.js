import express from "express";
import db from "../../db/databaseClient.js";
// import Participant from "../../models/Participant.js";

const router = express.Router();

/*
Updates the deployment status of a participant version in an environment

Request Body:
{
  participantName: (string)
  participantVersion: (string)
  environmentName: (string)
  deployed: (bool)
}
*/
router.patch('/', async (req, res) => {
  const { participantName, participantVersion, environmentName, deployed } = req.body 

  if (!participantName || !participantVersion || !environmentName || deployed === undefined) {
    return res.status(400).json({ error: 'Request body is invalid' });
  }

  const environmentRecord = await db.createEnvironment(environmentName);

  const participantVersionRecord = await db.getParticipantVersion(participantName, participantVersion);

  if (!participantVersionRecord) {
    return res.status(400).json({error: 'Participant version does not exist'})
  }

  if (deployed) {
    await db.addParticipantVersionToEnvironment(
      participantVersionRecord.participantVersionId, 
      environmentRecord.environmentId
    );
  } else {
    await db.removeParticipantFromEnvironment(participantVersionRecord.participantVersionId);
  }

  res.status(200).json(req.body);
});


// Everything that is commented out is currently not being used - 7/5

// /**
//  * Gets all participants
//  * @returns {array} All participants
//  */
// router.get("/", async (_req, res) => {
//   const participants = await Participant.query();
//   res.json(participants);
// });

// /**
//  * Creates a new participant
//  * @param {string} participantName - The participant name
//  * @returns {object} The created participant
//  * http post localhost:3000/api/participants participant_name=hamachi
//  */
// router.post("/", async (req, res) => {
//   const { participantName: participant_name } = req.body;

//   const insertedParticipant = await Participant.query().insert({
//     participant_name,
//   });

//   res.status(201).json(insertedParticipant);
// });

// /**
//  * Gets a participant by id
//  * @param {number} id - The participant id
//  * @returns {object} The participant
//  */
// router.get("/:id", async (req, res) => {
//   const participant = await Participant.query().findById(Number(req.params.id));
//   res.json(participant);
// });

// /**
//  * Updates a participant by id
//  * @param {number} id - The participant id
//  * @param {string} participantName - The participant's name
//  * @returns {object} The updated participant
//  */
// router.put("/:id", async (req, res) => {
//   const { participantName: participant_name } = req.body;
//   const id = Number(req.params.id);
//   const updatedParticipant = await Participant.query().patchAndFetchById(id, {
//     participant_name,
//   });
//   if (!updatedParticipant) {
//     res.status(404).send();
//   } else {
//     res.json(updatedParticipant);
//   }
// });

// /**
//  * Deletes a participant by id
//  * @param {number} id - The participant id
//  */
// router.delete("/:id", async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     const participant = await Participant.query().deleteById(Number(id));
//     if (!participant) {
//       res.status(404).send();
//     } else {
//       res.status(204).send();
//     }
//   } catch (err) {
//     res.status(500).send();
//   }
// });

export default router;
