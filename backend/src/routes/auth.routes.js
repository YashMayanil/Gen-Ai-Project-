const express = require('express');
const authController = require("../controllers/auth.controller")
const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @acess public
 */

authRouter.post("/register", authController.registeruserController)

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access PUBLIC
 */

authRouter.post("/login",authController.loginUserController)

module.exports = authRouter;