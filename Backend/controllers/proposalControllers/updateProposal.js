const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");

/**
 * @desc    Update a proposal's content
 * @route   PUT /api/proposal/update/:id
 * @access  Private
 */
const updateProposal = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Proposal ID is required"
      });
    }

    // Find the proposal first
    const existingProposal = await prisma.projects.findUnique({
      where: { id }
    });

    if (!existingProposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found"
      });
    }

    // Update the proposal
    const updatedProposal = await prisma.projects.update({
      where: { id },
      data: {
        latexContent: JSON.stringify(content)
      }
    });

    return res.status(200).json({
      success: true,
      message: "Proposal updated successfully",
      data: updatedProposal
    });

  } catch (error) {
    console.error("Error updating proposal:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update proposal",
      error: error.message
    });
  }
});

module.exports = { updateProposal }; 