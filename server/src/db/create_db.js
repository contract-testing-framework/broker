import Knex from "knex";
import "dotenv/config";
import dbConfigs from "./knexfile.js";

console.log("> Running database setup script...");

const config = dbConfigs[process.env.NODE_ENV];

if (!config) {
  throw new Error(
    `Server Error: unable to connect to database - invalid RUNTIME_ENV: ${process.env.NODE_ENV}.`
  );
}

const creationConfig = {
  ...config,
  connection: {
    ...config.connection,
  },
};

const { database } = config.connection;

delete creationConfig.connection.database;

const creationConnection = Knex(creationConfig);

async function createDatabase() {
  try {
    await creationConnection.raw(`CREATE DATABASE ${database}`);
    console.log(`  - Database '${database}' created successfully.`);
  } catch (error) {
    console.error(`  - Error creating database: ${error.message}`);
  } finally {
    await creationConnection.destroy();
  }
}

const migrationConnection = Knex(config);

async function runMigrations() {
  try {
    await migrationConnection.migrate.latest();
    console.log("  - Migrations ran successfully.\n");
  } catch (error) {
    console.error(`Error running migrations: ${error.message}\n`);
  } finally {
    await migrationConnection.destroy();
  }
}

(async () => {
  await createDatabase();
  await runMigrations();
})();
