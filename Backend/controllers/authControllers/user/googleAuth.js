const jwt = require("jsonwebtoken");

const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=authentication_failed`);
    }

    // Generate JWT token
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "your-jwt-secret", {
      expiresIn: "30d",
    });

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/user/${user.id}`);
  } catch (error) {
    console.error("Google auth callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/auth?error=server_error`);
  }
};

module.exports = { googleAuthCallback }; 