import db from "../db/databaseClient.js";

class WebhookService {
  async newSpecEvent(specRecord) {
    const providerRecord = await db.getParticipantById(specRecord.providerId);
    const integrationRecords = await db.getIntegrationsByProviderId(
      providerRecord.participantId
    );
    const integrationIds = integrationRecords.map(
      (record) => record.integrationId
    );

    const payload = {
      providerName: providerRecord.participantName,
      spec: specRecord.spec,
      publishedAt: specRecord.createdAt,
    };

    const urls = await db.getURLsForEvent("specPublishEvents", integrationIds);

    for (let url of urls) {
      this.sendWebhook(url, payload);
    }
  }

  sendWebhook(url, body) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };

    fetch(url, options);
  }

  async newComparisonEvent(comparison) {
    const integrationId = comparison.integrationId;
    const urls = await db.getURLsForEvent("comparisonEvents", [integrationId]);

    for (let url of urls) {
      this.sendWebhook(url, comparison);
    }
  }
}

export default new WebhookService();
