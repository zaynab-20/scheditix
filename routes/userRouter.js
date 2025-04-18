const {registerUser,verifyUser,logInUser,forgotUserPassword,resetUserPassword,changeUserPassword,logOut,deleteEventPlanner,getAllUser,updatePrifileImage, updateUser,} = require("../controllers/eventPlanner");
const { authenticate } = require("../middleware/authentication");
const {registerSchema,loginSchema,forgotPasswordSchema,resetPasswordSchema,changeUserPasswordSchema,} = require("../middleware/validation");

const router = require("express").Router();
const upload = require("../utils/multer");

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
router.post("/reset-password/user/:token",resetPasswordSchema,resetUserPassword);

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
router.post("/change-password/user/:id",changeUserPasswordSchema,changeUserPassword);

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
router.post("/logout", authenticate, logOut);

/**
 * @swagger
 * /api/v1/update/profile:
 *   put:
 *     summary: Update user profile image
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePic
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file to upload
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile image updated successfully
 *                 data:
 *                   type: object
 *                   example:
 *                     profilePicUrl: "https://example.com/uploads/profile.jpg"
 *       400:
 *         description: Bad request (e.g., no file uploaded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.put("/update/profile",authenticate,upload.single("profilePic"),updatePrifileImage);

/**
 * @swagger
 * /api/v1/update/user/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     description: This endpoint allows you to update a user's fullname and phone number.
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The ID of the user to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               phoneNo:
 *                 type: string
 *                 example: 123-456-7890
 *     responses:
 *       200:
 *         description: User has been updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/update/user/:userId", updateUser)
/**
 * @swagger
 * /api/v1/Users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         schema:
 *           type: array
 *           users:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "12345"
 *               name:
 *                 type: string
 *                 example: "Sample Item"
 *               description:
 *                 type: string
 *                 example: "This is a sample item"
 *       500:
 *         description: Internal Server Error
 */
router.get("/getAll/user", getAllUser);

/**
 * @swagger
 * /api/v1/delete/user/{userId}:
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
router.delete("/delete/user/:userId", authenticate, deleteEventPlanner);

module.exports = router;
