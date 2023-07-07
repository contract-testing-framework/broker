import request from 'supertest';
import server from '../../app.js';
import db from "../../db/databaseClient.js";

const REQ_BODY = {
  "participantName": "user_service",
  "participantVersion": "version1",
  "environmentName": "production",
  "deployed": true
};

describe('Test PATCH /api/participants', () => {
  test('returns 400 when no participantName is passed', async () => {
    const malformedBody = { ...REQ_BODY, participantName: '' };

    const res = await request(server)
      .patch('/api/participants')
      .send(malformedBody);

    expect(res.status).toEqual(400);
    expect(res.body).toEqual({error: 'Request body is invalid'});
  });

  test('returns 400 when deployed field is not passed', async () => {
    const malformedBody = {
      "participantName": "user_service",
      "participantVersion": "version1",
      "environmentName": "production",
    };

    const res = await request(server)
      .patch('/api/participants')
      .send(malformedBody);

    expect(res.status).toEqual(400);
    expect(res.body).toEqual({error: 'Request body is invalid'});
  });

  test('returns 400 when participantVersion does not exist for participantName', async () => {
    const res = await request(server)
      .patch('/api/participants')
      .send(REQ_BODY);

    expect(res.status).toEqual(400);
    expect(res.body).toEqual({error: 'Participant version does not exist'});
  });

  test('returns 200, and creates versions_environments record', async () => {
    
  });
});