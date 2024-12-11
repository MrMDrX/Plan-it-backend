import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("PlanIt backend");
});

app.listen(8000, () => {
    console.log("Server started on port 8000");
});