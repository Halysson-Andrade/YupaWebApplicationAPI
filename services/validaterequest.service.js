const jwt = require("jsonwebtoken");

async function checkPermission(req, res, next, role) {
  const token = req.header("authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
      const decoded = jwt.verify(
      token.replaceAll("Bearer ", ""),
      global.jwtSecret
    );
    let roles = decoded.roles;
    if (roles.find(r => r.pms_id == role)) {
      next();
    } else {
      res.status(401).json({ error: "access denied" });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
async function verifyToken(req, res, next) {
  const token = req.header("authorization");

  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(
      token.replaceAll("Bearer ", ""),
      global.jwtSecret
    );
    //
    
    if (req.header("userId") == decoded.usr_id) {
      next();
    }
    else {
      res.status(401).json({ error: "Undefined error" });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
module.exports = {
  verifyToken,
  checkPermission
}
