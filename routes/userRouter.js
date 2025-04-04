const { registerUser, verifyUser, logInUser, forgotUserPassword, resetUserPassword, changeUserPassword, logOut,  updateEventPlanner, deleteEventPlanner } = require('../controllers/eventPlanner')
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changeUserPasswordSchema } = require('../middleware/validation')
const { authenticate } = require('../middleware/authentication')

const router = require('express').Router()

/**
 * @swagger
 * /api/v1/register/User:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: This endpoint allows a new user to register with their personal details.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User registration details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - fullname
 *             - email
 *             - password
 *             - phoneNo
 *             - confirmPassword
 *           properties:
 *             fullname:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               format: email
 *               example: "zatoloye@gmail.com"
 *             password:
 *               type: string
 *               format: password
 *               example: "Ade&20b"
 *             confirmPassword:
 *               type: string
 *               format: password
 *               example: "Ade&20b"
 *             phoneNo:
 *               type: string
 *               example: "9123456789"
 *             role:
 *               type: string
 *               example: "Event Planner"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/register/User', registerSchema, registerUser);

/**
 * @swagger
 * /api/v1/verify/user/{token}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Verify a user's email
 *     description: This endpoint is used to verify a user's email address with a token sent during registration.
 *     parameters:
 *       - in: path
 *         name: token
 *         description: Token for verification
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Account not found
 */
router.get('/verify/user/:token', verifyUser);

/**
 * @swagger
 * /api/v1/login/user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login a user
 *     description: This endpoint allows a user to log in using their email and password.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User login credentials
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: "zatoloye@gmail.com"
 *             password:
 *               type: string
 *               format: password
 *               example: "Ade&20b"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Account not found
 */
router.post('/login/user', loginSchema, logInUser);

/**
 * @swagger
 * /api/v1/forgot-password/user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Forgot password
 *     description: This endpoint sends a password reset link to the user's email.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User's email to receive reset link
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: "zatoloye@gmail.com"
 *     responses:
 *       200:
 *         description: Reset password link sent successfully
 *       404:
 *         description: Account not found
 */
router.post('/forgot-password/user', forgotPasswordSchema, forgotUserPassword);

/**
 * @swagger
 * /api/v1/reset-password/user/{token}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset password
 *     description: This endpoint allows a user to reset their password using a valid token.
 *     parameters:
 *       - in: path
 *         name: token
 *         description: Token for resetting password
 *         required: true
 *         type: string
 *       - in: body
 *         name: passwords
 *         description: New password details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - newPassword
 *             - confirmPassword
 *           properties:
 *             newPassword:
 *               type: string
 *               format: password
 *               example: "Ade&20br"
 *             confirmPassword:
 *               type: string
 *               format: password
 *               example: "Ade&20br"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Passwords do not match
 *       404:
 *         description: User not found
 */
router.post('/reset-password/user/:token', resetPasswordSchema, resetUserPassword);

/**
 * @swagger
 * /api/v1/change/password/user/{id}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Change user password
 *     description: This endpoint allows a user to change their current password.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User's ID
 *         required: true
 *         type: string
 *       - in: body
 *         name: passwords
 *         description: User's current password and new password
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - currentPassword
 *             - newPassword
 *             - confirmPassword
 *           properties:
 *             currentPassword:
 *               type: string
 *               format: password
 *               example: "Ade&20br"
 *             newPassword:
 *               type: string
 *               format: password
 *               example: "Ade&20br1"
 *             confirmPassword:
 *               type: string
 *               format: password
 *               example: "Ade&20br1"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Incorrect password or passwords do not match
 *       404:
 *         description: User not found
 */
router.post('/change/password/user/:id', authenticate, changeUserPasswordSchema, changeUserPassword);

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Logout a user
 *     description: This endpoint allows a user to log out from their session.
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal Server Error
 */
router.post('/logout', authenticate, logOut);

/**
 * @swagger
 * /api/v1/update/user/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user details
 *     description: This endpoint allows an event planner to update their details.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User's ID
 *         required: true
 *         type: string
 *       - in: body
 *         name: user
 *         description: Updated user details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               format: email
 *               example: "zatoloye@gmail.com"
 *             phoneNo:
 *               type: string
 *               example: "9123456789"
 *             password:
 *               type: string
 *               format: password
 *               example: "Ade&20br1"
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/update/user/:id', authenticate, updateEventPlanner);

/**
 * @swagger
 * /api/v1/delete/user/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     description: This endpoint allows an admin to delete a user from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User's ID
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/delete/user/:id', authenticate, deleteEventPlanner);

module.exports = router;