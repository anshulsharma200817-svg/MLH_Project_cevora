#!/bin/bash
# Karana Platform Quick Start Guide

echo "🚀 Karana Platform - Quick Start"
echo "================================"
echo ""

# Step 1: Check Node.js
echo "✓ Node.js version:"
node --version

# Step 2: Install dependencies
echo ""
echo "✓ Installing dependencies..."
npm install

# Step 3: Create environment file
echo ""
echo "✓ Creating .env.local template..."
if [ ! -f .env.local ]; then
  cat > .env.local << 'EOF'
# Groq API Key - Get from https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# Optional: Supabase (not used in MVP)
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
EOF
  echo "   Created .env.local - Please add your GROQ_API_KEY"
else
  echo "   .env.local already exists"
fi

# Step 4: Build
echo ""
echo "✓ Building application..."
npm run build

# Step 5: Instructions
echo ""
echo "✓ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env.local and add your GROQ_API_KEY"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "🚀 To deploy to Vercel:"
echo "   npm install -g vercel"
echo "   vercel"
echo ""
echo "Pages to test:"
echo "   • http://localhost:3000 - Landing page"
echo "   • http://localhost:3000/map - Live conflict map"
echo "   • http://localhost:3000/dashboard - Commissioner dashboard"
echo "   • http://localhost:3000/tender - Tender submission"
echo "   • http://localhost:3000/ar - AR field view"
echo "   • http://localhost:3000/contractor - Scorecard"
