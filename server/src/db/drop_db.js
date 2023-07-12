import Knex from "knex";
import "dotenv/config";
import dbConfigs from "./knexfile.js";

const env = process.env.NODE_ENV;

console.log("> Running database teardown script ...");

if (!["test", "development"].includes(env)) {
  console.error(
    `  - Error: Aborting database teardown script because NODE_ENV=${env} and not "test" or "development".`
  );
  process.exit(1);
}

const config = dbConfigs[env];

if (!config) {
  throw new Error(
    `Server Error: unable to connect to database - invalid RUNTIME_ENV: ${env}.`
  );
}

const dropConfig = {
  ...config,
  connection: {
    ...config.connection,
  },
};

const { database } = config.connection;

delete dropConfig.connection.database;

const dbConn = Knex(dropConfig);

async function dropDatabase() {
  try {
    await dbConn.raw(`DROP DATABASE ${database}`);
    console.log(`  - Database '${database}' dropped successfully.\n`);
  } catch (error) {
    console.error(`  - Error creating database: ${error.message}`);
  } finally {
    await dbConn.destroy();
  }
}

dropDatabase();
