const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {verify, reset} = require("../utils/html")
const { send_mail } = require("../middleware/nodemailer");
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordschema, changeUserPasswordschema } = require("../middleware/validation");

exports.registerUser = async (req, res) => {
  try {
    // const validatedData = await validate(req.body, registerSchema)
    const {userName, email, password,role,phoneNo, confirmPassword } = req.body;
  
    if (!userName || !email || !password  || !phoneNo || !confirmPassword) {
      return res.status(400).json({
        message: "Input required for all field",
      });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password does not match",
      });
    }
    
    const existingEmail = await userModel.findOne({ email: email.toLowerCase() });
     console.log(existingEmail);
      if (existingEmail) {
        return res.status(400).json({
          message: `${email.toLowerCase()} already exist`,
        });
      }
  
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltedRound);
  
      const user = new userModel({
        userName,
        email,
        phoneNo: '234'+phoneNo,
        password: hashedPassword,
        role: req.body.role || 'Attendee'
      });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const link = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/verify/user/${token}`;
      const nickName = user.userName;
  
      const mailOptions = {
        email: user.email,
        subject: "Account Verification",
        html: verify(link, nickName),
      };
  
      await send_mail(mailOptions);
      await user.save();
      res.status(201).json({
        message: "Account registered successfully",
        data: user,token
      });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: 'internal Server Error'
      })
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
              const { userId } = jwt.decode(token);
              const user = await userModel.findById(userId);
    
              if (!user) {
                return res.status(404).json({
                  message: "Account not found",
                });
              }
    
              if (user.isVerified === true) {
                return res.status(400).json({
                  message: "Account is verified already",
                });
              }
    
              const newToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "5mins" }
              );
              const link = `${req.protocol}://${req.get(
                "host"
              )}/api/v1/verify/user/${newToken}`;
              const nickName = user.userName;
    
              const mailOptions = {
                email: user.email,
                subject: "Resend: Account Verification",
                html: verify(link, nickName),
              };
    
              await send_mail(mailOptions);
              res.status(200).json({
                message: "Session expired: Link has been sent to email address",
              });
            }
          } else {
          const user = await userModel.findById(payload.userId);
    
          if (!user) {
              return res.status(404).json({
              message: "Account not found",
            });
          }
    
          if (user.isVerified === true) {
              return res.status(400).json({
                message: "Account is verified already",
              });
          }
    
          user.isVerified = true;
          await user.save();
    
          res.status(200).json({
           message: "Account verified successfully",
        });
      }
    });
  } catch (error) {
   console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
      message: "Session expired: link has been sent to email address",
      });
    }
    res.status(500).json({
     message: "Error Verifying user",
    });
  }
};


exports.logInUser = async (req, res) => {
  try {
    // const validatedData = await validate(req.body, loginSchema)
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
    const user = await userModel.findOne({email:email.toLowerCase()});
    // console.log('user', user);
        
    
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
      const token = jwt.sign({ userId: user._id, isLoggedIn: user.isLoggedIn, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "5mins",
          });
          const link = `${req.protocol}://${req.get(
            "host"
          )}/api/v1/verify/user/${token}`;
          const nickName = user.userName;
    
          const mailOptions = {
            email: user.email,
            subject: "Account Verification",
            html: verify(link, nickName),
          };
    
          await send_mail(mailOptions);
          return res.status(400).json({
            message: "Account is not verified, link has been sent to email address",
          });
        }
    
        user.isLoggedIn = true;
        const token = jwt.sign(
          { userId: user._id, isLoggedIn: user.isLoggedIn },
          process.env.JWT_SECRET,
          { expiresIn: "1day" }
        );
        await user.save();

        if (user.role === 'Admin') {
         return res.status(200).json({
          message: "Admin login successful",
          data: user,
          token
        });
      } else if (user.role === 'Organizer') {
       return res.status(200).json({
        message: "Organizer login successful",
        data: user,
        token
        });
      } else if (user.role === 'Attendee') {
       return res.status(200).json({
        message: "Attendee login successful",
        data: user,
        token
        });
      }
    
        res.status(200).json({
          message: "Account login successfull",
          data: user,
          token
        });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: 'internal Server Error'
      })
  }
};


exports.forgotUserPassword = async (req, res) => {
  try {
      // const validatedData = await validate(req.body, forgotPasswordSchema)
        const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5mins",
    });
    const link = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/reset-password/user/${token}`; // consumed post link
    const nickName = user.userName;

    const mailOptions = {
      email: user.email,
      subject: "Reset Password",
      html: reset(link, nickName),
    };

    await send_mail(mailOptions);
    return res.status(200).json({
      message: "Link has been sent to email address",
    });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: 'internal Server Error'
    })
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
    // const validatedData = await validate(req.body, resetPasswordSchema)
  
    const { newPassword, confirmPassword } = req.body;
  
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: "Password does not match",
     });
    }
  
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(userId);
  
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
  }catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Session expired. Please enter your email to resend link",
      });
    }
    res.status(500).json({
      message: 'internal Server Error'
    })
  }
};


exports.changeUserPassword = async (req, res) => {
  try {
      const { id } = req.params;
      // const validatedData = await validate(req.body, changeUserPasswordSchema)
      const { currentPassword, newPassword, confirmPassword } = req.body;
  
      const user = await userModel.findById(id);
  
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
      message: 'internal Server Error'
    })
  }
};



exports.logOut = async (req, res) => {
  try {
    // console.log(req.user);
    const user = await userModel.findById(req.user.userId);
    if(!user) {
      return res.satus(404).json({
          message: 'User Not Found'
      });
    }
    user.isLoggedIn = false
    await user.save()
    res.status(200).json({
      message: 'User logout Successfully'
  })
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ 
      message: "Internal Server Error" 
  });
  }
};