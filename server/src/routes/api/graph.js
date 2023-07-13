import express from "express";

import ConsumerContract from "../../models/ConsumerContract.js";
import ProviderSpec from "../../models/ProviderSpec.js";
import Participant from "../../models/Participant.js";
import ParticipantVersion from "../../models/ParticipantVersion.js";
import Integration from "../../models/Integration.js";
import Comparison from "../../models/Comparison.js";
import "express-async-errors";

import { fmtJG } from "../../utils/queryHelpers.js";

const router = express.Router();

const models = {};

[
  Comparison,
  ConsumerContract,
  ProviderSpec,
  Participant,
  ParticipantVersion,
  Integration,
].forEach((model) => {
  models[model.tableName] = model;
});

router.use("/:modelPath", async (req, res) => {
  const { modelPath } = req.params;
  const model = models[modelPath];

  if (!model) {
    res.status(404).send();
    return;
  }

  let query = model.query();

  const { joinGraph } = req.body;

  if (joinGraph) {
    query = query.withGraphJoined(fmtJG(joinGraph));
  }

  const results = await query;

  res.json(results);
});

export default router;
