import express from "express";
import "dotenv/config";
import api from "./routes.js";

let app = express();
let port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello app!" });
});

app.use("/api", api);

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
