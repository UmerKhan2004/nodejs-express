const express = require('express');
const morgan = require('morgan');

const app = express();

// MIDDLEWARES
console.log(process.env.NODE_ENV);
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

// Custom middleware
app.use((req, res, next) => {
    console.log("hello from the middleware");
    next();
});





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

module.exports = app;