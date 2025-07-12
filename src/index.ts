import express from "express";
import live from "./services/live.js";

live.on("data_fetched", (data) => {
  console.log("Data fetched", data);
});

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Eventual consistency example");
});

app.listen(port, () => {
  console.log(`Example listening at ${port}`);
});
