// const jwt = require("jsonwebtoken");

// const authorize = (roles = []) => {
//   if (typeof roles === "string") roles = [roles];

//    return (req, res, next) => {
//     try {
//       const token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;

//         if (!roles.includes(decoded.role)) {
//          return res.status(403).json({ message: "Forbidden: You do not have access to this resource." });
//         }

//         next();
//     }catch (error) {
//       return res.status(401).json({ message: "Unauthorized: Invalid token." });
//     }
//   };
// };

// module.exports = authorize;

