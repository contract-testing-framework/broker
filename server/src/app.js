import express from "express";
import "dotenv/config";
import morgan from "morgan";
import "./db/db.js";

import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api/api.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();

export const srcDir = dirname(fileURLToPath(import.meta.url));

app.use(morgan("tiny"));

console.log(`srcDir = ${srcDir}`);
app.use(express.static(srcDir + "/../../client/dist"));

app.use(express.json());

app.use("/", indexRouter);
app.use("/api", apiRouter);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(
    `\x1b[92m➜\x1b[0m Server running on port\x1b[96m http://localhost:${PORT}\x1b[0m`
  );
});

export default server;
