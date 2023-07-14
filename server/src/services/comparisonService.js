import "dotenv/config";
import Verifier from "./verification.js";
import Comparison from "../models/Comparison.js";
import db from "../db/databaseClient.js";
import { findAndUpdateOrCreate } from "../utils/queryHelpers.js";
import webhook from "./webhookService.js";

class ComparisonService {
  async compare(contractRecord, specRecord, integration) {
    const verifier = new Verifier();

    try {
      const result = await verifier.verify(
        contractRecord.contract.contractText,
        specRecord.spec.specText
      );

      const comparisonStatus = result.success ? "Success" : "Failed";

      const comparison = await findAndUpdateOrCreate(
        Comparison,
        {
          integrationId: integration.integrationId,
          consumerContractId: contractRecord.consumerContractId,
          providerSpecId: specRecord.providerSpecId,
        },
        {
          integrationId: integration.integrationId,
          consumerContractId: contractRecord.consumerContractId,
          providerSpecId: specRecord.providerSpecId,
          result,
          comparisonStatus: comparisonStatus,
        }
      );

      webhook.newComparisonEvent(comparison);

      return comparison;
    } catch (err) {
      console.error(err);
    }
  }

  async compareWithProviderSpecs(consumerContractId) {
    const contractRecord = await db.getConsumerContract(consumerContractId);

    const providerName = contractRecord.contract.contractText.provider.name;
    const providerId = await db.getProviderId(providerName);

    const integration = await db.getIntegration(
      contractRecord.consumerId,
      providerId
    );

    const specRecords = await db.getProviderSpecs(providerId);

    for (let specRecord of specRecords) {
      await this.compare(contractRecord, specRecord, integration);
    }
  }

  async compareWithConsumerContracts(specId) {
    const specRecord = await db.getProviderSpec(specId);
    const integrations = await db.getIntegrationsByProviderId(
      specRecord.providerId
    );

    for (let integration of integrations) {
      const contractRecords = await db.getConsumerContractsByIntegrationId(
        integration.integrationId
      );

      for (let contractRecord of contractRecords) {
        await this.compare(contractRecord, specRecord, integration);
      }
    }
  }
}

export default new ComparisonService();
