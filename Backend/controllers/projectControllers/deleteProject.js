const prisma = require("../../lib/prisma");
const asyncHandler = require("express-async-handler");

const deleteProject = asyncHandler(async (req, res) => {
     const { id } = req.body;

     try {
          if (!id) {
               return res.status(400).json({
                    message: "Project ID is required",
                    success: false,
               });
          }

          const existingProject = await prisma.projects.findUnique({
               where: { id },
          });

          if (!existingProject) {
               return res.status(404).json({
                    message: "Project not found",
                    success: false,
               });
          }

          await prisma.projects.delete({
               where: { id },
          });

          return res.status(200).json({
               message: "Project deleted successfully",
               success: true,
          });
     } catch (error) {
          console.error(error);
          return res.status(500).json({
               message: "Error deleting the project",
               success: false,
          });
     }
});

module.exports = { deleteProject };