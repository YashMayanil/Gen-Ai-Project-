const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes.js")
const interviewRouter = require("./routes/interview.routes.js")
const cookieparser = require("cookie-parser")
const cors = require("cors");

app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials:true,
}))
app.use(cookieparser())

// using all the routes here 
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter);

app.use((err, req, res, next) => {
    console.error("Express error:", err)
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    })
})

module.exports = app;