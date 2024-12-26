import express from "express";
import "dotenv/config";

let app = express();
let port = process.env.PORT;

app.get("/", (req, res) => {
  res.json({ message: "Hello app!" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
