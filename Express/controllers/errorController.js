const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,              // full error object
        message: err.message,
        stack: err.stack         // full stack trace
    });
};

const sendErrorProd = (err, res) => {
    // Only send safe, expected errors with details
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Unknown/programming errors: don't leak details
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};



module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    console.log("class class")
    if(process.env.NODE_ENV == 'development'){
        sendErrorDev(err,res);
    }else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }
  
};