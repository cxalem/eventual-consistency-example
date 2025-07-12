import EventEmitter from "events";

class FeedA extends EventEmitter {
  constructor() {
    super();
    this.start();
  }

  start(): void {
    const records: Record<string, number> = {};
    setInterval(() => {
      const id = Math.random().toString(36).slice(2);

      records[id] = Date.now();

      this.emit("new", records);
    }, 30_000);
  }
}

export default new FeedA();
