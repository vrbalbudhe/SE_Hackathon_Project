const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const TokenVerification = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  try {
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
      return res.status(200).json({
        message: "User Info Fetced Sucessfully!! || User is Logged In",
        payload,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: "Logout Authentication Failed",
      success: false,
    });
  }
});

module.exports = TokenVerification;
