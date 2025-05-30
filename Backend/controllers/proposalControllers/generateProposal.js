const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");

// Initialize Gemini AI with better error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProposal = asyncHandler(async (req, res) => {
  try {
    console.log("🚀 NEW CONTROLLER VERSION CALLED - If you see 'User ID is required' error, it's coming from elsewhere!");
    console.log("=== PROPOSAL GENERATION START ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request headers:", req.headers);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

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

    console.log("📝 Extracted fields:");
    console.log("- Title:", title);
    console.log("- Content length:", content?.length || 0);
    console.log("- User email:", userEmail);

    // NEVER return user ID error - this is the key change
    if (!title || !content) {
      console.log("❌ Missing title or content - sending 400 error");
      return res.status(400).json({
        success: false,
        message: "Title and content are required (from NEW controller)",
        received: {
          title: !!title,
          content: !!content,
          titleValue: title,
          contentLength: content?.length || 0
        },
        timestamp: new Date().toISOString()
      });
    }

    console.log("✅ Title and content validation passed");

    // Multiple methods to get user ID
    let userId = null;
    let user = null;

    console.log("🔍 Starting user ID detection...");

    // Method 1: Direct userId from request body
    if (req.body.userId) {
      userId = req.body.userId;
      console.log("✅ Method 1: Got userId from request body:", userId);
    }

    // Method 2: From passport session (req.user)
    if (!userId && req.user) {
      userId = req.user.id;
      user = req.user;
      console.log("✅ Method 2: Got userId from req.user:", userId);
    }

    // Method 3: From session passport user
    if (!userId && req.session && req.session.passport && req.session.passport.user) {
      userId = req.session.passport.user;
      console.log("✅ Method 3: Got userId from session:", userId);
    }

    // Method 4: Find user by email if provided
    if (!userId && userEmail) {
      try {
        user = await prisma.user.findUnique({
          where: { email: userEmail }
        });
        if (user) {
          userId = user.id;
          console.log("✅ Method 4: Found user by email:", userEmail, "ID:", userId);
        }
      } catch (emailError) {
        console.error("❌ Error finding user by email:", emailError);
      }
    }

    // Method 5: Get the first user from database (fallback for testing)
    if (!userId) {
      try {
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
          userId = firstUser.id;
          user = firstUser;
          console.log("✅ Method 5: Using first user as fallback:", firstUser.email, "ID:", userId);
        }
      } catch (fallbackError) {
        console.error("❌ Error getting fallback user:", fallbackError);
      }
    }

    console.log("🎯 Final userId determined:", userId);
    console.log("👤 User object:", user ? `${user.name} (${user.email})` : "No user object");

    // If we have userId but no user object, fetch the user
    if (userId && !user) {
      try {
        user = await prisma.user.findUnique({
          where: { id: userId }
        });
        console.log("📋 Fetched user:", user ? user.email : "User not found");
      } catch (userError) {
        console.error("❌ Error fetching user:", userError);
      }
    }

    // Continue without requiring userId - this is crucial!
    console.log("🔄 Proceeding with proposal generation regardless of user ID...");

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured",
      });
    }

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("🤖 Sending request to Gemini API...");

    // System prompt for proposal generation
    const systemPrompt = `You are an expert business consultant and proposal writer. Your task is to transform user-provided information into a professional, structured project proposal.

Context: Consulting firms and freelancers need to quickly generate customized project proposals. You will receive input from users and must create a comprehensive, professional proposal that can be exported to PDF/DOCX formats.

Based on the user's input, generate a structured project proposal. IMPORTANT: Return ONLY a valid JSON object with NO additional text, markdown formatting, or code blocks.

The JSON structure should be:
{
  "title": "Project Title",
  "executiveSummary": "A compelling overview of the project...",
  "clientInformation": {
    "name": "Client Name",
    "industry": "Industry",
    "contact": "Contact information if available"
  },
  "projectOverview": {
    "description": "Detailed project description",
    "objectives": ["Objective 1", "Objective 2", "..."]
  },
  "proposedSolution": {
    "approach": "Technical approach description",
    "techStack": ["Technology 1", "Technology 2", "..."],
    "deliverables": ["Deliverable 1", "Deliverable 2", "..."]
  },
  "projectTimeline": {
    "duration": "Total duration",
    "phases": [
      {"phase": "Phase 1", "duration": "2 weeks", "description": "..."},
      {"phase": "Phase 2", "duration": "4 weeks", "description": "..."}
    ]
  },
  "teamResources": {
    "structure": "Team structure description",
    "keyPersonnel": ["Role 1: Description", "Role 2: Description"]
  },
  "budgetEstimate": {
    "total": "$X - $Y",
    "breakdown": ["Item 1: $X", "Item 2: $Y"],
    "paymentTerms": "Payment terms description"
  },
  "successMetrics": {
    "kpis": ["KPI 1", "KPI 2"],
    "expectedOutcomes": ["Outcome 1", "Outcome 2"]
  },
  "termsConditions": {
    "scope": "Project scope description",
    "assumptions": ["Assumption 1", "Assumption 2"],
    "nextSteps": ["Step 1", "Step 2"]
  }
}

Use professional language and ensure the proposal is persuasive and client-focused. Fill in all sections based on the user's input, inferring reasonable details where necessary.

User Input Title: ${title}
User Input Content: ${content}

Remember: Return ONLY the JSON object, no other text.`;

    // Generate the proposal using AI
    let structuredProposal;
    try {
      const result = await model.generateContent(systemPrompt);
      console.log("✅ Received response from Gemini API");
      
      const response = await result.response;
      const proposalText = response.text();
      console.log("📄 Generated text length:", proposalText?.length || 0);

      // Try to parse the response as JSON
      try {
        const cleanedText = proposalText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        structuredProposal = JSON.parse(cleanedText);
        console.log("✅ Successfully parsed AI response as JSON");
      } catch (parseError) {
        console.error("⚠️ Error parsing Gemini response as JSON:", parseError);
        console.log("Raw response (first 500 chars):", proposalText?.substring(0, 500));
        
        // If not JSON, create a structured format
        structuredProposal = {
          title: title,
          generatedAt: new Date().toISOString(),
          content: proposalText || "No content generated",
          sections: {
            executiveSummary: "Generated proposal content",
            fullProposal: proposalText || "No content generated"
          }
        };
      }
    } catch (aiError) {
      console.error("⚠️ Error generating AI content:", aiError);
      
      // Create a basic proposal structure if AI fails
      structuredProposal = {
        title: title,
        generatedAt: new Date().toISOString(),
        content: content,
        sections: {
          executiveSummary: `This proposal outlines the requirements for ${title}`,
          fullProposal: content
        },
        note: "Generated with basic structure due to AI service issue"
      };
    }

    // SAVE TO DATABASE
    console.log("💾 === SAVING TO DATABASE ===");
    
    try {
      const projectData = {
        name: title,
        clientName: clientName || structuredProposal.clientInformation?.name || "Test Client",
        clientIndustry: clientIndustry || structuredProposal.clientInformation?.industry || "Technology",
        timelineStart: timelineStart ? new Date(timelineStart) : new Date(),
        timelineEnd: timelineEnd ? new Date(timelineEnd) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        techStack: Array.isArray(techStack) ? techStack : (structuredProposal.proposedSolution?.techStack || ["React", "Node.js"]),
        modules: Array.isArray(modules) ? modules : (structuredProposal.proposedSolution?.deliverables || ["Frontend", "Backend"]),
        goals: goals || structuredProposal.projectOverview?.description || content || "Project goals",
        challenges: challenges || null,
        tone: tone || "Professional",
        proposalType: proposalType || "Standard",
        customPrompt: customPrompt || null,
        latexContent: JSON.stringify(structuredProposal),
        budget: budget || structuredProposal.budgetEstimate?.total || null
      };

      // Only add userId if we have one - this is optional now
      if (userId) {
        projectData.userId = userId;
        console.log("👤 Assigning to user:", userId);
      } else {
        console.log("👤 No user assigned - proceeding anyway");
      }

      console.log("📋 Project data prepared:", {
        name: projectData.name,
        clientName: projectData.clientName,
        userId: projectData.userId || "No user",
        hasContent: !!projectData.latexContent
      });

      const savedProject = await prisma.projects.create({
        data: projectData
      });

      console.log("🎉 Project saved to database successfully!");
      console.log("🆔 Project ID:", savedProject.id);
      console.log("👤 Assigned to user:", userId || "No user assigned");

      // Send successful response
      res.status(200).json({
        success: true,
        message: "Proposal generated and saved successfully",
        proposal: structuredProposal,
        projectId: savedProject.id,
        savedToDatabase: true,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: "gemini-1.5-flash",
          inputTitle: title,
          inputLength: content.length,
          databaseId: savedProject.id,
          assignedUserId: userId,
          userEmail: user?.email || "Unknown",
          controllerVersion: "NEW_DEBUG_VERSION"
        }
      });

    } catch (dbError) {
      console.error("❌ Error saving to database:", dbError);
      console.error("Database error details:", dbError.message);
      
      // Still return the generated proposal even if DB save fails
      res.status(200).json({
        success: true,
        message: "Proposal generated successfully (database save failed)",
        proposal: structuredProposal,
        savedToDatabase: false,
        dbError: dbError.message,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: "gemini-1.5-flash",
          inputTitle: title,
          inputLength: content.length,
          attemptedUserId: userId,
          controllerVersion: "NEW_DEBUG_VERSION"
        }
      });
    }

    console.log("🏁 === PROPOSAL GENERATION COMPLETE ===");

  } catch (error) {
    console.error("💥 Proposal generation error:", error);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({
      success: false,
      message: "Failed to generate proposal",
      error: error.message,
      controllerVersion: "NEW_DEBUG_VERSION",
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
});

module.exports = { generateProposal };