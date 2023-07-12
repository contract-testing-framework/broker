import { jest } from "@jest/globals";
import request from "supertest";
import server from "../../app.js";
import contract from "../../test/data/cons-prov.json";
import contractRecord from "../../test/data/contractRecord.json";
import db from "../../db/databaseClient.js";
import comp from "../../services/comparisonService.js";

const REQ_BODY = {
  consumerName: "service_1",
  consumerVersion: "version1",
  consumerBranch: "main",
  contract: contract,
};

describe("POST /api/contracts", () => {
  const participant = {
    participantId: 1,
    participantName: "service_1",
    createdAt: "",
    updatedAt: "",
  };

  db.getParticipant = jest.fn();
  db.getParticipant.mockResolvedValue(participant);

  db.participantVersionExistsInIntegration = jest.fn();
  db.participantVersionExistsInIntegration.mockResolvedValue(false);

  test("returns 400 when contract schema is invalid", async () => {
    const malformedBody = {
      consumerName: "service_1",
      consumerVersion: "version1",
      consumerBranch: "main",
      contract: { ...contract, consumer: undefined },
    };

    const res = await request(server)
      .post("/api/contracts")
      .send(JSON.stringify(malformedBody));

    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ error: "Contract schema is invalid" });
  });

  test("returns 409 when consumer version already exists", async () => {
    db.participantVersionExistsInIntegration.mockResolvedValueOnce(true);

    const res = await request(server).post("/api/contracts").send(REQ_BODY);

    expect(res.status).toEqual(409);
    expect(res.body).toEqual({
      error: "Contract for participant version in integration already exists",
    });
  });

  test("calls databaseClient methods correctly, and returns 201", async () => {
    db.getParticipant = jest.fn();
    db.getParticipant.mockResolvedValue(participant);

    db.participantVersionExistsInIntegration = jest.fn();
    db.participantVersionExistsInIntegration.mockResolvedValue(false);

    db.publishConsumerContract = jest.fn();
    db.publishConsumerContract.mockResolvedValue(contractRecord);

    comp.compareWithProviderSpecs = jest.fn();

    const res = await request(server).post("/api/contracts").send(REQ_BODY);

    expect(res.status).toEqual(201);
    expect(db.getParticipant.mock.calls[0]).toEqual(["service_1"]);
    expect(db.participantVersionExistsInIntegration.mock.calls[0]).toEqual([
      1,
      "version1",
      "user_service",
    ]);
    expect(db.publishConsumerContract.mock.calls[0]).toEqual([
      contract,
      1,
      "version1",
      "main",
    ]);
    expect(comp.compareWithProviderSpecs.mock.calls[0]).toEqual([1]);
  });
});
