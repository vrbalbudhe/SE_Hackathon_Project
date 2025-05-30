const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");

const GetUserDetails = asyncHandler(async (req, res) => {
  const { email } = req.params;
  try {
    if (!email) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({
        message: "User Does Not Exist",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User Details Fetched Successfully!",
      success: true,
      userInfo: user,
    });
  } catch (error) {
    res.status(501).json({
      message: "User Details Fetching Failed",
      success: false,
    });
  }
});

module.exports = { GetUserDetails };
