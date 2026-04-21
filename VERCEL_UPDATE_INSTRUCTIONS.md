# 🚀 URGENT: Update Vercel Environment Variables

## What Changed
Bible Letters Adventure now uses the **mindshiftplus** database (same as biblefunland.com) for unified user data.

---

## ⚡ Quick Steps

### 1. Go to Vercel Settings
https://vercel.com/jerlessm-5552s-projects/bibleletteradventures/settings/environment-variables

### 2. Update TURSO_DATABASE_URL
**Find:** `TURSO_DATABASE_URL`
**Change from:** `libsql://biblelettersadventures-th3on7in3gam3r.aws-us-east-1.turso.io`
**Change to:** `libsql://mindshiftplus-th3on7in3gam3r.aws-us-east-1.turso.io`

### 3. Update TURSO_AUTH_TOKEN
**Find:** `TURSO_AUTH_TOKEN`
**Change to:** 
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY3OTY3NzUsImlkIjoiMDE5ZDAyMTItMzIwMS03M2I5LTllYzMtMTNhNjJkODlhZmNhIiwicmlkIjoiMTMyODNiY2ItNDJiNi00ZDIwLWFiYjItNWQzNzZlMTYxNWQ0In0.vRkYOb5O3bbolVQBcyWJLrQcX68kG1jZaoFd-zV1jsDrT_dG6ryh8b6luD2VjDu2sOqe-klnW3-P6v6htUfnDg
```

### 4. Save Changes
Click **"Save"** button

### 5. Redeploy
- Go to: https://vercel.com/jerlessm-5552s-projects/bibleletteradventures
- Click **"Deployments"** tab
- Click **"Redeploy"** on the latest deployment

---

## ✅ Benefits

After this update:
- ✅ **Unified database** - One database for both apps
- ✅ **Shared user accounts** - Same users across platforms
- ✅ **Premium sync** - Pro/Family status works everywhere
- ✅ **Better analytics** - All data in one place
- ✅ **Lower costs** - One database instead of two

---

## 🧪 Testing

After redeployment:
1. Visit: https://letter.biblefunland.com
2. Play a word
3. Check console - should be no errors
4. Progress should save correctly

---

## 🆘 If Something Goes Wrong

**Rollback values:**
- Old URL: `libsql://biblelettersadventures-th3on7in3gam3r.aws-us-east-1.turso.io`
- Old Token: (check previous Vercel settings or DATABASE_SETUP.md)

---

## 📊 What This Enables (Future)

With shared database, you can now:
- Check premium status from biblefunland.com
- Sync progress across all games
- Unified user dashboard
- Cross-platform achievements
- Family account sharing

---

**Time to update: ~2 minutes**
**Deployment time: ~1-2 minutes**
**Total: ~5 minutes** ⏱️

🚀 **Let's do this!**
