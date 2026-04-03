const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes.js")
const cookieparser = require("cookie-parser")
const cors = require("cors");

app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(cookieparser())

// using all the routes here 
app.use("/api/auth",authRouter)

module.exports = app;