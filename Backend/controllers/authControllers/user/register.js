const prisma = require("../../../lib/prisma");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const register = asyncHandler(async (req, res) => {
  console.log("hello");
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists With Given EmailID.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const NewUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (NewUser) {
      return res.status(201).json({
        message: "User Successfully Created.",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: "Register Failed",
      success: false,
      error
    });
  }
});

module.exports = { register };
