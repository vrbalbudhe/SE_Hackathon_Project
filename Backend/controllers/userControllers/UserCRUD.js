const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");
const { ObjectId } = require('mongodb');
// const User = require("../../models/User");
// const Project = require("../../models/Project");

const GetUserDetails = asyncHandler(async (req, res) => {
  const { email } = req.params;
  try {
    if (!email) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({
        message: "User Does Not Exist",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User Details Fetched Successfully!",
      success: true,
      userInfo: user,
    });
  } catch (error) {
    res.status(501).json({
      message: "User Details Fetching Failed",
      success: false,
    });
  }
});

const GetUserProposals = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔍 GetUserProposals called for userId:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // First verify if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log("❌ User not found with ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("✅ Found user:", user.email);

    // Get proposals using Prisma
    const proposals = await prisma.projects.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log("✅ Found", proposals.length, "proposals for user", userId);

    // Transform the proposals to match the expected format
    const formattedProposals = proposals.map(proposal => ({
      id: proposal.id,
      name: proposal.name || 'Untitled',
      clientName: proposal.clientName || 'Unknown Client',
      clientIndustry: proposal.clientIndustry || 'Unknown Industry',
      timelineStart: proposal.timelineStart,
      timelineEnd: proposal.timelineEnd,
      techStack: Array.isArray(proposal.techStack) ? proposal.techStack : [],
      modules: Array.isArray(proposal.modules) ? proposal.modules : [],
      goals: proposal.goals || null,
      challenges: proposal.challenges || null,
      tone: proposal.tone || null,
      proposalType: proposal.proposalType || null,
      budget: proposal.budget || null,
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt
    }));

    return res.status(200).json({
      success: true,
      message: "Proposals fetched successfully",
      proposals: formattedProposals
    });

  } catch (error) {
    console.error("❌ Error in GetUserProposals:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching proposals",
      error: error.message
    });
  }
});

module.exports = {
  GetUserDetails,
  GetUserProposals,
};
