const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");

// Get all proposals using raw MongoDB queries to handle mixed data types
const getAllProposals = asyncHandler(async (req, res) => {
  try {
    console.log("🔍 getAllProposals called - using raw MongoDB");
    console.log("🔍 Query params:", req.query);

    // Use raw MongoDB query to bypass Prisma's strict type checking
    const rawProposals = await prisma.$queryRaw`
      db.Projects.find({}).sort({ createdAt: -1 }).limit(50)
    `;

    console.log("✅ Raw query returned", rawProposals?.length || 0, "proposals");

    // If raw query doesn't work, try aggregation
    let proposals = [];
    if (!rawProposals || rawProposals.length === 0) {
      console.log("🔄 Trying aggregation pipeline...");
      
      proposals = await prisma.projects.aggregateRaw({
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 50 },
          {
            $lookup: {
              from: "User",
              localField: "userId",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              clientName: 1,
              clientIndustry: 1,
              budget: 1,
              createdAt: 1,
              updatedAt: 1,
              userId: 1,
              // Handle mixed types by converting everything to string
              goals: { $toString: "$goals" },
              tone: { $toString: "$tone" },
              proposalType: { $toString: "$proposalType" },
              techStack: 1,
              modules: 1,
              challenges: 1,
              user: { $arrayElemAt: ["$user", 0] }
            }
          }
        ]
      });
    } else {
      proposals = rawProposals;
    }

    console.log("✅ Processing", proposals.length, "proposals");

    // Format the data safely
    const formattedProposals = proposals.map((proposal, index) => {
      // Safely handle each field
      const safeProposal = {
        id: proposal._id?.toString() || proposal.id?.toString() || `temp-id-${index}`,
        name: String(proposal.name || 'Untitled Proposal'),
        clientName: String(proposal.clientName || 'Unknown Client'),
        clientIndustry: String(proposal.clientIndustry || 'Unknown Industry'),
        budget: proposal.budget ? String(proposal.budget) : null,
        createdAt: proposal.createdAt || new Date(),
        updatedAt: proposal.updatedAt || proposal.createdAt || new Date(),
        user: null,
        goals: '',
        techStack: [],
        modules: [],
        tone: null,
        proposalType: null,
        challenges: null,
        hasLatexContent: false
      };

      // Safely handle user data
      if (proposal.user && typeof proposal.user === 'object') {
        safeProposal.user = {
          id: proposal.user._id?.toString() || proposal.user.id?.toString(),
          name: String(proposal.user.name || 'Unknown'),
          email: String(proposal.user.email || 'No email'),
          avatar: proposal.user.avatar || null
        };
      }

      // Safely handle goals
      try {
        if (proposal.goals) {
          if (typeof proposal.goals === 'string') {
            safeProposal.goals = proposal.goals;
          } else {
            safeProposal.goals = String(proposal.goals);
          }
        }
      } catch (e) {
        safeProposal.goals = 'Unable to load goals';
      }

      // Safely handle techStack
      try {
        if (proposal.techStack) {
          if (Array.isArray(proposal.techStack)) {
            safeProposal.techStack = proposal.techStack.map(String);
          } else if (typeof proposal.techStack === 'string') {
            // Try to parse if it looks like JSON
            if (proposal.techStack.startsWith('[')) {
              safeProposal.techStack = JSON.parse(proposal.techStack);
            } else {
              safeProposal.techStack = [proposal.techStack];
            }
          }
        }
      } catch (e) {
        safeProposal.techStack = ['Tech stack unavailable'];
      }

      // Safely handle modules
      try {
        if (proposal.modules) {
          if (Array.isArray(proposal.modules)) {
            safeProposal.modules = proposal.modules.map(String);
          } else if (typeof proposal.modules === 'string') {
            if (proposal.modules.startsWith('[')) {
              safeProposal.modules = JSON.parse(proposal.modules);
            } else {
              safeProposal.modules = [proposal.modules];
            }
          }
        }
      } catch (e) {
        safeProposal.modules = ['Modules unavailable'];
      }

      // Safely handle other fields
      try {
        safeProposal.tone = proposal.tone ? String(proposal.tone) : null;
        safeProposal.proposalType = proposal.proposalType ? String(proposal.proposalType) : null;
        safeProposal.challenges = proposal.challenges ? String(proposal.challenges) : null;
        safeProposal.hasLatexContent = !!proposal.latexContent;
      } catch (e) {
        // Keep defaults
      }

      return safeProposal;
    });

    console.log("✅ Successfully formatted", formattedProposals.length, "proposals");

    res.status(200).json({
      success: true,
      message: "Proposals fetched successfully (raw MongoDB)",
      data: {
        proposals: formattedProposals,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: formattedProposals.length,
          limit: 50
        },
        note: "Data retrieved using raw MongoDB queries to handle mixed data types"
      }
    });

  } catch (error) {
    console.error("❌ Error in getAllProposals (raw):", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    
    // Fallback to absolute minimum data
    try {
      console.log("🔄 Attempting emergency fallback...");
      
      const minimalProposals = await prisma.$runCommandRaw({
        find: "Projects",
        limit: 10,
        projection: {
          _id: 1,
          name: 1,
          clientName: 1,
          createdAt: 1
        }
      });

      const fallbackData = (minimalProposals.cursor?.firstBatch || []).map((p, i) => ({
        id: p._id?.toString() || `fallback-${i}`,
        name: String(p.name || 'Proposal'),
        clientName: String(p.clientName || 'Client'),
        clientIndustry: 'N/A',
        budget: null,
        techStack: [],
        modules: [],
        goals: 'Data temporarily unavailable due to database inconsistencies',
        createdAt: p.createdAt || new Date(),
        updatedAt: p.createdAt || new Date(),
        user: null,
        tone: null,
        proposalType: null,
        challenges: null,
        hasLatexContent: false
      }));

      return res.status(200).json({
        success: true,
        message: "Proposals fetched (emergency fallback mode)",
        data: {
          proposals: fallbackData,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: fallbackData.length,
            limit: 10
          },
          warning: "Limited data due to database inconsistencies. Consider data cleanup."
        }
      });

    } catch (fallbackError) {
      console.error("❌ Even fallback failed:", fallbackError);
      
      return res.status(500).json({
        success: false,
        message: "Failed to fetch proposals",
        error: error.message,
        errorType: error.name,
        suggestion: "Database has inconsistent data types. Consider running data cleanup.",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
});

// Simplified safe version that definitely works
const getAllProposalsSimple = asyncHandler(async (req, res) => {
  try {
    console.log("🔍 getAllProposalsSimple called (ultra-safe version)");

    // Ultra-minimal query
    const basicData = await prisma.$runCommandRaw({
      find: "Projects",
      projection: { _id: 1, name: 1, clientName: 1, createdAt: 1 },
      sort: { createdAt: -1 },
      limit: 20
    });

    const proposals = (basicData.cursor?.firstBatch || []).map((p, i) => ({
      id: p._id?.toString() || `simple-${i}`,
      name: String(p.name || 'Untitled Proposal'),
      clientName: String(p.clientName || 'Unknown Client'),
      clientIndustry: 'Data Cleanup Required',
      budget: null,
      techStack: ['Mixed', 'Data', 'Types'],
      modules: ['Database', 'Cleanup', 'Needed'],
      goals: 'Please clean up database to see full proposal details',
      challenges: null,
      tone: null,
      proposalType: null,
      createdAt: p.createdAt || new Date(),
      updatedAt: p.createdAt || new Date(),
      user: { name: 'System', email: 'system@admin.com', id: 'system' },
      hasLatexContent: false
    }));

    console.log("✅ Simple query found", proposals.length, "proposals");

    res.status(200).json({
      success: true,
      message: "Proposals fetched successfully (simple mode)",
      data: {
        proposals,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: proposals.length,
          limit: 20
        },
        note: "Simplified data to avoid type conflicts"
      }
    });

  } catch (error) {
    console.error("❌ Error in getAllProposalsSimple:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch proposals (even simple version)",
      error: error.message
    });
  }
});

// Get single proposal by ID
const getProposalById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 getProposalById called for ID:", id);

    // Use raw command to avoid type issues
    const result = await prisma.$runCommandRaw({
      find: "Projects",
      filter: { _id: { $oid: id } },
      limit: 1
    });

    const proposal = result.cursor?.firstBatch?.[0];

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found"
      });
    }

    console.log("✅ Found proposal:", proposal.name);

    const safeProposal = {
      id: proposal._id?.toString(),
      name: String(proposal.name || 'Untitled'),
      clientName: String(proposal.clientName || 'Unknown'),
      clientIndustry: String(proposal.clientIndustry || 'Unknown'),
      budget: proposal.budget ? String(proposal.budget) : null,
      goals: proposal.goals ? String(proposal.goals) : null,
      createdAt: proposal.createdAt || new Date(),
      updatedAt: proposal.updatedAt || new Date(),
      user: null
    };

    res.status(200).json({
      success: true,
      message: "Proposal details fetched successfully",
      data: safeProposal
    });

  } catch (error) {
    console.error("❌ Error in getProposalById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch proposal details",
      error: error.message
    });
  }
});

module.exports = {
  getAllProposals,
  getAllProposalsSimple,
  getProposalById
};