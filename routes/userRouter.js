const { registerUser, verifyUser, logInUser, forgotUserPassword, resetUserPassword, changeUserPassword, logOut, getAllEventPlanner, updateEventPlanner, deleteEventPlanner } = require('../controllers/eventPlanner')
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changeUserPasswordSchema } = require('../middleware/validation')
const { authenticate } = require('../middleware/authentication')

const router = require('express').Router()

/**
 * @swagger
 * /register/User:
 *   post:
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
 *               example: "john.doe@example.com"
 *             password:
 *               type: string
 *               format: password
 *               example: "Password123"
 *             confirmPassword:
 *               type: string
 *               format: password
 *               example: "Password123"
 *             phoneNo:
 *               type: string
 *               example: "1234567890"
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
 * /verify/user/{token}:
 *   get:
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
 * /login/user:
 *   post:
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
 *               example: "john.doe@example.com"
 *             password:
 *               type: string
 *               format: password
 *               example: "Password123"
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
 * /forgot-password/user:
 *   post:
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
 *               example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Reset password link sent successfully
 *       404:
 *         description: Account not found
 */
router.post('/forgot-password/user', forgotPasswordSchema, forgotUserPassword);

/**
 * @swagger
 * /reset-password/user/{token}:
 *   post:
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
 *               example: "NewPassword123"
 *             confirmPassword:
 *               type: string
 *               format: password
 *               example: "NewPassword123"
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
 * /change/password/user/{id}:
 *   post:
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
 *               example: "OldPassword123"
 *             newPassword:
 *               type: string
 *               format: password
 *               example: "NewPassword123"
 *             confirmPassword:
 *               type: string
 *               format: password
 *               example: "NewPassword123"
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
 * /logout:
 *   post:
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
 * /update/user/{id}:
 *   put:
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
 *               example: "john.doe@example.com"
 *             phoneNo:
 *               type: string
 *               example: "1234567890"
 *             password:
 *               type: string
 *               format: password
 *               example: "UpdatedPassword123"
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/update/user/:id', updateEventPlanner);

/**
 * @swagger
 * /delete/user/{id}:
 *   delete:
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
router.delete('/delete/user/:id', deleteEventPlanner);

module.exports = router;
