const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");

/**
 * @desc    Create a new project
 * @route   POST /api/project/add
 * @access  Private
 */
const createProject = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      clientName,
      clientIndustry,
      timelineStart,
      timelineEnd,
      techStack,
      modules,
      goals,
      challenges,
      tone,
      proposalType,
      customPrompt,
      latexContent,
      budget,
      userId
    } = req.body;

    // Validate required fields
    if (!name || !clientName || !clientIndustry || !timelineStart || !timelineEnd || 
        !techStack || !modules || !goals || !tone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Validate arrays
    if (!Array.isArray(techStack) || !Array.isArray(modules)) {
      return res.status(400).json({
        success: false,
        message: "Tech stack and modules must be arrays"
      });
    }

    // Validate dates
    const startDate = new Date(timelineStart);
    const endDate = new Date(timelineEnd);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date"
      });
    }

    // If userId is provided, verify user exists
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
    }

    // Create project
    const project = await prisma.projects.create({
      data: {
        name,
        clientName,
        clientIndustry,
        timelineStart: startDate,
        timelineEnd: endDate,
        techStack,
        modules,
        goals,
        challenges: challenges || null,
        tone,
        proposalType: proposalType || null,
        customPrompt: customPrompt || null,
        latexContent: latexContent || JSON.stringify({ title: name, content: goals }),
        budget: budget || null,
        userId: userId || null
      }
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        id: project.id,
        name: project.name,
        clientName: project.clientName,
        clientIndustry: project.clientIndustry,
        timelineStart: project.timelineStart,
        timelineEnd: project.timelineEnd,
        techStack: project.techStack,
        modules: project.modules,
        goals: project.goals,
        challenges: project.challenges,
        tone: project.tone,
        proposalType: project.proposalType,
        budget: project.budget,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        userId: project.userId
      }
    });

  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message
    });
  }
});

module.exports = { createProject };