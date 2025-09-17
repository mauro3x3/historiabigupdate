# Automatic News Updates Setup

Since Supabase's pg_cron extension requires superuser access, here are alternative ways to set up automatic news updates every 6 hours:

## Option 1: GitHub Actions (Recommended)

Create `.github/workflows/auto-news-update.yml`:

```yaml
name: Auto News Update

on:
  schedule:
    # Run every 6 hours
    - cron: '0 */6 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  update-news:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger News Update
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{}' \
            https://your-project-ref.supabase.co/functions/v1/auto-news-update
```

## Option 2: Vercel Cron Jobs

If using Vercel, create `api/cron/auto-news-update.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify the request is from Vercel cron
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const response = await fetch(
      'https://your-project-ref.supabase.co/functions/v1/auto-news-update',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    )

    const result = await response.json()
    
    return res.status(200).json({
      success: true,
      message: 'News update triggered',
      result
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    return res.status(500).json({ error: 'Failed to trigger news update' })
  }
}
```

Then add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-news-update",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## Option 3: External Cron Service

Use services like:
- **cron-job.org** (free)
- **EasyCron** (paid)
- **SetCronJob** (free tier)

Set up a webhook that calls:
```
POST https://your-project-ref.supabase.co/functions/v1/auto-news-update
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
Content-Type: application/json
Body: {}
```

## Option 4: Manual Database Cron (If you have superuser access)

1. Enable pg_cron extension in Supabase dashboard
2. Run the `setup-auto-news-cron.sql` script
3. Uncomment the cron schedule line you want

## Testing

Test the function manually:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{}' \
  https://your-project-ref.supabase.co/functions/v1/auto-news-update
```

## Environment Variables Needed

Make sure these are set in your deployment:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEWS_API_KEY` (if not hardcoded)

## Monitoring

Check the function logs in Supabase dashboard:
1. Go to Edge Functions
2. Click on `auto-news-update`
3. View the logs tab

Or check the `cron_logs` table if using database cron.
