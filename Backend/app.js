require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./config/passport");

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

const AuthRoutes = require("./routes/authRoutes/authRoutes");
const UserRoutes = require("./routes/userRoutes/userRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(`${process.env.SITE_ADDRESS || "/api"}/auth`, AuthRoutes);
app.use(`${process.env.SITE_ADDRESS || "/api"}/user`, UserRoutes);

const port = 8000 || process.env.port;
const StartConnection = async () => {
  try {
    app.listen(port, () => console.log("<> Server [Done]"));
  } catch (error) {
    process.exit(1);
  }
};

StartConnection();
