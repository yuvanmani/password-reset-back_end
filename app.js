const express = require("express");
const authRouter = require("./routes/authRoutes");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());
app.use(logger);

app.use("/api/v1/users", authRouter);

module.exports = app;