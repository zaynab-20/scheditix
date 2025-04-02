const Joi = require("joi");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

// Registration Validation Schema
exports.registerSchema = (req, res, next) => {
  const schema = Joi.object({
    userName: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().required(),
    phoneNo: Joi.string().min(10).max(15).pattern(/^[0-9]+$/).required().messages({
      "string.pattern.base": "Phone number must contain only digits",
      "string.min": "Phone number is too short",
      "string.max": "Phone number is too long",
    }),
    password: Joi.string().pattern(passwordPattern).required().messages({
      "string.pattern.base": "Password must be at least 6 characters long, and include uppercase, lowercase, digit, and special character",
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      "any.only": "Passwords do not match",
    }),
    role: Joi.string().valid('Admin', 'Organizer').optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message});
  }
  next();
};

// Login Validation Schema
exports.loginSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message});
  }
  next();
};

// Forgot Password Validation Schema
exports.forgotPasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message});
  }
  next();
};

// Reset Password Validation Schema
exports.resetPasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    newPassword: Joi.string().pattern(passwordPattern).required().messages({
      "string.pattern.base": "Password must be at least 6 characters long, and include uppercase, lowercase, digit, and special character",
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      "any.only": "Passwords do not match",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message});
  }
  next();
};

// Change Password Validation Schema
exports.changeUserPasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(passwordPattern).required().messages({
      "string.pattern.base": "Password must be at least 6 characters long, and include uppercase, lowercase, digit, and special character",
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      "any.only": "Passwords do not match",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message});
  }
  next();
};


const eventValidationSchema = Joi.object({
  eventTitle: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Event title is required",
    "string.min": "Event title must be at least 3 characters",
    "string.max": "Event title cannot exceed 100 characters",
  }),
  eventDate: Joi.date().iso().required().messages({
    "date.base": "Event date must be a valid date",
    "any.required": "Event date is required",
  }),
  eventTime: Joi.string().required().messages({
    "string.empty": "Event time is required",
  }),
  eventLocation: Joi.string().trim().min(3).max(200).required().messages({
    "string.empty": "Location is required",
    "string.min": "Location must be at least 3 characters",
    "string.max": "Location cannot exceed 200 characters",
  }),
  eventAgenda: Joi.string().trim().min(5).max(1000).required().messages({
    "string.empty": "Agenda is required",
    "string.min": "Agenda must be at least 5 characters",
    "string.max": "Agenda cannot exceed 1000 characters",
  }),
  eventDescription: Joi.string().trim().min(10).max(3000).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot exceed 3000 characters",
  }),

  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL"
  }),
  eventCategory: Joi.string().required().messages({
    "string.empty": "Event type is required"
  })
});

exports.validateEvent = (req, res, next) => {
  const { error } = eventValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: error.details.map(err => err.message)
    });
  }
  next();
};

