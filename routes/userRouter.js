const { registerUser, verifyUser, logInUser, forgotUserPassword, resetUserPassword, changeUserPassword, logOut } = require('../controllers/userController')
// const validate = require('../helper/utilities')
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changeUserPasswordSchema } = require('../middleware/validation')
const { authenticate } = require('../middleware/authentication')

const router = require('express').Router()

router.post('/register/User',registerSchema,registerUser);

router.get('/verify/user/:token', verifyUser);

router.post('/login/user',loginSchema,logInUser);

router.post('/forgot-password/user',forgotPasswordSchema,forgotUserPassword);

router.post('/reset-password/user/:token',resetPasswordSchema,resetUserPassword);

router.post('/change/password/user/:id',authenticate,changeUserPasswordSchema,changeUserPassword);

router.post('/logout',authenticate,logOut);

module.exports = router