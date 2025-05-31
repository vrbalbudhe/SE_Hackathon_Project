const express = require("express");
const { GetAllUsers } = require("../../controllers/adminControllers/UserAdmin");
const router = express.Router();

// GET ALL USERS - Admin only
router.get("/users", GetAllUsers);

module.exports = router;