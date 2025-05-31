const express = require("express");
const { generateProposal } = require("../../controllers/proposalControllers/generateProposal");
const { autofill } = require("../../controllers/proposalControllers/autofill");

const router = express.Router();

// Generate proposal route
router.post("/generate", generateProposal);
router.post("/autofill", autofill);


module.exports = router; 