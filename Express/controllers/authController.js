const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/AppError');
const sendEmail = require('./../controllers/email');
const { token } = require('morgan');
const { default: rateLimit } = require('express-rate-limit');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    }); 

    return newObj;
};

const signToken= id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}; 

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() +
            process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        data: {
            user
        },
        token : token
    });
};



exports.signup = catchAsync(async (req , res) => {
    const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: Date(),
    role : req.body.role
});

    createSendToken(newUser,200,res);
});

exports.login = catchAsync(async(req,res,next) => {
    const {email , password} = req.body;

    // 1) if email and password exist
    if(!email) return next(new AppError("Please provide email",400)); 
    if(!password) return  next(new AppError("Please provide password",400)); 


    //2) if the user exist , if password correct
    const user = await User.findOne({
    email,
    active: { $ne: false }
     }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
}

    //3) send webtoken
    // const token = signToken(user._id)
    // res.status(200).json({
    //     status : 'User login',
    //     token
    // });
    createSendToken(user, 200,res)
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it exists
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }


    if (!token) {
        return next(new AppError('You are not logged in', 401));
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser || currentUser.active === false) {
      return next(
        new AppError('This account has been deactivated.', 401)
    );
}
    // 4) Check if user changed password after the token was issued
     if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

    // GRANT ACCESS
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));   
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    
    return next(
      new AppError('There was an error sending the email. Try again later!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is a user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();   // set BEFORE save

    await user.save();

    // 3) Log the user in
    createSendToken(user,200,res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const { passwordCurrent, password, passwordConfirm } = req.body;

    // 0) Make sure all fields were sent
    if (!passwordCurrent || !password || !passwordConfirm) {
        return next(
            new AppError(
                'Please provide passwordCurrent, password and passwordConfirm',
                400
            )
        );
    }

    // 1) Get user from collection (with password)
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if the current password is correct
    if (!(await user.correctPassword(passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    // 3) Update password (validators + pre-save hooks handle confirm check and hashing)
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    // 4) Log user in, send new JWT
    createSendToken(user,200,res);
});

exports.updateMe = catchAsync(async (req,res,next) => {
    //1 ) check dont have password
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError("THis route is not for password",401));
    }

    //2) filter out unwanted fields
    const filteredBody = filterObj(req.body,"name" ,"email");

    const updateUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new : true,
            runValidators : true
        }
    );
    res.status(200).json({
        status : "success",
        data : {
            user : updateUser
        }
    })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false
    });

    res.status(200).json({
        status: 'success',
        data: null
    });
});