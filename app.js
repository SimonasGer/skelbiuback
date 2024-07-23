const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
app.use(express.json());

module.exports = app;

app.use("/users", userRoutes);