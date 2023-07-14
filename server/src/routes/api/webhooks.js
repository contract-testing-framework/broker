import express from "express";
import db from "../../db/databaseClient.js";
const router = express.Router();
import "express-async-errors";

// creates a new webhook subscription.
router.post("/", async (req, res) => {
  if (!req.body.integrationId) {
    return res.status(400).send({ error: "Invalid request body" });
  }

  if (!(await db.integrationExists(req.body.integrationId))) {
    return res
      .status(400)
      .send({ error: "There is no integration with that integrationId" });
  }

  const subscriptionRecord = await db.createWebhookSubscription(req.body);

  res.status(201).send(subscriptionRecord);
});

export default router;
