const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');


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

