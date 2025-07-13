import EventEmitter from "events";
import feedA from "./feedA.js";

class DelayB extends EventEmitter {
  constructor(maxLagMs = 5 * 60_000) {
    super();
    feedA.on("new", (records) => {
      const lag = Math.random() * maxLagMs;
      const lagSeconds = Math.round(lag / 1000);
      
      console.log(`⏳ [DelayB] RECEIVED from FeedA at ${new Date().toLocaleTimeString()}`);
      console.log(`   Applying random delay: ${lagSeconds}s`);
      console.log(`   Records count: ${Object.keys(records).length}`);
      
      setTimeout(() => {
        console.log(`✅ [DelayB] READY after ${lagSeconds}s delay at ${new Date().toLocaleTimeString()}`);
        console.log(`   Emitting ${Object.keys(records).length} records to Boot`);
        console.log(`   Records content in DelayB:`, records);
        this.emit("ready", records);
      }, lag);
    });
  }
}

export default new DelayB();
