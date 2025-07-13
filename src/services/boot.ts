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
        console.log(`📦 [Boot] RECEIVED from DelayB at ${new Date().toLocaleTimeString()}`);
        console.log(`   Previous buffer size: ${Object.keys(this.bootBuffer).length}`);
        console.log(`   New records size: ${Object.keys(records).length}`);
        
        this.bootBuffer = records;
        
        console.log(`   Buffer updated with ${Object.keys(this.bootBuffer).length} total records`);
        
        if (!this.isFirstLoadComplete) {
          this.isFirstLoadComplete = true;
          console.log(`🎉 [Boot] FIRST LOAD COMPLETE at ${new Date().toLocaleTimeString()}`);
          console.log(`   Transitioning from ${mode} to LIVE mode`);
          console.log(`   Records in first load:`, this.bootBuffer);
          this.emit("first_load", this.bootBuffer);
        } else {
          console.log(`🔄 [Boot] UPDATING existing buffer (not first load)`);
        }

        if (mode === "BOOT") {
          setMode("LIVE");
          console.log(`   ✅ Mode changed to LIVE`);
        }
      });
    } catch (error) {
      console.log(`❌ [Boot] Error during the first load:`, error);
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
      console.log(`⏳ [Boot] Waiting for first load to complete...`);
      await this.getFirstLoad();
    }

    console.log(`📊 [Boot] RETURNING data: ${Object.keys(this.bootBuffer).length} records`);
    return this.bootBuffer;
  }
}

export default new Boot();
