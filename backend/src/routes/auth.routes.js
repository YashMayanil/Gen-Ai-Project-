const express = require('express');
const authController = require("../controllers/auth.controller")
const authRouter = express.Router();
const {authUser} = require("../middlewares/auth.middleware.js")

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

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */

authRouter.post("/logout",authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @acess private
 */

authRouter.get("/get-me",authUser,authController.getMeController)

module.exports = authRouter;