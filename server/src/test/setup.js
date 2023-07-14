import knex from "../db/db";
import server from "../app";

import {
  patchPgForTransactions,
  startTransaction,
  rollbackTransaction,
} from "pg-transactional-tests";

patchPgForTransactions();

beforeEach(startTransaction);

afterEach(rollbackTransaction);

afterAll(async () => {
  knex.destroy();
  server.close();
});
