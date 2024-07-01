export class WebSocketClient {
  static init() {
    if (process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
      const client = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
      client.onopen = () => {
        client.send(
          JSON.stringify({
            command: "join",
            topics: ["fixtures", "events", "live_standings"],
          }),
        );
      };

      client.onmessage = (evt: MessageEvent) => {
        const { topic, payload } = JSON.parse(evt.data);
        const detail =
          typeof payload === "string" ? JSON.parse(payload) : payload;
        const event = new CustomEvent(topic, { detail });
        window.dispatchEvent(event);
      };
    } else {
      console.warn(
        "Warning: WebSocket not initialized, you should set NEXT_PUBLIC_WEBSOCKET_URL env variable",
      );
    }
  }
}
