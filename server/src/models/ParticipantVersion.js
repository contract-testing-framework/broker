import BaseModel from "./BaseModel.js";
import ConsumerContract from "./ConsumerContract.js";
import ProviderSpec from "./ProviderSpec.js";
import Participant from "./Participant.js";
import Environment from "./Environment.js";
import VersionEnvironment from "./VersionEnvironment.js";

class ParticipantVersion extends BaseModel {
  static get tableName() {
    return "participantVersions";
  }
  static get idColumn() {
    return "participantVersionId";
  }

  static get relationMappings() {
    return {
      consumerContracts: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: ConsumerContract,
        join: {
          from: "participantVersions.contractId",
          to: "versionsContracts.consumerContractId",
        },

        to: "consumerContracts.consumerContractId",
      },
      providerSpecs: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: ProviderSpec,
        join: {
          from: "participantVersions.contractId",
          to: "versionsSpecs.providerSpecId",
        },

        to: "providerSpecs.providerSpecId",
      },
      participant: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Participant,
        join: {
          from: "participantVersions.participantId",
          to: "participants.participantId",
        },
      },
      environments: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Environment,
        join: {
          from: "participantVersions.participantVersionId",
          through: {
            from: "versionsEnvironments.participantVersionId",
            to: "versionsEnvironments.environmentId",
          },
          to: "environments.environmentId",
        },
      },
      deployments: {
        relation: BaseModel.HasManyRelation,
        modelClass: VersionEnvironment,
        join: {
          from: "participantVersions.participantVersionId",
          to: "versionsEnvironments.participantVersionId",
        },
      },
    };
  }
}

export default ParticipantVersion;
