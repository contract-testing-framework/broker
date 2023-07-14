// Path compression is implemented
// Rank compression is not
class DSU {
  constructor(integrations) {
    this.sets = [];
    this.integrations = integrations;

    for (const integration of integrations) {
      this.union(integration.consumer.id, integration.provider.id);
    }
  }

  find(x) {
    if (!this.sets[x]) {
      return x;
    }

    this.sets[x] = this.find(this.sets[x]);
    return this.sets[x];
  }

  union(x, y) {
    const xRoot = this.find(x);
    const yRoot = this.find(y);

    if (xRoot != yRoot) this.sets[xRoot] = yRoot;
  }

  equal(x, y) {
    return this.find(x) === this.find(y);
  }

  filter(x) {
    return this.integrations.filter((integration) =>
      this.equal(x, integration.consumer.id)
    );
  }
}

export default DSU;
