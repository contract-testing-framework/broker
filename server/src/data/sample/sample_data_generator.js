// sample_data_generator.js

import { faker } from "@faker-js/faker";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import tmp from "tmp";

tmp.setGracefulCleanup();

// const brokerUrl = "https://signet-broker-wfq99.ondigitalocean.app";
const brokerUrl = "http://localhost:3001";

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
console.log(`srcDir = ${srcDir}`);
const template = fs.readFileSync(srcDir + "/sieveService-sieveProvider.json");

const randomServiceName = () =>
  faker.science.chemicalElement().name.toLowerCase() + "Service";

const generateContract = (consumerName, providerName) => {
  consumerName = consumerName || randomServiceName();
  providerName = providerName || randomServiceName();

  const contract = JSON.parse(template);
  contract.consumer.name = consumerName;
  contract.provider.name = providerName;

  const tmpObj = tmp.fileSync();
  const contractPath = tmpObj.name;

  fs.writeFileSync(contractPath, JSON.stringify(contract, null, 2));
  return [contract, contractPath];
};

const publishContracts = (contract, contractPath) => {
  const specPath = srcDir + `/sieve-server-spec_v3.json`;

  execSync(
    `signet publish --path=${contractPath} --type=consumer --version=${getRandomInt(
      0,
      100
    )} --branch=main --broker-url=${brokerUrl}`
  );
  execSync(
    `signet publish --path=${specPath} --type=provider --name=${
      contract.provider.name
    } --version=${getRandomInt(0, 100)} --branch=main --broker-url=${brokerUrl}`
  );
};

const generateAndPublish = (consumerName, providerName) => {
  const [contract, contractPath] = generateContract(consumerName, providerName);
  publishContracts(contract, contractPath);
};

const setup1 = () => {
  const serviceNames = [...Array(2)].map(() => {
    return randomServiceName();
  });

  for (let index = 0; index < 6; index++) {
    generateAndPublish(undefined, serviceNames[0]);
  }

  generateAndPublish(serviceNames[0], serviceNames[1]);
  generateAndPublish(serviceNames[1]);
};

setup1();

// const serviceNames = ["shoppingCartService", "paymentService"];

// generateAndPublish(serviceNames[0], serviceNames[1]);
