# Backend Setup Guide

## Quick Setup

1. **Create .env file** in the Backend directory with the following content:

```env
# Database - Replace with your MongoDB connection string
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority"

# JWT Secret - Use a secure random string
JWT_SECRET="your-secure-jwt-secret-here"

# Google OAuth - Get these from Google Cloud Console
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Session Secret - Use a secure random string
SESSION_SECRET="your-secure-session-secret"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Node Environment
NODE_ENV="development"
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up the database**:
```bash
npx prisma generate
npx prisma db push
```

4. **Run the server**:
```bash
npm run dev
```

## Fixing Common Errors

### 1. Google OAuth "Bad Request" Error
This error occurs when:
- `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` are missing or incorrect
- The values contain placeholder text like "your_google_client_id_here"

**Solution**: 
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Copy the actual Client ID and Client Secret
4. Replace the placeholder values in your .env file

### 2. Prisma Database Connection Error
This error occurs when:
- `DATABASE_URL` is not set or incorrect
- MongoDB is not accessible

**Solution**:
1. Make sure you have a MongoDB database (MongoDB Atlas is recommended)
2. Get your connection string from MongoDB Atlas
3. Replace `DATABASE_URL` in .env with your actual connection string
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`

### 3. JWT Secret Error
If you see token-related errors:
- Make sure `JWT_SECRET` is set in your .env file
- Use a secure random string (at least 32 characters)

## Verify Your Setup

Run this checklist:
- [ ] .env file exists in Backend directory
- [ ] DATABASE_URL has your actual MongoDB connection string (not placeholder)
- [ ] GOOGLE_CLIENT_ID ends with `.apps.googleusercontent.com`
- [ ] GOOGLE_CLIENT_SECRET is your actual secret (not placeholder)
- [ ] JWT_SECRET is a secure random string
- [ ] SESSION_SECRET is a secure random string

## Generate Secure Secrets

To generate secure random strings for JWT_SECRET and SESSION_SECRET, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Test Your Configuration

1. Test database connection:
```bash
npx prisma db push
```

2. Test the server:
```bash
npm run dev
```

The server should start without errors on port 8000. 