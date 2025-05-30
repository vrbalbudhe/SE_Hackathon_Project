const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getAnalyticsSummary,
  getUserGrowthData,
  debugDatabaseState,
  createTestProject
} = require("../../controllers/adminControllers/analyticsController");

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Analytics route is working!" });
});

// Debug endpoint to check database state
router.get("/debug", debugDatabaseState);

// Test endpoint to create a sample project
router.get("/create-test-project", createTestProject);

// GET /api/admin/analytics/summary - Get overall analytics summary
router.get("/summary", getAnalyticsSummary);

// GET /api/admin/analytics/user-growth - Get user growth data
router.get("/user-growth", getUserGrowthData);

module.exports = router;