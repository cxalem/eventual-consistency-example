import EventEmitter from "events";
import feedA from "./feedA.js";

class DelayB extends EventEmitter {
  constructor(maxLagMs = 5 * 60_000) {
    super();
    feedA.on("new", (records) => {
      const lag = Math.random() * maxLagMs;
      setTimeout(() => {
        this.emit("ready", records);
      }, lag);
    });
  }
}

export default new DelayB();
