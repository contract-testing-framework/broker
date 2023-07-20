class SSEResponses {
  constructor() {
    this.responses = [];
  }

  add(res) {
    this.responses.push(res);
  }

  send(data) {
    for (const res of this.responses) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  remove(res) {
    res.end();
    this.responses.filter((response) => response !== res);
  }
}

export default new SSEResponses();
