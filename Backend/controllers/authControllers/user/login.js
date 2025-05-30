const prisma = require("../../../lib/prisma");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({
        message: "User Does Not Exist",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Password Incorrect",
        success: false,
      });
    }

    const tokenData = {
      userId: user.id,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    const CookieOptions = {
      httpOnly: true,
      maxAge: 1000 * 60 * 105,
      sameSite: "Lax",
      secure: "None",
    };

    const { password: _, ...userInfo } = user;

    res.cookie("token", token, CookieOptions);

    return res.status(200).json({
      message: "Login Successful",
      success: true,
      user: userInfo,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login Failed",
      success: false,
    });
    console.error("Login error:", error);
  }
});

module.exports = { login };
