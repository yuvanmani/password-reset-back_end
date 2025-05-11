const express = require("express");
const { forgotPassword, resetPassword, register, openResetPassword } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/", register);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.get("/reset-password/:token", openResetPassword);

module.exports = authRouter;