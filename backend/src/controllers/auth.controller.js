const userModel = require("../models/user.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



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
        {id:userModel._id,username:user.username},
        process.env.JWT_SECRET_KEY,
        {expiresIn:"1d"}
    )

    res.cookie("token",token);

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @name loginUserController
 * @description login user accepts email and passwords from body
 * @access Public 
 */


async function loginUserController (){
    
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
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)
    res.status(200).json({
        message:"User looged in successfully",
        user:{
            id:newUser._id,
            username:user.username,
            email:user.email,
        }
    })
}

module.exports = {registeruserController,loginUserController}