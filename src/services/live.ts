import boot from "./boot.js";
import EventEmitter from "events";

class Live extends EventEmitter {

  constructor() {
    super();
    this.startLiveData();
  }

  private startLiveData() {
    boot.on("first_load", async () => {
      setInterval(async () => {
        const currentData = await boot.getData();
        this.emit("data_fetched", currentData);
      }, 30_000);
    });
  }
}

export default new Live();
