import { promises as fs } from "node:fs";
import { SwaggerMockValidatorFactory } from "../../node_modules/swagger-mock-validator/dist/swagger-mock-validator-factory.js";
import tmp from "tmp";

tmp.setGracefulCleanup();

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
