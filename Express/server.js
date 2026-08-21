process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});




const mongoose = require('mongoose');
const dotenv = require('dotenv'); 
const app = require('./app');


dotenv.config({ path: './config.env'});


const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify : false
}).then(con => {
    console.log("Connection Succesfull");
});



const port = process.env.PORT || 3000; 
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});


process.on('unhandledRejection' , err => {
    console.log(err.name , err.message);
    console.log("Shutting down server");
    server.close(() => {
        process.exit(1);
    });
});