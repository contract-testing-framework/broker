import express from "express";
import db from "../../db/databaseClient.js";
import comp from "../../services/comparisonService.js";
import { newGraphMiddleware } from "../../utils/queryHelpers.js";
import { validateSchema } from "../../services/contractSchema.js";
import "express-async-errors";
import ConsumerContract from "../../models/ConsumerContract.js";
const router = express.Router();

const ALLOWED_GRAPH = [
  "owner.versions",
  "participantVersions",
  "comparedProviderContracts",
  "comparedConsumerContracts",
];

const contractGraphMiddleware = newGraphMiddleware(
  ConsumerContract,
  ALLOWED_GRAPH
);

/**
 * Gets all contracts
 * @param {string[]} joinGraph - The graph to join
 * @returns {object[]} All contracts
 */
router.get("/", contractGraphMiddleware, async (_req, res) => {
  const contracts = await res.locals.query;
  res.json(contracts);
});

/**
 * Creates a new consumer contract
 * @param {string} contract - The contract
 * @param {string} consumerName - The consumer name
 * @param {string} consumerVersion - The consumer version
 * @param {string} consumerBranch - The consumer branch
 * @returns {object} The created contract
 */
router.post("/", async (req, res) => {
  const { contract, consumerName, consumerVersion, consumerBranch } = req.body;

  if (!(await validateSchema(contract, "consumer"))) {
    return res.status(400).json({ error: "Contract schema is invalid" });
  }

  const consumer = await db.getParticipant(consumerName);

  if (
    await db.participantVersionExistsInIntegration(
      consumer.participantId,
      consumerVersion,
      contract.provider.name
    )
  ) {
    return res.status(409).json({
      error: "Contract for participant version in integration already exists",
    });
  }

  const contractRecord = await db.publishConsumerContract(
    contract,
    consumer.participantId,
    consumerVersion,
    consumerBranch
  );

  comp.compareWithProviderSpecs(contractRecord.consumerContractId);

  res.status(201).json(contractRecord);
});

/**
 * Gets a contract by id
 * @param {number} id - The contract id
 * @param {string[]} joinGraph - The graph to join
 * @returns {object} The contract
 */
// router.get("/:id", contractGraphMiddleware, async (req, res) => {
//   const { query } = res.locals;
//   const id = Number(req.params.id);
//   const contract = await query.findById(id);

//   if (!contract) {
//     res.status(404).send();
//   } else {
//     res.json(contract);
//   }
// });

// /**
//  * Updates a contract by id
//  * @param {number} id - The contract id
//  * @param {string} contractType - The type of contract
//  * @param {string} contract - The contract
//  * @returns {object} The updated contract
//  */
// router.put("/:id", async (req, res) => {
//   const { contractType, contract } = req.body;
//   const id = Number(req.params.id);
//   const updatedContract = await Contract.query().patchAndFetchById(id, {
//     contractType,
//     contract,
//   });
//   res.json(updatedContract);
// });

// /**
//  * Deletes a contract by id
//  * @param {number} id - The contract id
//  * @returns {object} The deleted contract
//  */
// router.delete("/:id", async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     const contract = await Contract.query().deleteById(Number(id));
//     if (!contract) {
//       res.status(404).send();
//     } else {
//       res.status(204).send();
//     }
//   } catch (err) {
//     res.status(500).send();
//   }
// });

export default router;
