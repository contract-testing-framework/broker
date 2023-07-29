class SSE {
  connect(handler) {
    this.eventSource = new EventSource("/api/events");

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handler(data);
    };
  }

  close() {
    this.eventSource.close();
  }
}

export default new SSE();
