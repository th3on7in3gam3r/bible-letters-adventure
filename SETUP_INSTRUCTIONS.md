# 🚀 Setup Instructions - Bible Letters Adventure

## What You Need To Do Now

### Step 1: Get Clerk Publishable Key

You need to get the Clerk publishable key from biblefunland.

**Option A: From biblefunland .env file**
1. Open `biblefunland/.env` (local file)
2. Copy the value of `VITE_CLERK_PUBLISHABLE_KEY`

**Option B: From Clerk Dashboard**
1. Go to: https://dashboard.clerk.com
2. Select your biblefunland app
3. Go to "API Keys"
4. Copy the "Publishable Key" (starts with `pk_test_` or `pk_live_`)

---

### Step 2: Update Vercel Environment Variables

Go to: https://vercel.com/jerlessm-5552s-projects/bibleletteradventures/settings/environment-variables

**Add these 3 variables:**

1. **VITE_CLERK_PUBLISHABLE_KEY**
   - Value: `pk_test_...` (from Step 1)
   - Apply to: Production, Preview, Development

2. **TURSO_DATABASE_URL**
   - Value: `libsql://mindshiftplus-th3on7in3gam3r.aws-us-east-1.turso.io`
   - Apply to: Production, Preview, Development

3. **TURSO_AUTH_TOKEN**
   - Value: `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY3OTY3NzUsImlkIjoiMDE5ZDAyMTItMzIwMS03M2I5LTllYzMtMTNhNjJkODlhZmNhIiwicmlkIjoiMTMyODNiY2ItNDJiNi00ZDIwLWFiYjItNWQzNzZlMTYxNWQ0In0.vRkYOb5O3bbolVQBcyWJLrQcX68kG1jZaoFd-zV1jsDrT_dG6ryh8b6luD2VjDu2sOqe-klnW3-P6v6htUfnDg`
   - Apply to: Production, Preview, Development

---

### Step 3: Redeploy on Vercel

After adding the environment variables:

1. Go to: https://vercel.com/jerlessm-5552s-projects/bibleletteradventures
2. Click "Deployments" tab
3. Click the three dots (...) on the latest deployment
4. Click "Redeploy"
5. Wait for deployment to complete (~2 minutes)

---

### Step 4: Test It!

1. **Go to:** https://letter.biblefunland.com
2. **Click "Sign In"** button (top right)
3. **Sign in** with your biblefunland.com credentials
4. **Check if all words unlock** (if you have Pro subscription)

---

## How To Test Premium Status

### Test as Free User:
1. Sign in with an account that doesn't have Pro
2. Play 5 words
3. Word #6 should show lock icon
4. Click locked word → Upgrade modal appears

### Test as Pro User:
1. Sign in with a Pro account (from biblefunland.com)
2. All 52 words should be unlocked immediately
3. No locks, no upgrade prompts

---

## Troubleshooting

### Issue: "Missing Clerk Publishable Key" error
**Solution:** Make sure you added `VITE_CLERK_PUBLISHABLE_KEY` to Vercel and redeployed

### Issue: Sign in button doesn't appear
**Solution:** Clear browser cache and hard refresh (Cmd+Shift+R)

### Issue: Words still locked after signing in as Pro
**Solution:** 
1. Check that all 3 environment variables are set in Vercel
2. Check browser console for errors
3. Verify your subscription is active in biblefunland.com

### Issue: Can't sign in
**Solution:** 
1. Make sure you're using the same Clerk key as biblefunland.com
2. Try signing in on biblefunland.com first
3. Then go to letter.biblefunland.com

---

## Summary

✅ **Code pushed to GitHub** - https://github.com/th3on7in3gam3r/bible-letters-adventure
✅ **Clerk authentication added** - Users can sign in
✅ **Database integration complete** - Checks mindshiftplus for subscription
✅ **Ready to deploy** - Just need to add environment variables

**Next:** Add the 3 environment variables to Vercel and redeploy! 🚀
