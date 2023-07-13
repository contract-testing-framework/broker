import request from 'supertest';
import server from '../../app.js';
import db from "../../db/databaseClient.js";

const REQ_BODY = {
  "integrationId": 1,
  "events": {
      "specPublish": true,
      "comparison": true
  },
  "url": "https://requestbinder.com/me",
  "description": "my team wants to know about these things..."
};

describe('POST /api/webhooks', () => {
  test('returns 400 when the integrationId does not exist in database', async () => {
    const res = await request(server)
      .post('/api/webhooks')
      .send(REQ_BODY);

    expect(res.status).toEqual(400);
    expect(res.body).toEqual({error: 'There is no integration with that integrationId'});
  });

  test('returns 400 when the request body is invalid', async () => {
    const res = await request(server)
      .post('/api/webhooks')
      .send({}); 

    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ error: 'Invalid request body' });
  });
});


