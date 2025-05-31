const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");

/**
 * @desc    Update a project's content
 * @route   PUT /api/project/update/:id
 * @access  Private
 */
const updateProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required"
      });
    }

    // Find the project first
    const existingProject = await prisma.projects.findUnique({
      where: { id }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Update the project
    const updatedProject = await prisma.projects.update({
      where: { id },
      data: {
        latexContent: JSON.stringify(content)
      }
    });

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject
    });

  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message
    });
  }
});

module.exports = { updateProject }; 