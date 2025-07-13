import EventEmitter from "events";
import feedA from "./feedA.js";

class DelayB extends EventEmitter {
  constructor(maxLagMs = 5 * 60_000) {
    super();
    const lag = Math.random() * maxLagMs;
    setTimeout(
      () =>
        feedA.on("new", (records) => {
          this.emit("ready", records);
        }),
      lag
    );
  }
}

export default new DelayB();
