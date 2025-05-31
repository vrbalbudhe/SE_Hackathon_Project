# Gemini API Setup Guide

## Getting Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create an API Key**
   - Click on "Create API Key"
   - Choose your project or create a new one
   - Copy the generated API key

3. **Add to Backend .env**
   ```env
   GEMINI_API_KEY="your-actual-gemini-api-key-here"
   ```

## Testing the Integration

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start the Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Test the Editor**
   - Navigate to the Report section in your profile
   - Click the "Editor" button
   - Write some content about a project proposal
   - Click "Submit Document"
   - Wait for the AI to generate your proposal

## Example Input for Testing

**Title**: E-commerce Platform Development

**Content**:
```
We need to build a modern e-commerce platform for a retail client in the fashion industry. 
The client is TechStyle Fashion Inc., a growing online retailer.

Project requirements:
- Modern, responsive web application
- User authentication and profiles
- Product catalog with search and filters
- Shopping cart and checkout
- Payment integration (Stripe)
- Admin dashboard for inventory management
- Order tracking system

Timeline: 4 months
Budget: $75,000 - $100,000
Tech Stack: React, Node.js, MongoDB, AWS

The client wants to launch before the holiday season and expects to handle 10,000+ users.
```

## Troubleshooting

1. **"Failed to generate proposal" error**
   - Check if your Gemini API key is correctly set in the .env file
   - Ensure the backend server is running
   - Check the backend console for detailed error messages

2. **"Error generating proposal. Please check your connection"**
   - Verify your internet connection
   - Check if the API key has the necessary permissions
   - Ensure CORS is properly configured

3. **Empty or malformed response**
   - The AI might need more detailed input
   - Try providing more specific information about the project
   - Check the backend logs for the raw AI response

## API Response Structure

The generated proposal will include these sections:
- Executive Summary
- Client Information
- Project Overview
- Proposed Solution
- Project Timeline
- Team & Resources
- Budget Estimate
- Success Metrics
- Terms & Conditions

Each section is structured and formatted for easy conversion to PDF/DOCX. 