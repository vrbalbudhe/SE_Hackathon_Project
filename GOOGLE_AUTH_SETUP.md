# Google OAuth Setup Guide

## Prerequisites

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API for your project

## Setting up OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Configure the OAuth consent screen if prompted
4. Choose **Web application** as the application type
5. Add the following settings:

   **Authorized JavaScript origins:**
   - `http://localhost:5173` (for development)
   - Your production frontend URL

   **Authorized redirect URIs:**
   - `http://localhost:8000/api/auth/google/callback` (for development)
   - Your production backend URL + `/api/auth/google/callback`

6. Save and copy your **Client ID** and **Client Secret**

## Environment Variables Setup

### Backend (.env)
```env
# Database
DATABASE_URL="your_mongodb_url_here"

# JWT Secret
JWT_SECRET="your_jwt_secret_here"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"

# Session Secret
SESSION_SECRET="your_session_secret_here"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

### Frontend (.env)
```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Running the Application

1. Install dependencies:
   ```bash
   # Backend
   cd Backend
   npm install

   # Frontend
   cd ../Frontend
   npm install
   ```

2. Start the backend server:
   ```bash
   cd Backend
   npm run dev
   ```

3. Start the frontend development server:
   ```bash
   cd Frontend
   npm run dev
   ```

## How It Works

1. User clicks "Sign in with Google" button on the login page
2. User is redirected to Google's OAuth consent screen
3. After authentication, Google redirects back to your backend callback URL
4. Backend creates/finds the user and generates a JWT token
5. User is redirected to the frontend with authentication cookie set
6. Frontend AuthContext verifies the token and fetches user data

## Security Notes

- Always use HTTPS in production
- Keep your Client Secret secure and never expose it in frontend code
- Set secure cookie options in production
- Regularly rotate your JWT secret
- Consider implementing refresh tokens for better security

## Troubleshooting

1. **"Google authentication failed" error:**
   - Check if your Google Client ID and Secret are correct
   - Verify the redirect URIs match exactly in Google Console

2. **CORS errors:**
   - Ensure your backend CORS configuration includes your frontend URL
   - Check that credentials are included in requests

3. **User not staying logged in:**
   - Verify cookies are being set properly
   - Check browser developer tools for cookie settings
   - Ensure your JWT token is valid and not expired 