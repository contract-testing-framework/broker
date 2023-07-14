import "dotenv/config";
import db from "../db/databaseClient.js";

class DeployService {
  async checkWithProviders(participantVersionId, envId) {
    const participantVersion = await db.getParticipantVersionById(
      participantVersionId
    );

    const providerMap = await this.getProviderMap(
      participantVersion.participantId,
      envId
    );

    const compatibleProviderVersions = new Set(
      (await db.getCompatibleProviderVersions(participantVersionId)).map(
        (providerVersion) => providerVersion.participantVersionId
      )
    );

    const environment = await db.getEnvironmentById(envId);

    const errors = [];

    for (const [providerId, versionIds] of providerMap) {
      const provider = await db.getParticipantById(providerId);

      if (versionIds.length === 0) {
        errors.push({
          title: "No compatible provider versions deployed",
          details: `Provider ${provider.participantName} has no versions deployed on ${environment.environmentName}`,
        });
      }

      for (let versionId of versionIds) {
        if (!compatibleProviderVersions.has(versionId)) {
          const providerVersion = await db.getParticipantVersionById(versionId);

          errors.push({
            title: "Incompatible provider version deployed",
            details: `Deployed provider ${provider.participantName} (version ${providerVersion.participantVersion}) on ${environment.environmentName} is not compatible`,
          });
        }
      }
    }
    return errors;
  }

  async checkWithConsumers(participantVersionId, envId) {
    const participantVersion = await db.getParticipantVersionById(
      participantVersionId
    );

    const consumerMap = await this.getConsumerMap(
      participantVersion.participantId,
      envId
    );

    const compatibleConsumerVersions = new Set(
      (await db.getCompatibleConsumerVersions(participantVersionId)).map(
        (consumerVersion) => consumerVersion.participantVersionId
      )
    );

    const environment = await db.getEnvironmentById(envId);
    const errors = [];

    for (const [consumerId, versionIds] of consumerMap) {
      const consumer = await db.getParticipantById(consumerId);

      for (let versionId of versionIds) {
        if (!compatibleConsumerVersions.has(versionId)) {
          const consumerVersion = await db.getParticipantVersionById(versionId);

          errors.push({
            title: "Incompatible consumer version deployed",
            details: `Deployed consumer ${consumer.participantName} (version ${consumerVersion.participantVersion}) on ${environment.environmentName} is not compatible`,
          });
        }
      }
    }
    return errors;
  }

  async getProviderMap(participantId, envId) {
    const providers = await db.getProviders(participantId);

    const providerMap = new Map();

    for (const provider of providers) {
      providerMap.set(provider.participantId, []);
    }

    const versions = await db.getVersionsOnEnv(envId);

    for (const version of versions) {
      if (providerMap.has(version.participantId)) {
        providerMap
          .get(version.participantId)
          .push(version.participantVersionId);
      }
    }
    return providerMap;
  }

  async getConsumerMap(participantId, envId) {
    const consumers = await db.getConsumers(participantId);

    const consumerMap = new Map();

    for (const consumer of consumers) {
      consumerMap.set(consumer.participantId, []);
    }

    const versions = await db.getVersionsOnEnv(envId);

    for (const version of versions) {
      if (consumerMap.has(version.participantId)) {
        consumerMap
          .get(version.participantId)
          .push(version.participantVersionId);
      }
    }
    return consumerMap;
  }
}

export default new DeployService();
