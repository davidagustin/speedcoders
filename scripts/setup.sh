#!/bin/bash

echo "🚀 Setting up LeetCode Scraper..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create data directory
echo "📁 Creating data directory..."
mkdir -p ../data

# Test the scraper
echo "🧪 Testing the scraper..."
node test-scraper.js

if [ $? -eq 0 ]; then
    echo "✅ Setup completed successfully!"
    echo ""
    echo "🎉 You can now run the scraper:"
    echo "   npm run scrape    # Run GraphQL scraper (recommended)"
    echo "   node leetcode-scraper.js    # Run Puppeteer scraper"
    echo ""
    echo "📁 Scraped data will be saved in the 'data' directory"
else
    echo "❌ Test failed. Please check the error messages above."
    exit 1
fi
