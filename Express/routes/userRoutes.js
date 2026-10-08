const express= require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');
const rateLimit = require('express-rate-limit')


const router = express.Router();
// router.param('id', (req,res,next,value) => {
//     console.log(`Tour id is :  ${value}`);
//     next();
// });

const loginLimiter = rateLimit({
    max :3,
    windowMs : 60*60*1000,
    message : "too many try , Try again later"
});

router
    .route('/updateuser')
    .patch(authController.protect , authController.updateMe);

router
    .route('/updatepassword')
    .patch(authController.protect , authController.updatePassword); 

router.post('/signup' , authController.signup);
router.post('/login', loginLimiter ,  authController.login);

router.post('/forgotPassword' , authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

router.delete('/deleteMe' ,authController.protect, authController.deleteMe);



router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser);

module.exports = router;