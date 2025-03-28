const { registerUser, verifyUser, logInUser, forgotUserPassword, resetUserPassword, changeUserPassword, logOut } = require('../controllers/userController')

const router = require('express').Router()

router.post('/register/User', registerUser);

router.get('/verify/user/:token', verifyUser);

router.post('/login/user', logInUser);

router.post('/forgot-password/user', forgotUserPassword);

router.post('/reset-password/user/:token', resetUserPassword);

router.post('/change/password/user/:id', changeUserPassword);

router.post('/logout',  logOut);





module.exports = router