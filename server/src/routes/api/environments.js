import express from "express";
import db from "../../db/databaseClient.js";
import "express-async-errors";
import { sseResponses } from "./events.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { environmentName } = req.body;

  if (!environmentName || typeof environmentName !== "string") {
    return res.status(400).json({
      error: "Request body must have an environmentName (string) property",
    });
  }

  const environmentRecord = await db.createEnvironment(environmentName);

  sseResponses.send({
    message: `Environment ${environmentName} has been registered!`,
  });

  res.status(201).json(environmentRecord);
});

export default router;
