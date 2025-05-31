const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with better error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const autofill = async (req, res) => {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured' 
      });
    }

    // Get description from request body
    const { description } = req.body;

    // Validate input
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Description is required and must be a non-empty string' 
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // Create the prompt
    const prompt = `
You are an expert project analyst. Based on the following project description, generate a structured JSON response with all the relevant project details.

Project Description: "${description}"

Please analyze this description and provide a JSON response with the following exact structure. Fill in as many fields as possible based on the description. If a field cannot be determined from the description, leave it as an empty string or provide a reasonable default:

{
  "name": "Project manager or developer name (if mentioned, otherwise empty)",
  "clientName": "Client or company name (if mentioned, otherwise empty)", 
  "clientIndustry": "Industry sector (e.g., Healthcare, Finance, E-commerce, etc.)",
  "timelineStart": "Start date in YYYY-MM-DD format (if mentioned or estimated)",
  "timelineEnd": "End date in YYYY-MM-DD format (if mentioned or estimated)", 
  "budget": "Budget amount (if mentioned, otherwise empty)",
  "techStack": ["Array of technologies mentioned (e.g., React, Node.js, Python, etc.)"],
  "modules": ["Array of features/modules mentioned (e.g., Authentication, Dashboard, Payment, etc.)"],
  "tone": "Professional tone description for the project",
  "proposalType": "Type of proposal (e.g., Technical Proposal, Business Proposal, etc.)",
  "customPrompt": "Specific requirements or custom instructions mentioned",
  "latexContent": "Any mathematical or formatted content requirements",
  "goals": "Main objectives and goals of the project",
  "challenges": "Potential challenges or constraints identified",
  "description": "A refined and detailed project description",
  "title": "A suitable project title",
  "type": "Project type (e.g., Web Development, Mobile App, AI/ML, etc.)",
  "priority": "low, medium, or high based on urgency indicators"
}

Important guidelines:
- Return only valid JSON, no additional text or markdown
- Extract as much information as possible from the description
- Make reasonable inferences for missing information
- Ensure all array fields contain relevant items
- Use professional language for all text fields
- If timeline is mentioned, convert to proper date format
- Identify technologies even if not explicitly listed as "tech stack"
`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let jsonResponse;
    try {
      // Clean the response (remove markdown code blocks if present)
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      jsonResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('AI Response:', text);
      
      // Return a fallback response if JSON parsing fails
      return res.status(500).json({
        error: 'Failed to parse AI response. Please try again with a clearer description.',
        details: 'The AI response was not in valid JSON format'
      });
    }

    // Validate that we got a proper response structure
    if (!jsonResponse || typeof jsonResponse !== 'object') {
      return res.status(500).json({
        error: 'Invalid response structure from AI'
      });
    }

    // Add any missing required fields with defaults
    const defaultResponse = {
      name: "",
      clientName: "",
      clientIndustry: "",
      timelineStart: "",
      timelineEnd: "",
      budget: "",
      techStack: [],
      modules: [],
      tone: "Professional and technical",
      proposalType: "Project Proposal", 
      customPrompt: "",
      latexContent: "",
      goals: "",
      challenges: "",
      description: description,
      title: "Project Proposal",
      type: "Development Project",
      priority: "medium"
    };

    // Merge AI response with defaults
    const finalResponse = { ...defaultResponse, ...jsonResponse };

    // Ensure arrays are actually arrays
    if (!Array.isArray(finalResponse.techStack)) {
      finalResponse.techStack = finalResponse.techStack ? [finalResponse.techStack] : [];
    }
    if (!Array.isArray(finalResponse.modules)) {
      finalResponse.modules = finalResponse.modules ? [finalResponse.modules] : [];
    }

    // Return the structured response
    res.status(200).json(finalResponse);

  } catch (error) {
    console.error('Autofill API Error:', error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes('API_KEY')) {
      return res.status(401).json({
        error: 'Invalid or missing Gemini API key'
      });
    }
    
    if (error.message?.includes('RATE_LIMIT')) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Failed to generate autofill data',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = { autofill };