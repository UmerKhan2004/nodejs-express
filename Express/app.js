const express = require('express');
const app = express();

const morgan = require('morgan');

const AppError = require('./utils/AppError.js');
const gloabalErrorHandler = require('./controllers/errorController');

const cookieParser = require('cookie-parser');

const  rateLimit = require('express-rate-limit');



// GLOBAL  MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
  max : 100,
  windowsMs : 60 * 60 * 1000,
  message : "Too many requests from this ip, try again later"
});



// ROUTES
const userRouter = require('./routes/userRoutes.js');
const tourRouter = require('./routes/tourRoutes.js');

app.use('/api' , limiter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*splat', (req, res, next) => {
  
// });res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server`
//   });

next(new AppError(`Can't find ${req.originalUrl} on this serverr`, 404));

});
app.use(gloabalErrorHandler);

module.exports = app;