const express = require("express");
const router = express.Router();
const { generateProposal } = require("../controllers/proposalControllers/generateProposal");
const { autofill } = require("../controllers/proposalControllers/autofill");
const { updateProposal } = require("../controllers/proposalControllers/updateProposal");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateProposal);
router.post("/autofill", protect, autofill);
router.put("/update/:id", protect, updateProposal);

module.exports = router; 