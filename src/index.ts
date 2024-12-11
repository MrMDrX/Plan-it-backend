import express from "express";
import authRouter from "./routes/auth";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("PlanIt backend");
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
