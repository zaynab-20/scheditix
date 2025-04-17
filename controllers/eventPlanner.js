const eventPlannerModel = require("../models/eventPlanner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verify, reset } = require("../utils/html");
const { send_mail } = require("../middleware/nodemailer");

exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password, phoneNo, confirmPassword } = req.body;
    const full_name = fullname.split(" ").map((e) => {
        return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase();
      }).join(" ");
      
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password does not match",
      });
    }

    const existingEmail = await eventPlannerModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingEmail) {
      return res.status(400).json({
        message: `${email.toLowerCase()} already exist`,
      });
    }
    const existingPhoneNo = await eventPlannerModel.findOne({
      phoneNo: "234" + phoneNo
      })

      if (existingPhoneNo) {
        return res.status(400).json({
          message: `${phoneNo} already exist`,
        });
        
      }


    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);


    const eventPlanner = new eventPlannerModel({
      fullname: full_name,
      email,
      phoneNo: "234" + phoneNo,
      password: hashedPassword,
      confirmPassword: hashedPassword
    });
    

    const token = jwt.sign(
      { eventPlannerId: eventPlanner._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const link = `https://schedi-tix-front-end.vercel.app/email-verification/${token}`;
    const firstName = eventPlanner.fullname;

    const mailOptions = {
      email: eventPlanner.email,
      subject: "Account Verification",
      html: verify(link, firstName),
    };

    await send_mail(mailOptions);
    await eventPlanner.save();
    res.status(201).json({
      message: `Account registered successfully check your gmail ${email} to verify ` ,
      data: eventPlanner,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "internal Server Error:" + error.message,
    });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const { eventPlannerId } = jwt.decode(token);
          const eventPlanner = await eventPlannerModel.findById(eventPlannerId);

          if (!eventPlanner) {
            return res.status(404).json({
              message: "Account not found",
            });
          }

          if (eventPlanner.isVerified === true) {
            return res.status(400).json({
              message: "Account is verified already",
            });
          }

          const newToken = jwt.sign(
            { eventPlannerId: eventPlanner._id },
            process.env.JWT_SECRET,
            { expiresIn: "10mins" }
          );
          const link = `https://scheditix.onrender.com/email-verification/${newToken}`;
          const firstName = eventPlanner.fullname.split(" ")[0];

          const mailOptions = {
            email: eventPlanner.email,
            subject: "Resend: Account Verification",
            html: verify(link, firstName),
          };

          await send_mail(mailOptions);
          res.status(200).json({
            message: "Session expired: Link has been sent to email address",
          });
        }
      } else {
        const eventPlanner = await eventPlannerModel.findById(
          payload.eventPlannerId
        );

        if (!eventPlanner) {
          return res.status(404).json({
            message: "Account not found",
          });
        }

        if (eventPlanner.isVerified === true) {
          return res.status(400).json({
            message: "Account is verified already",
          });
        }

        eventPlanner.isVerified = true;
        await eventPlanner.save();

        res.status(200).json({
          message: "Account verified successfully",
        });
      }
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Session expired: link has been sent to email address:" + error.message,
      });
    }
    res.status(500).json({
      message: "Error Verifying user",
    });
  }
};

exports.logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please enter your email address",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Please your password",
      });
    }
    const user = await eventPlannerModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Account not found",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    if (user.isVerified === false) {
      const token = jwt.sign(
        { userId: user._id, isLoggedIn: user.isLoggedIn},
        process.env.JWT_SECRET,
        {
          expiresIn: "5mins",
        }
      );
      const link = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/verify/user/${token}`;
      const firstName = user.fullname.split(" ")[0];

      const mailOptions = {
        email: user.email,
        subject: "Account Verification",
        html: verify(link, firstName),
      };

      await send_mail(mailOptions);
      return res.status(400).json({
        message: "Account is not verified, link has been sent to email address",
      });
    }

    user.isLoggedIn = true;
    const token = jwt.sign(
      { userId: user._id, isLoggedIn: user.isLoggedIn,plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: "1day" }
    );
    await user.save();

    if (user.role === "Admin") {
      return res.status(200).json({
        message: "Admin login successful",
        data: user,
        token,
      });
    } else if (user.role === "Organizer") {
      return res.status(200).json({
        message: "Organizer login successful",
        data: user,
        token,
      });
    } else if (user.role === "Attendee") {
      return res.status(200).json({
        message: "Attendee login successful",
        data: user,
        token,
      });
    }

    res.status(200).json({
      message: "Account login successfull",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "internal Server Error:" + error.message,
    });
  }
};

exports.forgotUserPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await eventPlannerModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10mins",
    });
    const link = `https://schedi-tix-front-end.vercel.app/reset-password/${token}`;
    const firstName = user.fullname.split(" ")[0];

    const mailOptions = {
      email: user.email,
      subject: "Reset Password",
      html: reset(link, firstName),
    };

    await send_mail(mailOptions);
    return res.status(200).json({
      message: "Link has been sent to email address",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "internal Server Error:" + error.message,
    });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Password does not match",
      });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await eventPlannerModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Session expired. Please enter your email to resend link",
      });
    }
    res.status(500).json({
      message: "Error resetting password",
    });
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await eventPlannerModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Password does not match",
      });
    }

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password change successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error Changing Password" ,
    });
  }
};

exports.logOut = async (req, res) => {
  try {
    const user = await eventPlannerModel.findById(req.user.userId);
    if (!user) {
      return res.satus(404).json({
        message: "User Not Found",
      });
    }
    user.isLoggedIn = false;
    await user.save();
    res.status(200).json({
      message: "User logout Successfully",
    });
  } catch (error) {
    console.log(err.message);
    res.status(500).json({
      message: "Internal Server Error:" + error.message,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const eventPlanners = await eventModel.find();

    res
      .status(200)
      .json({
        message: "Successfully Getting All EventPlanners",
        data: eventPlanners,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error:" + error.message });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const { eventPlannerId } = req.params;

    const eventPlanner = await eventPlannerModel.findById(eventPlannerId);

    if (!eventPlanner) {
      return res.status(404).json({ message: "eventPlanner not found" });
    }

    res
      .status(200)
      .json({
        message: `kindly find the eventPlanner below`,
        data: eventPlanner,
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" + error.message });
  }
};

exports.updateEventPlanner = async (req, res) => {
  try {
    const { userId } = req.user;
    // const { fullname,  password } = req.body;
    
    const eventPlanner = await eventPlannerModel.findById(userId);
    console.log(eventPlanner);
    
    if (!eventPlanner) {
      return res.status(404).json({
        message: "EventPlanner not found",
      });
    };

    const data = {
      profilePic: eventPlanner.profilePic
    };

    const file = req.file
    if (file && file.path) {
      await cloudinary.uploader.destroy(data.profilePic.public_id)
      const  result = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(req.file.path);
      
      data.profilePic = {
        publicId: result.public_id,
        imageUrl: result.secure_url
      }
      
      const updateEventPlanner = await eventPlannerModel.findByIdAndUpdate(
        eventPlanner._id,
        data,
        { new: true }
      );
      res.status(200).json({
        message: "EventPlanner updated successfully",
        data: updateEventPlanner,
      });
    }
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      });
    }
    res.status(500).json({
      message: "internal server error:" + error.message,
    });
  }
};

exports.deleteEventPlanner = async (req, res) => {
  try {
    const { userId } = req.params;

    // Await the result of findById
    const eventPlanner = await eventPlannerModel.findById(userId);
    if (!eventPlanner) {
      return res.status(404).json({
        message: "EventPlanner not found",
      });
    }

    const deleteEventPlanner = await eventPlannerModel.findByIdAndDelete(eventPlannerId);
    if (!deleteEventPlanner) {
      return res.status(404).json({
        message: "EventPlanner has already been deleted",
      });
    }

    res.status(200).json({
      message: "EventPlanner deleted successfully",
      data: deleteEventPlanner,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};


