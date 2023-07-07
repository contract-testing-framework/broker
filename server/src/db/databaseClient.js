import ConsumerContract from "../models/ConsumerContract.js";
import ProviderSpec from "../models/ProviderSpec.js";
import VersionSpec from "../models/VersionSpec.js";
import Participant from "../models/Participant.js";
import ParticipantVersion from "../models/ParticipantVersion.js";
import Integration from "../models/Integration.js";
import VersionContract from "../models/VersionContract.js";
import WebhookSubscription from "../models/WebhookSubscription.js";
import Comparison from "../models/Comparison.js";
import Environment from '../models/Environment.js';
import VersionEnvironment from '../models/VersionEnvironment.js'
import objectHash from "object-hash";
import {
  findOrCreate,
  findAndUpdateOrCreate,
  fmtJG,
} from "../utils/queryHelpers.js";

class DatabaseClient {
  async getParticipant(participantName) {
    return await findOrCreate(Participant, { participantName });
  }

  async participantVersionExists(participantId, participantVersion) {
    return !!(await ParticipantVersion.query().findOne({
      participantId,
      participantVersion,
    }));
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

    const specRecord = await findOrCreate(
      ProviderSpec,
      { specHash, providerId },
      {
        spec: {
          specText: spec,
        },
        specFormat,
        specHash,
        providerId,
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
      "comparisons.[consumerContract.consumerVersions, providerSpec.providerVersions]",
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

    const specPublishEvents          = events.specPublish          || false;
    const providerVerificationEvents = events.providerVerification || false;
    const comparisonEvents           = events.comparison           || false;

    return await findAndUpdateOrCreate(
      WebhookSubscription,
      {integrationId, url},
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
      },
    );
  }

  async getParticipantById(participantId) {
    return await Participant.query().findById(participantId);
  }

  async getURLsForEvent(event, integrationIds) {
    const records = await WebhookSubscription
    .query()
    .select('url')
    .innerJoin(
      'integrations',
      'webhookSubscriptions.integrationId',
      'integrations.integrationId'
    )
    .where('enabled', true)
    .where(event, true)
    .whereIn('webhookSubscriptions.integrationId', integrationIds);

    return records.map(record => record.url);
  }
  
  async createEnvironment(environmentName) {
    return await findOrCreate(
      Environment,
      { environmentName },
    );
  }

  async addParticipantVersionToEnvironment(participantVersionId, environmentId) {
    return await findOrCreate(
      VersionEnvironment,
      { participantVersionId,
        environmentId
      }
    )
  }

  async getParticipantVersion(participantName, participantVersion) {
     return (await ParticipantVersion
      .query()
      .select('participantVersionId')
      .innerJoin(
        'participants',
        'participants.participantId',
        'participantVersions.participantId'
      )
      .where('participantName', participantName)
      .where('participantVersion', participantVersion))[0];
  }

  async removeParticipantFromEnvironment(participantVersionId) {
    return await VersionEnvironment.query().deleteById(participantVersionId);
  }
}

export default new DatabaseClient();
