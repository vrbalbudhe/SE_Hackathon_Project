const prisma = require("../../../lib/prisma");
const asyncHandler = require("express-async-handler");
const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: "None",
    });
    return res.status(200).json({
      message: "Logout Successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: "Logout Failed",
      success: false,
    });
  }
});

module.exports = { logout };
