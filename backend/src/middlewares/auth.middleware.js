const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model.js");

async function authUser(req, res, next){
    
    const token = req.cookies.token;
    
    if(!token){
        return res.status(401).json({
            message:"Token not provided"
        })
    }

    //***Check blacklist first
    const isBlacklisted = await tokenBlackListModel.findOne({ token });

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Token expired, please login again"
        });
    }
    
    try{
       // *** Correct verify
       const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

       req.user = decode;

       next();

    }catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }

}

module.exports = { authUser };