import express from "express";
import "dotenv/config";
import api from "./routes.js";
import cors from "cors";

let app = express();
let port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api", api);

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
