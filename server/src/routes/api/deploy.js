import express from "express";
import db from "../../db/databaseClient.js";
import deployService from "../../services/deployService.js";
import "express-async-errors";

const router = express.Router();

//localhost:3001/api/deploy?environmentName=prod

// Response: {status: "true" | "false", errors: [{title: "", details: ""}]}

// Consumer
// Depend on two providers
// Both of them do not have a provider version deployed on the environment

// Title: "Provider not deployed"
// Details: "Provider {name} does not have a version deployed on {env}"

// Testing Participant Name: Sieve
// Participant Version: 1
// Environment: Prod

// Sieve requires two providers
// Names: Provider1, Provider2
// Environment: Prod

// Sive is also a provider for two consumers
// Names: Consumer1, Consumer2
// Environment: Prod

// For us to be able to deploy Sieve on Prod, we need to verify that:
// 1. Both Provider 1 and Provider 2 have at least one version deployed on Prod
// 2. All versions of Provider 1 and Provider 2 deployed on Prod are compatible with Sieve version 1

// Provider 1 we can have version A and version B both deployed on Prod
// It's possible that version A is compatible with Sieve (satisfies condition 1)
// But version B is not compatible with Sieve
// This can happen in canary deployment

// 3. All versions of Consumer1 and Consumer2 deployed on Prod are compatible with Sieve version

// Approach
// Setup:
// - Want an object: providers
// - Keys: List of participant IDs that for all providers that Sieve depends on
// - Values: Array of all participant version IDs for participant that are deployed on Prod

// How do we find Keys
// We go through integrations table

// How do we find Values
// 1. Find all participant versions that are deployed on Prod
// 2. Look at participant id column in participant version
// 3. If participant id is a key of providers, providers[participantId].push(parrticipantVersionId)

// key: Provider (participant) 1 Id, Value: [Version A (participant version) id, Version B id]

// Verify 1st condition
// Iterating through all keys, check that length of value is greater than 0
// If length === 0, then we add an error to our errors array
// {title: "No provider deployed", details: "No versions of {participantName} is not deployed on Prod"}

// Verify 2nd condition
// Goal: For each participant verisons array, each participant version in the array must be compatible with Sieve version 1
// Bucket (Set): All provider version IDs that are compatible with Sieve version 1
// Iterate through each participant version, see if it's in our bucket
// If it's not in our bucket
// {title: "Deployed provider is not compatible", details: "Version {version} of {participantName} is not compatible with Sieve version 1"}

// How do we make the bucket?
// 1. Participant Versions Table
// 2. JOIN  with VersionsSpecs
// 3. JOIN with ProviderSpecs
// 4. JOIN with Comparisons
// 5. JOIN with ConsumerContracts
// 6. JOIN with VersionsContracts
// WHERE(Comparisons.status === "success", VersionsContracts.versionId === {sieveVersionId})
// SELECT(ParticipantVersions.participantVersionId)

// This gives us an array of record objects
// Map each record to just the versionId (integer)
// Turn into set

// Array vs Set
// Lookup: O(n) vs O(1)
// Set has no indexes
// Set cannot contain duplicate values
// Set has three main operations (add, delete, has)
// const set = new Set([array]);
// set.has(element)

// Verify 3rd Condition
// Want an object
// Keys: List of participant IDs that are consumers that depend on Sieve
// Values: Arrays of all participant version IDs for participant that are deployed on Prod
// Bucket (Set): All consumer version IDs that are compatible with Sieve version 1
// Iterate through each participant version, see if it's in our bucket
// If it's not in our bucket
// {title: "Deployed provider is not compatible", details: "Version {version} of {participantName} is not compatible with Sieve version 1"}

router.get("/", async (req, res) => {
  try {
    const { participantName, participantVersion, environmentName } = req.query;

    if (!participantName) {
      return res.status(400).send({ error: "participantName not given" });
    }
    if (!participantVersion) {
      return res.status(400).send({ error: "participantVersion not given" });
    }
    if (!environmentName) {
      return res.status(400).send({ error: "environmentName not given" });
    }

    const environment = await db.createEnvironment(environmentName);

    const version = await db.getParticipantVersion(
      participantName,
      participantVersion
    );

    if (!version) {
      return res.status(400).send({ error: "Cannot find participant version" });
    }

    const errors = [
      ...(await deployService.checkWithConsumers(
        version.participantVersionId,
        environment.environmentId
      )),
      ...(await deployService.checkWithProviders(
        version.participantVersionId,
        environment.environmentId
      )),
    ];

    const status = errors.length === 0 ? "true" : "false";

    return res.send({ status, errors });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: "Deploy check failed to finish" });
  }
});

router.get("/data", async (_req, res) => {
  try {
    const deployData = await db.getDeployGuardData();

    res.send(deployData);
  } catch (error) {
    res.status(400).send({ error: "There are no participants in the system." });
  }
});

export default router;
