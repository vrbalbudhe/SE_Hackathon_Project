const express = require("express");
const { generateProposal } = require("../../controllers/proposalControllers/generateProposal");

const router = express.Router();

// Generate proposal route
router.post("/generate", generateProposal);

module.exports = router; 