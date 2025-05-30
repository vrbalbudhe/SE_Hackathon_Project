const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");

const GetAllUsers = asyncHandler(async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc' // Most recent users first
      }
    });

    return res.status(200).json({
      message: "Users fetched successfully!",
      success: true,
      users: users,
      count: users.length
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Failed to fetch users",
      success: false,
      error: error.message
    });
  }
});

module.exports = { GetAllUsers };