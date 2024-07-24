const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const dishRouter = require("./routes/dishRoutes");
app.use(express.json());

module.exports = app;

app.use("/users", userRoutes);
app.use("/dishes", dishRouter)