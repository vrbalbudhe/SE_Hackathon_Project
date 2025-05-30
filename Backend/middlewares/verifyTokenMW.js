const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const VerifyTokenMW = expressAsyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "User is Not Authenticated",
      success: false,
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "User is Not Authenticated",
        success: false,
      });
    }
    req.userId = payload.userId;
    next();
  });
});

module.exports = VerifyTokenMW;
