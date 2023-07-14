import ConsumerContract from "../models/ConsumerContract.js";
import ProviderSpec from "../models/ProviderSpec.js";
import VersionSpec from "../models/VersionSpec.js";
import Participant from "../models/Participant.js";
import ParticipantVersion from "../models/ParticipantVersion.js";
import Integration from "../models/Integration.js";
import VersionContract from "../models/VersionContract.js";
import WebhookSubscription from "../models/WebhookSubscription.js";
import Environment from "../models/Environment.js";
import VersionEnvironment from "../models/VersionEnvironment.js";
import objectHash from "object-hash";
import Comparison from "../models/Comparison.js";
import {
  findOrCreate,
  findAndUpdateOrCreate,
  fmtJG,
} from "../utils/queryHelpers.js";

class DatabaseClient {
  async getParticipant(participantName) {
    return await findOrCreate(Participant, { participantName });
  }

  async participantVersionExistsInIntegration(
    participantId,
    participantVersion,
    providerName
  ) {
    const provider = await Participant.query().findOne({
      participantName: providerName,
    });

    if (!provider) return false;

    return !!(
      (await ParticipantVersion.query().findOne({
        participantId,
        participantVersion,
      })) &&
      (await Integration.query().findOne({
        consumerId: participantId,
        providerId: provider.participantId,
      }))
    );
  }

  async publishConsumerContract(
    contract,
    participantId,
    participantVersion,
    participantBranch
  ) {
    const { participantVersionId } = await findOrCreate(
      ParticipantVersion,
      { participantId, participantVersion },
      { participantId, participantVersion, participantBranch }
    );

    const contractHash = objectHash.MD5(contract);

    const providerId = (
      await findOrCreate(Participant, {
        participantName: contract.provider.name,
      })
    ).participantId;

    const integrationId = (
      await findOrCreate(Integration, {
        consumerId: participantId,
        providerId,
      })
    ).integrationId;

    const contractRecord = await findOrCreate(
      ConsumerContract,
      { contractHash, consumerId: participantId },
      {
        consumerId: participantId,
        integrationId,
        contract: {
          contractText: contract,
        },
        contractFormat: "json",
        contractHash,
      }
    );

    await VersionContract.query().insert({
      consumerContractId: contractRecord.consumerContractId,
      consumerVersionId: participantVersionId,
    });

    return contractRecord;
  }

  async publishProviderSpec(
    spec,
    providerId,
    specFormat,
    providerVersion,
    providerBranch
  ) {
    const specHash = objectHash.MD5(spec);

    const specRecord = await findAndUpdateOrCreate(
      ProviderSpec,
      { specHash, providerId },
      {
        spec: {
          specText: spec,
        },
        specFormat,
        specHash,
        providerId,
        updatedAt: new Date().toISOString(),
      }
    );

    if (providerVersion) {
      const { participantVersionId } = await findAndUpdateOrCreate(
        ParticipantVersion,
        {
          participantId: providerId,
          participantVersion: providerVersion,
        },
        {
          participantId: providerId,
          participantVersion: providerVersion,
          participantBranch: providerBranch,
        }
      );

      await findOrCreate(VersionSpec, {
        providerSpecId: specRecord.providerSpecId,
        providerVersionId: participantVersionId,
      });
    }

    return specRecord;
  }

  async getIntegrationData() {
    const joinGraph = ["consumer", "provider"];

    const integrations = await Integration.query().withGraphJoined(
      fmtJG(joinGraph)
    );

    return integrations;
  }

  async getIntegrationById(id) {
    const joinGraph = [
      "consumer",
      "provider",
      "comparisons.[consumerContract.consumerVersions.[environments, deployments.environment], providerSpec.providerVersions.[environments, deployments.environment]]",
    ];
    const integrationById = await Integration.query()
      .findById(Number(id))
      .withGraphJoined(fmtJG(joinGraph));

    return integrationById;
  }

  async deleteIntegration(id) {
    const integration = await Integration.query().deleteById(Number(id));

    return integration;
  }

  async getConsumerContract(consumerContractId) {
    return await ConsumerContract.query().findById(consumerContractId);
  }

  async getProviderId(participantName) {
    return (await Participant.query().findOne({ participantName }))
      .participantId;
  }

  async getIntegration(consumerId, providerId) {
    return await Integration.query().findOne({ consumerId, providerId });
  }

  async getProviderSpecs(providerId) {
    return await ProviderSpec.query().where({ providerId });
  }

  async getProviderSpec(providerSpecId) {
    return await ProviderSpec.query().findById(providerSpecId);
  }

  async getAllProviderSpecs() {
    return await ProviderSpec.query();
  }

  async getLatestProviderSpec(providerId) {
    return await ProviderSpec.query()
      .where({ providerId })
      .orderBy("updatedAt", "desc")
      .first();
  }

  async getIntegrationsByProviderId(providerId) {
    return await Integration.query().where({ providerId });
  }

  async getConsumerContractsByIntegrationId(integrationId) {
    return await ConsumerContract.query().where({ integrationId });
  }

  async integrationExists(integrationId) {
    return !!(await Integration.query().findById(integrationId));
  }

  async createWebhookSubscription(details) {
    const {
      integrationId,
      events,
      url,
      enabled,
      description,
      headers,
      payload,
    } = details;

    const specPublishEvents = events.specPublish || false;
    const providerVerificationEvents = events.providerVerification || false;
    const comparisonEvents = events.comparison || false;

    return await findAndUpdateOrCreate(
      WebhookSubscription,
      { integrationId, url },
      {
        integrationId,
        specPublishEvents,
        providerVerificationEvents,
        comparisonEvents,
        url,
        enabled,
        description,
        headers,
        payload,
      }
    );
  }

  async getParticipantById(participantId) {
    return await Participant.query().findById(participantId);
  }

  async getURLsForEvent(event, integrationIds) {
    const records = await WebhookSubscription.query()
      .select("url")
      .innerJoin(
        "integrations",
        "webhookSubscriptions.integrationId",
        "integrations.integrationId"
      )
      .where("enabled", true)
      .where(event, true)
      .whereIn("webhookSubscriptions.integrationId", integrationIds);

    return records.map((record) => record.url);
  }

  async createEnvironment(environmentName) {
    return await findOrCreate(Environment, { environmentName });
  }

  async getProviderVersionsForEnv(environmentId) {
    //console.log(environmentId, typeof environmentId);
    const providerVersions = await VersionSpec.query()
      .innerJoin(
        "participantVersions",
        "participantVersions.participantVersionId",
        "versionsSpecs.providerVersionId"
      )
      .innerJoin(
        "versionsEnvironments",
        "versionsEnvironments.participantVersionId",
        "participantVersions.participantVersionId"
      )
      .innerJoin(
        "environments",
        "environments.environmentId",
        "versionsEnvironments.environmentId"
      )
      .where({ "environments.environmentId": environmentId })
      .select("participantVersions.*");

    return providerVersions;
  }

  async addParticipantVersionToEnvironment(
    participantVersionId,
    environmentId
  ) {
    return await findOrCreate(VersionEnvironment, {
      participantVersionId,
      environmentId,
    });
  }

  async getParticipantVersion(participantName, participantVersion) {
    return (
      await ParticipantVersion.query()
        .select("participantVersionId")
        .innerJoin(
          "participants",
          "participants.participantId",
          "participantVersions.participantId"
        )
        .where("participantName", participantName)
        .where("participantVersion", participantVersion)
    )[0];
  }

  async removeParticipantFromEnvironment(participantVersionId, environmentId) {
    return await VersionEnvironment.query()
      .delete()
      .where({
        participantVersionId,
        environmentId,
      });
  }

  // Given participantId
  // Get all provider records for participant
  async getProviders(participantId) {
    return Participant.query()
      .innerJoin(
        "integrations",
        "integrations.providerId",
        "participants.participantId"
      )
      .where("integrations.consumerId", participantId);
  }

  // Given participantId
  // Get all consumer records for participant
  async getConsumers(participantId) {
    return Participant.query()
      .innerJoin(
        "integrations",
        "integrations.consumerId",
        "participants.participantId"
      )
      .where("integrations.providerId", participantId);
  }

  // Given environmentId
  // Get all participant versions deployed on environment
  async getVersionsOnEnv(envId) {
    return ParticipantVersion.query()
      .innerJoin(
        "versionsEnvironments",
        "versionsEnvironments.participantVersionId",
        "participantVersions.participantVersionId"
      )
      .innerJoin(
        "environments",
        "environments.environmentId",
        "versionsEnvironments.environmentId"
      )
      .where("environments.environmentId", envId);
  }

  async getEnvironments() {
    return Environment.query();
  }

  async getEnvironmentById(environmentId) {
    return Environment.query().findOne({ environmentId });
  }

  // Given participantVersionId
  // Get all compatible provider versions for participant
  async getCompatibleProviderVersions(participantVersionId) {
    return ParticipantVersion.query()
      .innerJoin(
        "versionsSpecs",
        "versionsSpecs.providerVersionId",
        "participantVersions.participantVersionId"
      )
      .innerJoin(
        "providerSpecs",
        "providerSpecs.providerSpecId",
        "versionsSpecs.providerSpecId"
      )
      .innerJoin(
        "comparisons",
        "comparisons.providerSpecId",
        "providerSpecs.providerSpecId"
      )
      .innerJoin(
        "consumerContracts",
        "consumerContracts.consumerContractId",
        "comparisons.consumerContractId"
      )
      .innerJoin(
        "versionsContracts",
        "versionsContracts.consumerContractId",
        "consumerContracts.consumerContractId"
      )
      .where("versionsContracts.consumerVersionId", participantVersionId)
      .where("comparisons.comparisonStatus", "Success");
  }
  // Given participantVersionId
  // Get all copmatible consumer versions for participant
  async getCompatibleConsumerVersions(participantVersionId) {
    return ParticipantVersion.query()
      .innerJoin(
        "versionsContracts",
        "versionsContracts.consumerVersionId",
        "participantVersions.participantVersionId"
      )
      .innerJoin(
        "consumerContracts",
        "consumerContracts.consumerContractId",
        "versionsContracts.consumerContractId"
      )
      .innerJoin(
        "comparisons",
        "comparisons.consumerContractId",
        "consumerContracts.consumerContractId"
      )
      .innerJoin(
        "providerSpecs",
        "providerSpecs.providerSpecId",
        "comparisons.providerSpecId"
      )
      .innerJoin(
        "versionsSpecs",
        "versionsSpecs.providerSpecId",
        "providerSpecs.providerSpecId"
      )
      .where("versionsSpecs.providerVersionId", participantVersionId)
      .where("comparisons.comparisonStatus", "Success");
  }

  async getComparisons() {
    return Comparison.query();
  }

  async getParticipantVersionById(participantVersionId) {
    return ParticipantVersion.query().findOne({ participantVersionId });
  }

  async getVersions() {
    return ParticipantVersion.query();
  }

  async getParticipants() {
    return Participant.query();
  }

  async getDeployGuardData() {
    const joinGraph = ["versions.environments"];
    return Participant.query().withGraphJoined(fmtJG(joinGraph));
  }

  async getVersionsContracts() {
    return VersionContract.query();
  }
}

export default new DatabaseClient();
