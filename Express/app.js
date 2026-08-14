const express = require('express');
const morgan = require('morgan');

const app = express();

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
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;