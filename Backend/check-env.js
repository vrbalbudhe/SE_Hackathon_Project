require('dotenv').config();

console.log('🔍 Checking Environment Configuration...\n');

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'SESSION_SECRET',
  'FRONTEND_URL'
];

let hasErrors = false;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value) {
    console.log(`❌ ${varName}: NOT SET`);
    hasErrors = true;
  } else if (value.includes('your_') || value.includes('your-')) {
    console.log(`⚠️  ${varName}: Contains placeholder value (${value.substring(0, 30)}...)`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}: Set (${value.substring(0, 20)}...)`);
  }
});

console.log('\n📋 Additional Checks:');

// Check DATABASE_URL format
if (process.env.DATABASE_URL) {
  if (!process.env.DATABASE_URL.startsWith('mongodb')) {
    console.log('❌ DATABASE_URL should start with "mongodb://" or "mongodb+srv://"');
    hasErrors = true;
  } else {
    console.log('✅ DATABASE_URL format looks correct');
  }
}

// Check Google Client ID format
if (process.env.GOOGLE_CLIENT_ID) {
  if (!process.env.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
    console.log('⚠️  GOOGLE_CLIENT_ID should end with ".apps.googleusercontent.com"');
  }
}

if (hasErrors) {
  console.log('\n❗ Please fix the issues above in your .env file');
  console.log('📖 See Backend/README.md for detailed setup instructions');
} else {
  console.log('\n✅ All environment variables are properly configured!');
  console.log('🚀 You can now run: npm run dev');
}

// Test database connection
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('your_')) {
  console.log('\n🔗 Testing database connection...');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  prisma.$connect()
    .then(() => {
      console.log('✅ Database connection successful!');
      return prisma.$disconnect();
    })
    .catch((error) => {
      console.log('❌ Database connection failed:', error.message);
      console.log('💡 Make sure your MongoDB is accessible and the connection string is correct');
    });
} 