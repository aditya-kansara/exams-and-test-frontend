# Frontend Deployment Checklist

## ✅ Fixed Issues
- **TypeScript Error**: Fixed missing `verifyMagicLink` method in `ApiClient` class
- **Type Definition**: Added `MagicLinkVerifyResponse` type to the types file

## ⚠️ Critical Issues to Address Before Deployment

### 1. Missing Environment Variables
**Impact**: HIGH - Application will crash on startup

Your application requires the following environment variables to be set in production:

#### Required for Production:
```env
# Supabase Configuration (CRITICAL)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API (CRITICAL)
NEXT_PUBLIC_API_BASE=https://your-production-api.com

# Stripe Configuration (if using payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
STRIPE_SECRET_KEY=sk_live_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Files affected:
- `src/config/supabase.ts` - Will throw error if Supabase vars are missing
- `src/lib/supabase.ts` - Will throw error if Supabase vars are missing
- `src/lib/api.ts` - Falls back to `http://localhost:8000` if `NEXT_PUBLIC_API_BASE` is not set

**Action Required**: 
- Create these environment variables in your deployment platform (Vercel/Netlify/etc.)
- Never commit `.env.local` to git
- Update `env.example` if needed

---

### 2. Hardcoded Localhost URLs
**Impact**: HIGH - Features will fail in production

#### Issue 1: Setup Page (`src/app/setup/page.tsx`)
Lines 20, 177, 196 contain hardcoded `http://localhost:8000`

**Current Code:**
```typescript
const response = await fetch('http://localhost:8000/api/v1/exam/seed/items', {
  method: 'POST',
  ...
})
```

**Fix Required:**
```typescript
const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
const response = await fetch(`${apiBase}/api/v1/exam/seed/items`, {
  method: 'POST',
  ...
})
```

**Action Required**: Update all hardcoded URLs in `setup/page.tsx`

---

### 3. Console Statements in Production
**Impact**: MEDIUM - Performance & Security

Found **18 console statements** across 6 files:
- `contexts/AuthContext.tsx` (6 statements)
- `app/auth/callback/page.tsx` (8 statements)
- `app/setup/page.tsx` (1 statement)
- Other files (3 statements)

**Recommendation**: 
- Remove or wrap in `if (process.env.NODE_ENV === 'development')`
- Or use a proper logging library for production

**Example Fix:**
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Handling OAuth callback...')
}
```

---

### 4. Next.js Configuration Issues
**Impact**: MEDIUM

#### Issue: `next.config.js` exposes server-side secrets
```javascript
env: {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,  // ⚠️ Don't expose to client
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,  // ⚠️ Don't expose to client
}
```

**Fix Required:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-production-domain.com'], // Add production domains
  },
  // Don't expose server-only secrets to the client
  // Use API routes for server-side Stripe operations
}

module.exports = nextConfig
```

**Action Required**:
1. Remove server secrets from `next.config.js`
2. Keep server secrets only in server-side API routes
3. Add production image domains

---

### 5. Missing .env.local File
**Impact**: HIGH - Required for local development

You need to create `frontend/.env.local` with:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API
NEXT_PUBLIC_API_BASE=http://localhost:8000

# Stripe (Development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

---

## 🔍 Additional Checks Before Deployment

### 6. Build Test
**Always test the production build locally before deploying:**

```bash
cd frontend
npm run build
npm start
```

This will catch:
- TypeScript errors
- Missing dependencies
- Build configuration issues
- Runtime errors

---

### 7. Environment-Specific Settings

#### For Vercel:
1. Go to Project Settings → Environment Variables
2. Add all required `NEXT_PUBLIC_*` variables
3. Add server-only variables (without `NEXT_PUBLIC_` prefix)
4. Redeploy after adding variables

#### For Netlify:
1. Go to Site Settings → Environment Variables
2. Add all required variables
3. Trigger a new deploy

#### For Docker/Self-Hosted:
1. Create `.env.production` file
2. Use `docker-compose` with environment files
3. Ensure secrets are properly managed

---

### 8. CORS Configuration
**Impact**: HIGH - API calls will fail

Ensure your backend API allows requests from your frontend domain:

```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "https://your-production-domain.com",  # Add this
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 9. Supabase Configuration
**Impact**: HIGH - Authentication will fail

Ensure in your Supabase project:

1. **Authentication Settings**:
   - Go to Authentication → URL Configuration
   - Add your production URL to "Site URL"
   - Add your production URL to "Redirect URLs"
   - Example: `https://your-app.com/auth/callback`

2. **Google OAuth**:
   - Update authorized redirect URIs in Google Cloud Console
   - Add production callback URL

---

### 10. API Route Paths
**Impact**: MEDIUM

Verify all API endpoints match between frontend and backend:

**Frontend expects:**
- `/auth/verify-magic-link` ✅
- `/auth/magic-invite` ✅
- `/auth/magic-link` ✅
- `/auth/profile` ✅
- `/api/v1/exam/start` ✅
- `/api/v1/exam/answer` ✅
- `/api/v1/exam/finish` ✅
- `/api/v1/exam/{attemptId}/report` ✅
- `/api/v1/exam/{attemptId}/state` ✅

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Hardcoded localhost URLs replaced
- [ ] Console statements removed/wrapped
- [ ] `next.config.js` updated (remove server secrets, add domains)
- [ ] `.env.local` created locally
- [ ] Production build tested locally (`npm run build && npm start`)
- [ ] CORS configured on backend
- [ ] Supabase URLs configured
- [ ] Google OAuth redirect URIs updated
- [ ] Image domains added to Next.js config
- [ ] TypeScript compilation successful
- [ ] All linter errors resolved

---

## 🚀 Deployment Steps

### 1. Fix Critical Issues
```bash
cd frontend

# Fix setup page hardcoded URLs
# Fix next.config.js
# Remove/wrap console statements
```

### 2. Test Build Locally
```bash
npm run build
npm start

# Visit http://localhost:3000
# Test all features
```

### 3. Configure Environment Variables
Add all required environment variables to your deployment platform

### 4. Deploy
```bash
# For Vercel
vercel --prod

# For Netlify
netlify deploy --prod

# For Docker
docker build -t frontend .
docker run -p 3000:3000 --env-file .env.production frontend
```

### 5. Post-Deployment Verification
- [ ] Visit production URL
- [ ] Test authentication (Google OAuth, Magic Link)
- [ ] Test exam flow
- [ ] Check browser console for errors
- [ ] Test on mobile devices

---

## 🆘 Common Deployment Errors & Solutions

### Error: "Missing Supabase environment variables"
**Solution**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your deployment platform

### Error: "Network Error" or "CORS error"
**Solution**: 
1. Check backend CORS configuration
2. Verify `NEXT_PUBLIC_API_BASE` is set correctly
3. Ensure backend is accessible from frontend

### Error: "Invalid or expired magic link"
**Solution**:
1. Check Supabase redirect URLs configuration
2. Verify callback URL matches production domain

### Error: "Failed to compile" with TypeScript errors
**Solution**: 
1. Run `npm run type-check` locally
2. Fix all TypeScript errors before deploying
3. Ensure all dependencies are installed

---

## 📝 Notes

- **Security**: Never expose server-side secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) to the client
- **Performance**: Consider enabling Next.js image optimization in production
- **Monitoring**: Add error tracking (Sentry, LogRocket) for production debugging
- **Analytics**: Consider adding analytics (Google Analytics, Plausible)

---

## 🔗 Useful Links

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Supabase Auth Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)

