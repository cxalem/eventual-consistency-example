import EventEmitter from "events";
import delayB from "./delayB.js";
import { setMode, getMode } from "../states.js";

class Boot extends EventEmitter {
  private bootBuffer = [] as unknown as Record<string, number>[];
  private isFirstLoadComplete = false;

  constructor() {
    super();
    this.startAccumulating();
  }

  private startAccumulating() {
    const mode = getMode();
    try {
      delayB.on("ready", (records) => {
        this.bootBuffer = records;
        if (!this.isFirstLoadComplete) {
          this.isFirstLoadComplete = true;
          this.emit("first_load", this.bootBuffer);
          console.log("First load complete, changing to LIVE: ", this.bootBuffer);
        }

        if (mode === "BOOT") {
          setMode("LIVE");
        }
      });
    } catch (error) {
      console.log("Error during the first load");
      setMode("BOOT");
    }
  }

  async getFirstLoad() {
    if (this.isFirstLoadComplete) return this.bootBuffer;

    return new Promise((resolve) => {
      this.once("first_load", (buffer) => {
        resolve(buffer);
      });
    });
  }

  async getData() {
    if (!this.isFirstLoadComplete) {
      await this.getFirstLoad();
    }

    return this.bootBuffer;
  }
}

export default new Boot();
