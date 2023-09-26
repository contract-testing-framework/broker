import { promises as fs } from "node:fs";
import { SwaggerMockValidatorFactory } from "../../node_modules/swagger-mock-validator/dist/swagger-mock-validator-factory.js";
import tmp from "tmp";

tmp.setGracefulCleanup();

const executionTimer = async function (func, ...args) {
  const label = func.name.padEnd(25);
  console.time(label);
  const result = await func(...args);
  console.timeEnd(label);
  return result;
};

export default class Verifier {
  async verify(pact, openAPISpec) {
    try {
      const [pactObj, OASobj] = await this.createFiles(pact, openAPISpec);

      const pactPath = pactObj.name;
      const OASPath = OASobj.name;

      const swaggerMockValidator = SwaggerMockValidatorFactory.create();

      const result = await swaggerMockValidator.validate({
        mockPathOrUrl: pactPath,
        specPathOrUrl: OASPath,
      });
      this.cleanUpFiles(pactObj, OASobj);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async createFiles(pact, openAPISpec) {
    const pactObj = tmp.fileSync();
    const oasObj = tmp.fileSync();

    await Promise.all([
      fs.writeFile(pactObj.name, JSON.stringify(pact)),
      fs.writeFile(oasObj.name, JSON.stringify(openAPISpec)),
    ]);

    return [pactObj, oasObj];
  }

  cleanUpFiles(pactObj, OASobj) {
    pactObj.removeCallback();
    OASobj.removeCallback();
  }
}

import pact from "../data/sample/samplePact.js";
import openAPISpec from "../data/sample/sampleOAS.js";
(async () => {
  const verifier = new Verifier();
  // console.log("pact", pact);
  // console.log("openAPISpec", openAPISpec);
  const label = "verify".padEnd(25);
  // executionTimer(verifier.verify, pact, openAPISpec);
  console.time(label);
  await verifier.verify(pact, openAPISpec);
  console.timeEnd(label);
})();
