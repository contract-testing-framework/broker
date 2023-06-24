import express from "express";
import Integration from "../../models/Integration.js";

const router = express.Router();

/**
 * Gets all integrations
 * @returns {array} All integrations
 */
router.get("/", async (_req, res) => {
  const integrations = await Integration.query()
    .select(
      "integrations.*",
      "consumers.participantName as consumerName",
      "providers.participantName as providerName"
    )
    .join(
      "participants as consumers",
      "integrations.consumerId",
      "consumers.participantId"
    )
    .join(
      "participants as providers",
      "integrations.providerId",
      "providers.participantId"
    );

  res.json(integrations);
});

/**
 * Gets an integration by id
 * @param {number} id - The integration id
 * @returns {object} The integration
 */
router.get("/:id", async (req, res) => {
  const integration = await Integration.query()
    .select(
      "integrations.*",
      "consumers.participantName as consumerName",
      "providers.participantName as providerName"
    )
    .join(
      "participants as consumers",
      "integrations.consumerId",
      "consumers.participantId"
    )
    .join(
      "participants as providers",
      "integrations.providerId",
      "providers.participantId"
    )
    .findById(Number(req.params.id));

  res.json(integration);
});

/**
 * Deletes an integration by id
 * @param {number} id - The integration id
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const integration = await Integration.query().deleteById(Number(id));
    if (!integration) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).send();
  }
});

export default router;