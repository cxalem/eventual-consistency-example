import boot from "./boot.js";
import EventEmitter from "events";

class Live extends EventEmitter {

  constructor() {
    super();
    this.startLiveData();
  }

  private startLiveData() {
    boot.on("first_load", async () => {
      console.log(`🚀 [Live] STARTING polling at ${new Date().toLocaleTimeString()}`);
      console.log(`   Will poll Boot service every 30 seconds`);
      
      setInterval(async () => {
        console.log(`\n📡 [Live] POLLING Boot at ${new Date().toLocaleTimeString()}`);
        const currentData = await boot.getData();
        console.log(`   Retrieved ${Object.keys(currentData).length} records from Boot`);
        console.log(`   Emitting data_fetched event`);
        this.emit("data_fetched", currentData);
      }, 30_000);
    });
  }
}

export default new Live();
