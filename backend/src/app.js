const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes.js")
const cookieparser = require("cookie-parser")


app.use(express.json())
app.use(cookieparser())

// using all the routes here 
app.use("/api/auth",authRouter)

module.exports = app;