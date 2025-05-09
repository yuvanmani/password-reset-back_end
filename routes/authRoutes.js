const express = require("express");
const { forgotPassword, resetPassword, register } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;