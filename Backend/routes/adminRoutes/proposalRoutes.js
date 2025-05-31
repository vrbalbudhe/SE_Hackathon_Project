const express = require("express");
const {
  getAllProposals,
  getAllProposalsSimple,
  getProposalById
} = require("../../controllers/adminControllers/proposalController");

const router = express.Router();

console.log("📋 Proposal admin routes loaded");

// Test route
router.get("/test", (req, res) => {
  console.log("🧪 Proposal test route called");
  res.json({ 
    success: true, 
    message: "Proposal admin routes are working!",
    timestamp: new Date().toISOString()
  });
});

// Fallback simple route (if main route fails)
router.get("/simple", (req, res, next) => {
  console.log("📋 /simple route called (fallback)");
  getAllProposalsSimple(req, res, next);
});

// GET /api/admin/proposals/all - Get all proposals
router.get("/all", (req, res, next) => {
  console.log("📋 /all route called");
  getAllProposals(req, res, next);
});

// GET /api/admin/proposals/:id - Get specific proposal by ID
router.get("/:id", (req, res, next) => {
  console.log("📋 /:id route called for:", req.params.id);
  getProposalById(req, res, next);
});

module.exports = router;