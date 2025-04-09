const { createCategory, getAllCategories, getOneCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { authenticate } = require('../middleware/authentication')

const router = require('express').Router()

/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create a new event category
 *     description: Allows an authenticated user to create a new event category.
 *     tags:
 *       - Category Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryName
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: Technology
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6613c1a0f28c1c71f8e44c7b
 *                     categoryName:
 *                       type: string
 *                       example: Technology
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Category name is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category is required
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
 *                 error:
 *                   type: string
 *                   example: Validation failed
 */
router.post('/category',authenticate,createCategory)

/**
 * @swagger
 * /api/v1/allCategories:
 *   get:
 *     summary: Retrieve all event categories
 *     description: Fetches a list of all available event categories from the database.
 *     tags:
 *       - Category Management
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved all categories
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6613c1a0f28c1c71f8e44c7b
 *                       categoryName:
 *                         type: string
 *                         example: Technology
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
router.get('/allCategories',getAllCategories)

/**
 * @swagger
 * /api/v1/oneCategory/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     description: Retrieves details of a specific event category using its ID.
 *     tags:
 *       - Category Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved category
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6613c1a0f28c1c71f8e44c7b
 *                     categoryName:
 *                       type: string
 *                       example: Technology
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: Cast to ObjectId failed
 */
router.get('/oneCategory/:id',getOneCategory)

/**
 * @swagger
 * /api/v1/updateCategory/{id}:
 *   put:
 *     summary: Update a category
 *     description: Updates the name of an existing event category using its ID.
 *     tags:
 *       - Category Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: Business
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6613c1a0f28c1c71f8e44c7b
 *                     categoryName:
 *                       type: string
 *                       example: Business
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: Cast to ObjectId failed
 */
router.put('/updateCategory/:id',authenticate,updateCategory)

/**
 * @swagger
 * /api/v1/deleteCategory/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a specific event category by its ID.
 *     tags:
 *       - Category Management
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6613c1a0f28c1c71f8e44c7b
 *                     categoryName:
 *                       type: string
 *                       example: Technology
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: Cast to ObjectId failed
 */
router.delete('/deleteCategory/:id',authenticate,deleteCategory)

module.exports = router