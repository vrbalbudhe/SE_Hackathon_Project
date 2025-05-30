const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require("express-async-handler");

// Initialize Gemini AI with better error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateProposal = asyncHandler(async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log("Received request with title:", title);
    console.log("Received request with content length:", content.length);

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured",
      });
    }

    // Initialize the Gemini 2.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("Sending request to Gemini API with content length:", content.length);

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

    // Generate the proposal
    const result = await model.generateContent(systemPrompt);
    console.log("Received response from Gemini API");
    
    const response = await result.response;
    console.log("Response status:", response?.status);
    
    const proposalText = response.text();
    console.log("Generated text length:", proposalText?.length || 0);

    // Try to parse the response as JSON, or structure it if it's not
    let structuredProposal;
    try {
      // Remove any markdown code blocks if present
      const cleanedText = proposalText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      structuredProposal = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Error parsing Gemini response as JSON:", parseError);
      console.log("Raw response:", proposalText);
      
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

    // Send the response
    res.status(200).json({
      success: true,
      message: "Proposal generated successfully",
      proposal: structuredProposal,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: "gemini-1.5-flash",
        inputTitle: title,
        inputLength: content.length
      }
    });

  } catch (error) {
    console.error("Proposal generation error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    res.status(500).json({
      success: false,
      message: "Failed to generate proposal",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message
      } : undefined
    });
  }
});

module.exports = { generateProposal }; 