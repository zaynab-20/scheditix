const eventPlannerModel = require("../models/eventPlanner");
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(400).json({
        message: "Token not found",
      });
    }

    const token = auth.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await eventPlannerModel.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({
        message: "Authentication Failed: User not found",
      });
    }

    if (user.isLoggedIn !== decodedToken.isLoggedIn) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user; // full user object
    req.userId = user._id.toString(); // shortcut to ID

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        message: "Session timed-out: Please login to continue",
      });
    }

    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};




exports.adminAuth = async (req, res, next) => {
  try {
    // No need to re-verify token here if authenticate middleware ran first
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: User info not found",
      });
    }

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied: Admins only",
      });
    }

    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};







// const eventPlannerModel = require("../models/eventPlanner");
// const jwt = require("jsonwebtoken");

// exports.authenticate = async (req, res, next) => {
//   try {
//     const auth = req.headers.authorization;
//     if (!auth) {
//       return res.status(400).json({
//         message: "Token not found",
//       });
//     }
//     const token = auth.split(" ")[1];
    
//     if (!token) {
//       return res.status(400).json({
//         message: "Invalid token",
//       });
//     }
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await eventPlannerModel.findById(decodedToken.userId);
//     console.log('Auth: ',user);
    
//     if (!user) {
//       return res.status(404).json({
//         message: "Authentication Failed: User not found",
//       });
//     }
//     if(user.isLoggedIn !== decodedToken.isLoggedIn){
//       return res.status(401).json({message: 'Unauthorized'})
//     }
//     req.user = decodedToken;  

//     next();
//   } catch (error) {
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(403).json({
//         message: "Session timed-out: Please login to continue",
//       });
//     }
//     console.log(error.message);
    
//     res.status(500).json({
//       message: "Internal Server Error" 
//     });
//   }
// };

// exports.adminAuth = async (req, res, next) => {
//   try {
//     const auth = req.headers.authorization;
//     if (!auth) {
//       return res.status(400).json({
//         message: "Token not found",
//       });
//     }

//     const token = auth.split(" ")[1];
//     if (!token) {
//       return res.status(400).json({
//         message: "Invalid token",
//       });
//     }

//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await eventPlannerModel.findById(decodedToken.userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "Authentication Failed: User not found",
//       });
//     }

//     if (req.user.role !== "Admin") {
//       return res.status(401).json({
//         message: "Unauthorized: Please contact Admin",
//       });
//     }

//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(403).json({
//         message: "Session timed-out: Please login to continue",
//       });
//     }
//     console.log(error.message);
    
//     res.status(500).json({
//       message: "Internal Server Error" 
//     });
//   }
// };