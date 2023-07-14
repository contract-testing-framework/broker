import BaseModel from "./BaseModel.js";
import Contract from "./Contract.js";
import Participant from "./Participant.js";
import Spec from "./Spec.js";
import Environment from "./Environment.js";
import { unique } from "../utils/helpers.js";

class ParticipantVersion extends BaseModel {
  constructor({
    participantVersionId,
    consumerContracts = [],
    providerSpecs = [],
    participant = {},
    createdAt,
    updatedAt,
    participantVersion,
    participantId,
    participantBranch,
    environments = [],
    deployments = [],
  }) {
    super({ createdAt, updatedAt });
    this.id = participantVersionId;
    this.consumerContracts = consumerContracts.map(
      (contract) => new Contract(contract)
    );
    this.providerSpecs = providerSpecs.map((spec) => new Spec(spec));
    this.participant = new Participant(participant);
    this.version = participantVersion;
    this.participantId = participantId;
    this.participantBranch = participantBranch;
    this.environments = environments.map(
      (environment) => new Environment(environment)
    );
    this.deployments = deployments;
  }

  environmentNames() {
    return unique(
      this.environments.map((environment) => environment.name).sort()
    );
  }
}

export default ParticipantVersion;
