const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const AuthRoutes = require("./routes/authRoutes/authRoutes");
const UserRoutes = require("./routes/userRoutes/userRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));

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
