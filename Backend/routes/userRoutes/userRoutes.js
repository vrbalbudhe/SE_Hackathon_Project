const express = require("express");
const {
  GetUserDetails,
  GetUserProposals,
} = require("../../controllers/userControllers/UserCRUD");
const router = express.Router();

// USER DETAILS FETCHING
router.get("/:email", GetUserDetails);

// GET USER PROPOSALS
router.get("/proposals/:userId", GetUserProposals);

module.exports = router;
