const { createEvent, getOneEvent, getAllEvent, updateEvent, deleteEvent, getRecentEvents, getAllEventCategory, getFeaturedEventById, getTrendingEventById, getOverview} = require('../controllers/eventController');
const {validateEvent} = require('../middleware/validation');
const { authenticate } = require('../middleware/authentication');
const upload = require('../utils/multer');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/create-event/{categoryId}:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event category
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - eventTitle
 *               - eventDescription
 *               - eventLocation
 *               - startTime
 *               - endTime
 *               - startDate
 *               - endDate
 *               - totalTableNumber
 *               - totalSeatNumber
 *               - ticketPrice
 *               - ticketQuantity
 *               - ticketPurchaseLimit
 *               - parkingAccess
 *             properties:
 *               eventTitle:
 *                 type: string
 *                 example: "Tech Conference"
 *               eventDescription:
 *                 type: string
 *                 example: "A conference for tech enthusiasts"
 *               eventLocation:
 *                 type: string
 *                 example: "Landmark Event Center, Lagos"
 *               startTime:
 *                 type: string
 *                 example: "10:00AM"
 *               endTime:
 *                 type: string
 *                 example: "07:00PM"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-10"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-11"
 *               eventAgenda:
 *                 type: string
 *                 example: "Talks on AI, Blockchain, Cloud Tech"
 *               eventRule:
 *                 type: string
 *                 example: "No weapons allowed. Dress code: Smart casual."
 *               totalTableNumber:
 *                 type: integer
 *                 example: 20
 *               totalSeatNumber:
 *                 type: integer
 *                 example: 100
 *               ticketPrice:
 *                 type: number
 *                 example: 2000
 *               ticketQuantity:
 *                 type: number
 *                 example: 100
 *               ticketPurchaseLimit:
 *                 type: number
 *                 example: 3
 *               parkingAccess:
 *                 type: string
 *                 enum: [yes, no]
 *                 example: yes
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Upload event banner image
 *     responses:
 *       '201':
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event Created Successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       '403':
 *         description: Event limit reached for basic plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Basic plan limit: You can only create 2 events."
 *       '404':
 *         description: Event Planner or Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event Planner not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 */
router.post("/create-event/:categoryId", authenticate, upload.array('image'), validateEvent, createEvent);


/**
 * @swagger
 * /api/v1/event/{eventId}:
 *   get:
 *     summary: Retrieve a single event by its ID
 *     description: Fetches the details of a specific event, including its category name.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kindly find the event below"
 *                 data:
 *                   type: object
 *                   description: The event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/event/:eventId", getOneEvent);


/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Retrieve all events
 *     description: Fetches a list of all events, including their associated category name.
 *     tags:
 *       - Event Management
 *     responses:
 *       200:
 *         description: Successfully retrieved all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully Getting All Events"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Event details
 *       500:
 *         description: Internal Server Error
 */
router.get("/events", getAllEvent);

/**
 * @swagger
 * /api/v1/update/event/{eventId}/{categoryId}:
 *   put:
 *     summary: Update event time, date, location, and images
 *     description: Allows an authenticated user to update the event's time, date, location, and optionally upload new images. It will replace the old images with the new ones if provided.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to be updated
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update the event with
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               eventLocation:
 *                 type: string
 *                 example: "Lagos, Nigeria"
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "17:00"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-03"
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Optional new event images to upload
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event Updated Successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request, invalid input
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/update/event/:eventId/:categoryId", authenticate, upload.array('image'),updateEvent);

/**
 * @swagger
 * /api/v1/delete/event/{eventId}:
 *   delete:
 *     summary: Delete an event
 *     description: Allows an authenticated user to delete an event by its ID, including its associated images.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to be deleted
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *                 data:
 *                   type: object
 *                   description: Deleted event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/delete/event/:eventId", authenticate, deleteEvent);


/**
 * @swagger
 * /api/v1/recent/events:
 *   get:
 *     summary: Get the most recent events
 *     description: Retrieves the most recent events, including their status (upcoming, ongoing, completed), ticket sold, total attendees, revenue generated, and check-ins.
 *     tags:
 *       - Event Management
 *     responses:
 *       200:
 *         description: Successfully retrieved recent events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully retrieved recent events"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       eventName:
 *                         type: string
 *                         example: "Tech Summit 2025"
 *                       ticketSold:
 *                         type: string
 *                         example: "150/300"
 *                       totalAttendee:
 *                         type: integer
 *                         example: 150
 *                       revenueGenerated:
 *                         type: number
 *                         format: float
 *                         example: 500000
 *                       checkins:
 *                         type: integer
 *                         example: 100
 *                       status:
 *                         type: string
 *                         enum: [upcoming, ongoing, completed]
 *                         example: "ongoing"
 *                       eventCategory:
 *                         type: string
 *                         example: "Technology"
 *       500:
 *         description: Internal Server Error
 */
router.get("/recent/events", authenticate, getRecentEvents);

/**
 * @swagger
 * /api/v1/featured/{eventId}:
 *   get:
 *     summary: Retrieve a specific featured event by ID
 *     description: Fetch a single featured event using its unique ID. The event must be marked as featured.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the featured event to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved featured event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved featured event
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Event ID
 *                     eventTitle:
 *                       type: string
 *                       description: Title of the event
 *                     eventCategory:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         categoryName:
 *                           type: string
 *                     eventLocation:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     eventDescription:
 *                       type: string
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/your-cloud-name/image/upload/v1710000000/event-image.jpg
 *                     featured:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Featured event not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/featured/:eventId', getFeaturedEventById);

/**
 * @swagger
 * /api/v1/trending/{eventId}:
 *   get:
 *     summary: Retrieve a specific trending event by ID
 *     description: Fetch a single trending event using its unique ID. Trending events are typically those with the highest ticket sales.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the trending event to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved trending event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully retrieved trending event
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Event ID
 *                     eventTitle:
 *                       type: string
 *                       description: Title of the event
 *                     eventCategory:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         categoryName:
 *                           type: string
 *                     eventLocation:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     eventDescription:
 *                       type: string
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/your-cloud-name/image/upload/v1710000000/event-image.jpg
 *                     ticketSold:
 *                       type: integer
 *                       description: Number of tickets sold
 *       404:
 *         description: Trending event not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/trending/:eventId', getTrendingEventById);

/**
 * @swagger
 * /api/v1/event/{categoryId}:
 *   get:
 *     summary: Retrieve all events under a specific category
 *     description: Fetches a list of all events that belong to a specific category using the category ID. Each event includes its associated category name.
 *     tags:
 *       - Event Management
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event category
 *     responses:
 *       200:
 *         description: Successfully retrieved events by category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully Getting Events for Category ID"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Event ID
 *                       title:
 *                         type: string
 *                         description: Event title
 *                       eventCategory:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           categoryName:
 *                             type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       time:
 *                         type: string
 *                       location:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Internal Server Error
 */
router.get('/event/:categoryId',getAllEventCategory)

/**
 * @swagger
 * /api/v1/Overview:
 *   get:
 *     summary: Retrieve event platform overview statistics
 *     description: Fetches overall platform statistics including total tickets sold, total revenue generated, and total number of unique event organizers.
 *     tags:
 *       - Event Management
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully retrieved dashboard statistics"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTicketSold:
 *                       type: integer
 *                       description: Total number of tickets sold across all events
 *                       example: 4520
 *                     totalRevenue:
 *                       type: number
 *                       format: float
 *                       description: Total revenue generated from all events
 *                       example: 1895000.75
 *                     totalEventOrganizers:
 *                       type: integer
 *                       description: Total number of unique event organizers
 *                       example: 87
 *       500:
 *         description: Internal Server Error
 */
router.get('/Overview',getOverview)

module.exports = router;