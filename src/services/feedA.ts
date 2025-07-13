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
      const timestamp = Date.now();
      records[id] = timestamp;

      console.log(`\n🔄 [FeedA] NEW RECORD at ${new Date().toLocaleTimeString()}`);
      console.log(`   Record ID: ${id}`);
      console.log(`   Total records in feed: ${Object.keys(records).length}`);
      console.log(`   Current records:`, records);

      this.emit("new", records);
    }, 30_000);
  }
}

export default new FeedA();
