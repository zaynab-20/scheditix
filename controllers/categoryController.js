const categoryModel = require('../models/category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {

      return res.status(400).json({ message: 'Category is required' });
    }

    const category = new categoryModel({ categoryName });
    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().populate('events');
    res.status(200).json({
      message: 'Successfully retrieved all categories',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get a single category by ID
exports.getOneCategory = async (req, res) => {
  try {
    const { id } = req.params; 
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Successfully retrieved category',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;  
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id, 
      { categoryName },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const {id} = req.params;  
    const category = await categoryModel.findByIdAndDelete(id);  

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category deleted successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// exports.updateEvent = async (req, res) => {
//   try {
//     const { eventId, categoryId } = req.params;
//     const {
//       eventTitle,
//       eventDescription,
//       eventLocation,
//       startDate,
//       endDate,
//       startTime,
//       endTime,
//       eventAgenda,
//       eventRule,
//       totalTableNumber,
//       totalSeatNumber,
//       ticketPrice,
//       ticketQuantity,
//       ticketPurchaseLimit,
//       parkingAccess,
//     } = req.body;

//     const file = req.file;

//     const event = await eventModel.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // Check if categoryId exists and is valid
//     const category = await categoryModel.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({ message: "Event category not found" });
//     }

//     // Handle image update
//     let image = event.image;
//     if (file && file.path) {
//       // Delete the old image from Cloudinary if it exists
//       if (image && image.imagePublicId) {
//         await cloudinary.uploader.destroy(image.imagePublicId);
//       }

//       const result = await cloudinary.uploader.upload(file.path);
//       fs.unlinkSync(file.path);

//       image = {
//         imageUrl: result.secure_url,
//         imagePublicId: result.public_id
//       };
//     }

//     // Update event fields
//     event.eventTitle = eventTitle || event.eventTitle;
//     event.eventDescription = eventDescription || event.eventDescription;
//     event.eventCategory = categoryId;
//     event.eventLocation = eventLocation || event.eventLocation;
//     event.startDate = startDate || event.startDate;
//     event.endDate = endDate || event.endDate;
//     event.startTime = startTime || event.startTime;
//     event.endTime = endTime || event.endTime;
//     event.eventAgenda = eventAgenda || event.eventAgenda;
//     event.eventRule = eventRule || event.eventRule;
//     event.totalTableNumber = totalTableNumber || event.totalTableNumber;
//     event.totalSeatNumber = totalSeatNumber || event.totalSeatNumber;
//     event.seatPerTable = totalSeatNumber && totalTableNumber ? totalSeatNumber / totalTableNumber : event.seatPerTable;
//     event.ticketPrice = ticketPrice || event.ticketPrice;
//     event.ticketQuantity = ticketQuantity || event.ticketQuantity;
//     event.ticketPurchaseLimit = ticketPurchaseLimit || event.ticketPurchaseLimit;
//     event.parkingAccess = parkingAccess || event.parkingAccess;
//     event.image = image;

//     await event.save();

//     res.status(200).json({
//       message: "Event updated successfully",
//       data: event
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

