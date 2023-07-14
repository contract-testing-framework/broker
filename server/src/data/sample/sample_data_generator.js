// sample_data_generator.js

import { faker } from "@faker-js/faker";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// const randomName = faker.person.fullName(); // Rowan Nikolaus
// const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz

// console.table({ randomName, randomEmail });

/**
 * Return a random integer between `min` and `max`
 * (both inclusive)
 * @param {number} min
 * @param {number} max
 * @returns
 */
const getRandomInt = function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const srcDir = dirname(fileURLToPath(import.meta.url));

const template = fs.readFileSync(
  srcDir + "/../data/sample/sieveService-sieveProvider.json"
);

const randomParticipantName = () =>
  faker.science.chemicalElement().name.toLowerCase() + "Service";

const generateContract = (consumerName, providerName) => {
  consumerName = consumerName || randomParticipantName();
  providerName = providerName || randomParticipantName();

  const contract = JSON.parse(template);
  contract.consumer.name = consumerName;
  contract.provider.name = providerName;

  const contractPath =
    srcDir + `/../data/sample/${consumerName}-${providerName}.json`;

  // console.log(contract);
  fs.writeFileSync(contractPath, JSON.stringify(contract, null, 2));
  return contract;
};

const publishContracts = (contract) => {
  const contractPath =
    srcDir +
    `/../data/sample/${contract.consumer.name}-${contract.provider.name}.json`;

  const specPath = srcDir + `/../data/sample/sieve-server-spec_v3.json`;

  execSync(
    `${srcDir}/../../../signet publish --path=${contractPath} --type=consumer --version=${
      "1" || getRandomInt(0, 100)
    } --branch=main --broker-url=http://localhost:3001`
  );
  execSync(
    `${srcDir}/../../../signet publish --path=${specPath} --type=provider --provider-name=${
      contract.provider.name
    } --version=${
      "A" || getRandomInt(0, 100)
    } --branch=main --broker-url=http://localhost:3001`
  );

  execSync(
    `rm ${srcDir}/../data/sample/${contract.consumer.name}-${contract.provider.name}.json`
  );
};

// for (let i = 0; i < 4; i++) {
publishContracts(generateContract("cobaltService", "magnesiumService"));
// publishContracts(generateContract(undefined, "platinumService"));
// publishContracts(generateContract("radiumService"));
// }
