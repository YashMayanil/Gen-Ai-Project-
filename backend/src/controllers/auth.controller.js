const userModel = require("../models/user.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model.js");


/**
 * @name registerUserController
 * @description Register a new user with username, password email
 * @access public
 */

async function registeruserController(req,res){
    const {email,username,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username, email and password"
        })
    }

    const isUserExists = await userModel.findOne({
        $or:[ {username} , {email} ]
    })

    if(isUserExists){
        return res.status(400).json({
            message:"Account already exits with this username or email"
        })
    }

    const hash = await bcrypt.hash(password,10);

    const newUser = await userModel.create ({
        username,
        email,
        password:hash,
    })

    const token = jwt.sign(
        {id:newUser._id,username:newUser.username},
        process.env.JWT_SECRET_KEY,
        {expiresIn:"1d"}
    )

    res.cookie("token",token);  // it directly logs in when use gets registerd 

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:newUser._id,
            username:newUser.username,
            email:newUser.email
        }
    })
}

/**
 * @name loginUserController
 * @description login user accepts email and passwords from body
 * @access Public 
 */

async function loginUserController (req,res){
    
    const {email , password} = req.body;

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400),json({
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET_KEY,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)
    res.status(200).json({
        message:"User looged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        }
    })
}

/**
 * @name logoutUserController 
 * @description clear token from user cookie and add the token in blacklist
 * @acess public 
 */

async function logoutUserController (req,res){
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({
                message: "No token found"
            });
        }

        // Add token to blacklist
        await tokenBlackListModel.create({ token });

        // Clear cookie
        res.clearCookie("token");

        res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Logout failed",
            error: error.message
        });
    }
}


/**
 * @name getMeController 
 * @description get the current logged in user details
 * @access public
 */

async function getMeController(req,res){
    
    const user = await userModel.findById(req.user.id);
    
    res.status(200).json({
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports = {registeruserController,loginUserController,logoutUserController,getMeController}