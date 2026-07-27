const express= require('express');
const userController = require('./../controllers/userController.js');




const router = express.Router();

router.param('id', (req,res,next,value) => {
    console.log(`Tour id is :  ${value}`);
    next();
});

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser);

module.exports = router;