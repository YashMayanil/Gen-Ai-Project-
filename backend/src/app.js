const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes.js")


app.use(express.json())

// using all the routes here 
app.use("/api/auth",authRouter)

module.exports = app;