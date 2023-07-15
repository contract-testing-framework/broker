import express from "express";
import db from "../../db/databaseClient.js";
import comp from "../../services/comparisonService.js";
import { validateSchema } from "../../services/contractSchema.js";
import "express-async-errors";

const router = express.Router();

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

export default router;
