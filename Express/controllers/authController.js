const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/AppError');


const signToken= id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req , res) => {
    const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
});

    const token = signToken(newUser._id);
    
    res.status(200).json({
        status: "success",
        token,
        data : newUser
    });
});

exports.login = (req,res,next) => {
    const {email , password} = req.body;

    // 1) if email and password exist
    if(!email) return next(new AppError("Please provide email",400)); 
    if(!password) return  next(new AppError("Please provide password",400)); 


    //2) if the user exist , if password correct
    const user = User.findOne({email});

    //3) send webtoken
    const token = 'l'
    res.status(200).json({
        status : 'success',
        token
    });

}

