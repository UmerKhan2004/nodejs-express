const express = require('express');
const app = express();

const morgan = require('morgan');

const AppError = require('./utils/AppError.js');
const gloabalErrorHandler = require('./controllers/errorController');


// MIDDLEWARES
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

// ROUTES
const userRouter = require('./routes/userRoutes.js');
const tourRouter = require('./routes/tourRoutes.js');

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