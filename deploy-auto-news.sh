#!/bin/bash

# Deploy automatic news updates
# This script helps you set up automatic news updates every 6 hours

echo "🚀 Setting up automatic news updates..."

# Check if we're in the right directory
if [ ! -f "supabase/functions/auto-news-update/index.ts" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Deploy the Edge Function
echo "📦 Deploying Edge Function..."
npx supabase functions deploy auto-news-update

if [ $? -eq 0 ]; then
    echo "✅ Edge Function deployed successfully!"
else
    echo "❌ Failed to deploy Edge Function"
    exit 1
fi

# Test the function
echo "🧪 Testing the function..."
response=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{}' \
  https://$SUPABASE_URL/functions/v1/auto-news-update)

http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | head -n -1)

echo "📡 Test response status: $http_code"
echo "📊 Test response body: $response_body"

if [ "$http_code" -eq 200 ]; then
    echo "✅ Function test successful!"
else
    echo "❌ Function test failed"
    echo "💡 Make sure your SUPABASE_SERVICE_ROLE_KEY is set correctly"
fi

echo ""
echo "🎉 Setup complete! Your news will now update automatically every 6 hours."
echo ""
echo "📋 Next steps:"
echo "1. Make sure your GitHub repository has these secrets set:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "2. The GitHub Action will run automatically every 6 hours"
echo "   - You can also trigger it manually from the Actions tab"
echo ""
echo "3. Monitor the function logs in your Supabase dashboard:"
echo "   - Go to Edge Functions > auto-news-update > Logs"
echo ""
echo "4. To change the update frequency, edit .github/workflows/auto-news-update.yml"
echo "   - Current schedule: every 6 hours (0 */6 * * *)"
echo "   - Other options: every 4 hours (0 */4 * * *), every 12 hours (0 */12 * * *)"
