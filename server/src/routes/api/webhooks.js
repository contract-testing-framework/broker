import express from "express";
import db from "../../db/databaseClient.js";
const router = express.Router();

/*
Creates a new webhook subscription. 

Request Body:
{
  integrationId: int
  events: {              // omitted events default to false when creating a new subscription
    specPublish: bool
    providerVerification: bool
    comparison: bool
  }
  url: string
  enabled: bool       (optional - defaults to true)
  description: string (optional)
  headers: string     (optional - we don't do anything with this right now)
  payload: string     (optional - we don't do anything with this right now)
}
*/
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
