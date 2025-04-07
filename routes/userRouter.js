const { registerUser, verifyUser, logInUser, forgotUserPassword, resetUserPassword, changeUserPassword, logOut,  updateEventPlanner, deleteEventPlanner } = require('../controllers/eventPlanner')
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changeUserPasswordSchema } = require('../middleware/validation')
const { authenticate } = require('../middleware/authentication')

const router = require('express').Router()

/**
 * @swagger
 * /api/v1/register/User:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new event planner with the provided details.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               phoneNo:
 *                 type: string
 *                 example: "8123456789"
 *               password:
 *                 type: string
 *                 example: "StrongPass123"
 *               confirmPassword:
 *                 type: string
 *                 example: "StrongPass123"
 *     responses:
 *       201:
 *         description: Account registered successfully
 *       400:
 *         description: Bad request, invalid input or email already exists
 *       500:
 *         description: Internal Server Error
 */
router.post("/register/User", registerSchema, registerUser);

/**
 * @swagger 
 * /api/v1/verify/user/{token}:
 *   get:
 *     summary: Verify user account
 *     description: Verifies a user's email using the provided token.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for user verification
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/verify/user/:token", verifyUser);

/**
 * @swagger
 * /api/v1/login/user:
 *   post:
 *     summary: Log in a user
 *     description: Logs in a user with valid email and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal Server Error
 */
router.post("/login/user", loginSchema, logInUser);
/**
 * @swagger
 * /api/v1/forgot-password/user:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/forgot-password/user", forgotPasswordSchema, forgotUserPassword);

/**
 * @swagger
 * /api/v1/reset-password/user/{token}:
 *   post:
 *     summary: Reset user password
 *     description: Resets a user's password using a valid reset token.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "NewStrongPass123"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewStrongPass123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid or expired token, or passwords do not match
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/reset-password/user/:token", resetPasswordSchema, resetUserPassword);

/**
 * @swagger
 * /api/v1/change-password/user/{id}:
 *   post:
 *     summary: Change user password
 *     description: Changes a user's password after verifying their current password.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID for password change
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "OldPass123"
 *               newPassword:
 *                 type: string
 *                 example: "NewStrongPass123"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewStrongPass123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Incorrect current password or passwords do not match
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/change-password/user/:id", changeUserPasswordSchema, changeUserPassword);

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