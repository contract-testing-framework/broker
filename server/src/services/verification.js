import { promises as fs } from "node:fs";
import { SwaggerMockValidatorFactory } from "../../node_modules/swagger-mock-validator/dist/swagger-mock-validator-factory.js";

export default class Verifier {
  async verify(pact, openAPISpec) {
    try {
      const [pactPath, OASPath] = await this.createFiles(pact, openAPISpec);

      const swaggerMockValidator = SwaggerMockValidatorFactory.create();

      const result = await swaggerMockValidator.validate({
        mockPathOrUrl: pactPath,
        specPathOrUrl: OASPath,
      });

      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async createFiles(pact, openAPISpec) {
    let { srcDir } = await import("../app.js");
    const tempDataPath = srcDir + "/data/temp/";

    const pactPath = tempDataPath + "verification_pact.json";
    const OASPath = tempDataPath + "verification_OAS.json";

    await Promise.all([
      fs.writeFile(pactPath, JSON.stringify(pact)),
      fs.writeFile(OASPath, JSON.stringify(openAPISpec)),
    ]);

    return [pactPath, OASPath];
  }

  cleanUpFiles(pactPath, OASPath) {
    function onError(err) {
      if (err) {
        console.error("Failed to cleanup a file. Error: ", err);
      }
    }

    fs.unlink(pactPath, onError);
    fs.unlink(OASPath, onError);
  }
}
