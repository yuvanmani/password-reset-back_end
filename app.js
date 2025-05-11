const express = require("express");
const authRouter = require("./routes/authRoutes");
const logger = require("./utils/logger");
const cors = require("cors");

const app = express();
// middleware to enable CORS
app.use(cors ({
    origin : "https://task12-password-reset-front-end.netlify.app",
    credentials : true
}))

// middleware to parse JSON request bodies
app.use(express.json());

// middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// middleware to log requests
app.use(logger);

app.use("/api/v1/users", authRouter);

module.exports = app;