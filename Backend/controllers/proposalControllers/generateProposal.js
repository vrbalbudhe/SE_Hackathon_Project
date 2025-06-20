const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");
const { ObjectId } = require('mongodb');

// Initialize Gemini AI with better error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProposal = asyncHandler(async (req, res) => {
  try {
    console.log("🚀 PROPOSAL GENERATION START ===");
    console.log("Timestamp:", new Date().toISOString());

    const { 
      title, 
      content,
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
      budget,
      userEmail // We'll use email to find user if no userId
    } = req.body;

    console.log("📝 Request details:");
    console.log("- Title:", title);
    console.log("- Content length:", content?.length || 0);
    console.log("- User email:", userEmail);
    console.log("- Session user:", req.session?.passport?.user);
    console.log("- Req.user:", req.user?.email);

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Enhanced user detection - prioritize authenticated users
    let userId = null;
    let user = null;

    console.log("🔍 Starting user detection...");

    // Method 1: From request body email (HIGHEST PRIORITY)
    if (userEmail) {
      try {
        user = await prisma.user.findUnique({
          where: { email: userEmail }
        });
        if (user) {
          userId = user.id;
          console.log("✅ Method 1 - Found user by email:", userEmail, "ID:", userId);
        }
      } catch (emailError) {
        console.error("❌ Error finding user by email:", emailError);
      }
    }

    // Method 2: From authenticated session (if Method 1 failed)
    if (!userId && req.user && req.user.id) {
      userId = req.user.id;
      user = req.user;
      console.log("✅ Method 2 - Using authenticated user:", user.email, "ID:", userId);
    }

    // Method 3: From session passport (if Methods 1 & 2 failed)
    if (!userId && req.session?.passport?.user) {
      try {
        const sessionUserId = req.session.passport.user;
        user = await prisma.user.findUnique({
          where: { id: sessionUserId }
        });
        if (user) {
          userId = user.id;
          console.log("✅ Method 3 - Found user from session:", user.email, "ID:", userId);
        }
      } catch (sessionError) {
        console.error("❌ Error finding user from session:", sessionError);
      }
    }

    // If no user found, return error
    if (!userId || !user) {
      return res.status(400).json({
        success: false,
        message: "No valid user found for proposal creation. Please provide a valid user email or login.",
      });
    }

    console.log("🎯 Final user selection:");
    console.log("- User ID:", userId);
    console.log("- User email:", user.email);
    console.log("- User name:", user.name);

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is not set");
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured",
      });
    }

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("🤖 Generating AI content...");

    // System prompt for proposal generation
    const systemPrompt = `You are an expert business consultant and proposal writer. Create a professional project proposal in JSON format.

Return ONLY a valid JSON object with this structure:
{
  "title": "Project Title",
  "executiveSummary": "Brief project overview",
  "clientInformation": {
    "name": "Client Name",
    "industry": "Industry"
  },
  "projectOverview": {
    "description": "Project description",
    "objectives": ["Objective 1", "Objective 2"]
  },
  "proposedSolution": {
    "approach": "Technical approach",
    "techStack": ["Technology 1", "Technology 2"],
    "deliverables": ["Deliverable 1", "Deliverable 2"]
  },
  "projectTimeline": {
    "duration": "Project duration",
    "phases": [
      {"phase": "Phase 1", "duration": "2 weeks", "description": "Phase 1 description"}
    ]
  },
  "budgetEstimate": {
    "total": "$10,000 - $20,000",
    "breakdown": ["Development: $15,000"]
  }
}

User Input:
Title: ${title}
Content: ${content}

Return only the JSON, no other text.`;

    // Generate the proposal using AI
    let structuredProposal;
    try {
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const proposalText = response.text();

      // Try to parse as JSON
      try {
        const cleanedText = proposalText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        structuredProposal = JSON.parse(cleanedText);
        console.log("✅ AI content parsed successfully");
      } catch (parseError) {
        console.log("⚠️ AI response not JSON, using fallback structure");
        structuredProposal = {
          title: title,
          executiveSummary: `Professional proposal for ${title}`,
          clientInformation: { name: "Client", industry: "Technology" },
          projectOverview: { description: content, objectives: ["Meet requirements"] },
          proposedSolution: { 
            approach: "Custom development approach", 
            techStack: ["React", "Node.js"], 
            deliverables: ["Working application"] 
          },
          projectTimeline: { 
            duration: "4-6 weeks", 
            phases: [{"phase": "Development", "duration": "4 weeks", "description": "Core development"}] 
          },
          budgetEstimate: { total: "$10,000 - $20,000", breakdown: ["Development: $15,000"] }
        };
      }
    } catch (aiError) {
      console.log("⚠️ AI generation failed, using basic structure");
      structuredProposal = {
        title: title,
        executiveSummary: `Proposal for ${title}`,
        content: content,
        generatedAt: new Date().toISOString(),
        note: "Basic structure due to AI service issue"
      };
    }

    // SAVE TO DATABASE
    console.log("💾 Saving to database...");
    
    try {
      const projectData = {
        name: title,
        clientName: clientName || structuredProposal.clientInformation?.name || "Unknown Client",
        clientIndustry: clientIndustry || structuredProposal.clientInformation?.industry || "Technology",
        timelineStart: timelineStart ? new Date(timelineStart) : new Date(),
        timelineEnd: timelineEnd ? new Date(timelineEnd) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        techStack: Array.isArray(techStack) ? techStack : (structuredProposal.proposedSolution?.techStack || ["React", "Node.js"]),
        modules: Array.isArray(modules) ? modules : (structuredProposal.proposedSolution?.deliverables || ["Application"]),
        goals: goals || structuredProposal.projectOverview?.description || content || "Project requirements",
        challenges: challenges || null,
        tone: tone || "Professional",
        proposalType: proposalType || "Standard",
        customPrompt: customPrompt || null,
        latexContent: JSON.stringify(structuredProposal),
        budget: budget || structuredProposal.budgetEstimate?.total || null,
        userId: userId // Store as string ID, Prisma will handle the conversion
      };

      console.log("📝 Saving project with data:", JSON.stringify(projectData, null, 2));

      const savedProject = await prisma.projects.create({
        data: projectData
      });

      console.log("🎉 SUCCESS! Project saved with full details:");
      console.log("- Project ID:", savedProject.id);
      console.log("- Project Name:", savedProject.name);
      console.log("- Assigned to User ID:", savedProject.userId);
      console.log("- Assigned to Email:", user.email);

      // Return success response
      res.status(200).json({
        success: true,
        message: "Proposal generated and saved successfully",
        proposal: structuredProposal,
        projectId: savedProject.id,
        savedToDatabase: true,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: "gemini-1.5-flash",
          databaseId: savedProject.id,
          assignedUserId: userId,
          assignedUserEmail: user.email,
          assignedUserName: user.name
        }
      });

    } catch (dbError) {
      console.error("❌ Database save failed:", dbError);
      
      // Return proposal even if save fails
      res.status(200).json({
        success: true,
        message: "Proposal generated (database save failed)",
        proposal: structuredProposal,
        savedToDatabase: false,
        error: dbError.message
      });
    }

  } catch (error) {
    console.error("💥 Generation failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate proposal",
      error: error.message
    });
  }
});

module.exports = { generateProposal };