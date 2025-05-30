const express = require("express");
const {
  GetUserDetails,
} = require("../../controllers/userControllers/UserCRUD");
const router = express.Router();

// USER DETAILS FETCHING
router.get("/:email", GetUserDetails);

module.exports = router;
