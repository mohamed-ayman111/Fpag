// ================================ // Require Login // ================================ 
async function requireLogin(req, res, next) {
     if (!req.session || !req.session.userId) {
         return res.status(401).json({ success: false, message: "Login required." });
        } 
        next();
     } 
     
     // ================================ // Require Admin // =============================== 
async function isAdmin(req, res, next) {
     try {
         if (!req.session || !req.session.userId) {
             return res.status(401).json({ success: false, message: "Login required." });
             }
              const User = require("../models/user"); 
              const user = await User.findById( req.session.userId );
               if (!user) {
                 return res.status(401).json({ success: false, message: "User not found." });
                 }
                  if (user.role !== "admin") {
                     return res.status(403).json({ success: false, message: "Admin access required." });
                     }
                      // Store user for later middleware/routes 
                      req.user = user; next();
                     } catch (error) {
                         console.error( "Admin authentication error:", error );
                          res.status(500).json({ success: false, message: "Authentication error." });
                         }
                         }
                        module.exports = { requireLogin, isAdmin };