import express from "express";
import contractsRouter from "./contracts.js";
import specsRouter from "./specs.js";
import participantsRouter from "./participants.js";
import integrationsRouter from "./integrations.js";
import webhooksRouter from "./webhooks.js";
import environmentsRouter from "./environments.js";
import deployRouter from "./deploy.js";
import "express-async-errors";

const router = express.Router();

router.use("/contracts", contractsRouter);
router.use("/specs", specsRouter);
router.use("/participants", participantsRouter);
router.use("/integrations", integrationsRouter);
router.use("/webhooks", webhooksRouter);
router.use("/environments", environmentsRouter);
router.use("/deploy", deployRouter);

router.use((err, req, res, next) => {
  res.status(403).send({ error: err.message });
  next(err);
});

export default router;
