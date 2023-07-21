import express from "express";
import "dotenv/config";
import morgan from "morgan";
import "./db/db.js";
import path from "path";

import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api/api.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import loggers from "./utils/loggers.js";
import rateLimit from "express-rate-limit";
import figlet from "figlet";
import chalk from "chalk";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

export const srcDir = dirname(fileURLToPath(import.meta.url));

app.use(morgan("dev"));
app.use(loggers.file.res());

app.use(express.static(srcDir + "/../dist"));

app.use(express.json());

app.use("/", indexRouter);
app.use("/api", apiRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(srcDir + "/../dist/index.html"));
});

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  figlet("Signet", (err, figletText) => {
    if (err) {
      console.log("Something went wrong...");
      return;
    }
    console.clear();

    if (process.env.NODE_ENV !== "test") {
      console.log(chalk.cyan(figletText));
    }
    console.log(
      `${chalk.green("➜")} Signet server running at ${chalk.yellow(
        `http://localhost:${PORT}`
      )}`
    );
  });
});

export default server;
