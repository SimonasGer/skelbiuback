const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const dishRouter = require("./routes/dishRoutes");
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/dishes", dishRouter)

module.exports = app;
