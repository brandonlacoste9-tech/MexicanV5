#!/bin/bash
# Apply the remix_type migration to Railway database

echo "🔧 Applying remix_type column migration to Railway database..."
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi

# Check if connected
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Run: railway login"
    exit 1
fi

echo "📊 Running migration..."
railway run psql $DATABASE_URL -f backend/migrations/20260206_add_remix_type_column.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration applied successfully!"
    echo "🚀 The feed API should now work. Test at:"
    echo "   https://ojeav5-production.up.railway.app/api/posts/feed"
else
    echo ""
    echo "❌ Migration failed. Check the error above."
    exit 1
fi
