const express = require("express");
// const getAllProjects = require("../../controllers/projectControllers/getAllProjects");
const { createProject } = require("../../controllers/projectControllers/createProject");
const { deleteProject } = require("../../controllers/projectControllers/deleteProject");
const router = express.Router();


// this is for the fetching all the projects for perticular ID
router.post("/add", createProject);
router.post("/del", deleteProject);

module.exports = router;