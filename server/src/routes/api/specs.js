import express from "express";
import db from "../../db/databaseClient.js";
import webhook from "../../services/webhookService.js";
import comp from "../../services/comparisonService.js";
import { validateSchema } from "../../services/contractSchema.js";
import YAML from "yaml";
import "express-async-errors";

const router = express.Router();

/**
 * Creates a new provider spec
 * @param {string} spec - The spec
 * @param {string} providerName - The provider name
 * @param {'json'|'yaml'} specFormat - The spec format
 * @param {string} providerVersion
 * @param {string} providerBranch
 * @returns {object} The created spec
 */
router.get("/", async (req, res) => {
  const providerName = req.query.provider;
  if (providerName) {
    let providerId;
    try {
      providerId = await db.getProviderId(providerName);
    } catch {
      return res.status(400).send({ error: "Provider not found." });
    }

    const latestSpec = await db.getLatestProviderSpec(providerId);
    if (!latestSpec) {
      return res.status(400).send({ error: "No specs found for provider" });
    }

    return res.send(latestSpec.spec.specText);
  } else {
    const specs = (await db.getAllProviderSpecs()).map(
      (spec) => spec.spec.specText
    );
    res.send(specs);
  }
});

router.post("/", async (req, res) => {
  let { spec, providerName, specFormat, providerVersion, providerBranch } =
    req.body;

  if (specFormat === "yaml") {
    spec = YAML.parse(spec);
  }

  if (!(await validateSchema(spec, "provider"))) {
    return res.status(400).json({ error: "Spec schema is invalid" });
  }

  const provider = await db.getParticipant(providerName);

  const specRecord = await db.publishProviderSpec(
    spec,
    provider.participantId,
    specFormat,
    providerVersion,
    providerBranch
  );

  webhook.newSpecEvent(specRecord);

  if (providerVersion) {
    webhook.providerVerifiedEvent(specRecord);
  }

  comp.compareWithConsumerContracts(specRecord.providerSpecId);

  res.status(201).json(specRecord);
});

export default router;
