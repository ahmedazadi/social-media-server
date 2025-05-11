import express from "express";
import router from "./modules";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", router);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
