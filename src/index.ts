import express from "express";
import live from "./services/live.js";

console.log(`🌟 [App] Starting at ${new Date().toLocaleTimeString()}`);
console.log(`   Server will listen on port 3000`);
console.log(`   Waiting for first data to load...`);

live.on("data_fetched", (data) => {
  console.log(`🎯 [App] FINAL DATA RECEIVED at ${new Date().toLocaleTimeString()}`);
  console.log(`   Total records: ${Object.keys(data).length}`);
  console.log(`   This completes the eventual consistency cycle!`);
  console.log(`   Final data:`, data);
  console.log(`   ===================================`);
});

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Eventual consistency example");
});

app.listen(port, () => {
  console.log(`🚀 [App] Server listening on port ${port}`);
});
