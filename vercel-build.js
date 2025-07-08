const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Set environment variables for build
  process.env.GENERATE_SOURCEMAP = 'false';
  process.env.CI = 'false';
  process.env.NODE_ENV = 'production';

  // Build the application
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build output
  const buildPath = path.join(__dirname, 'build');
  if (!fs.existsSync(buildPath)) {
    throw new Error('Build directory not found');
  }

  console.log('✅ Build completed successfully!');
  console.log('📁 Build output:', buildPath);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 