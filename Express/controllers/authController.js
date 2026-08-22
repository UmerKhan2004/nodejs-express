const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

exports.signup = catchAsync(async (req , res) => {
    const newUser = User.create(req.body);
    
    res.status(200).json({
        data : newUser,
        status : "Success"
    });
});

