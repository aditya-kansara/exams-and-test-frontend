# Frontend Environment Setup

## Required Environment Variables

The frontend requires the following environment variables to connect to Supabase:

### 1. Create `.env.local` file

Create a `.env.local` file in the `frontend` directory with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tqppecikyujcnxcboaif.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxcHBlY2lreXVqY254Y2JvYWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjM0MzMsImV4cCI6MjA3NDYzOTQzM30.0tVnZJMI7peMqV_6e7x-_-dLc2HXErIdrP-DC6gV0wQ

# API Configuration (optional)
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### 2. Get Supabase Credentials

If you need to get your own Supabase credentials:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Environment Variable Details

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key (safe for client-side use)
- `NEXT_PUBLIC_API_BASE`: Backend API base URL (defaults to localhost:8000)

### 4. Security Notes

- ✅ `NEXT_PUBLIC_*` variables are safe to expose in the browser
- ✅ The anon key is designed for client-side use
- ❌ Never expose service role keys in frontend code
- ❌ Never commit `.env.local` to version control

### 5. Troubleshooting

If you get environment variable errors:

1. Make sure `.env.local` exists in the `frontend` directory
2. Restart the development server after adding environment variables
3. Check that variable names start with `NEXT_PUBLIC_`
4. Verify the Supabase URL and key are correct

### 6. Production Deployment

For production, set these environment variables in your deployment platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Other platforms: Follow their environment variable setup guide
