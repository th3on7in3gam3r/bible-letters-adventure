# Database Migration - Connecting to mindshiftplus

## 🎯 Goal
Connect Bible Letters Adventure to the **mindshiftplus** database (used by biblefunland.com) for:
- ✅ Unified user accounts
- ✅ Shared premium subscriptions
- ✅ Cross-platform progress tracking
- ✅ Single source of truth

---

## 📊 Current Setup

### Before (Separate Databases):
- **biblefunland.com** → `mindshiftplus` database
- **Bible Letters Adventure** → `biblelettersadventures` database
- ❌ No shared user data
- ❌ Premium status not synced

### After (Unified Database):
- **Both apps** → `mindshiftplus` database
- ✅ Shared user accounts
- ✅ Premium status synced automatically
- ✅ Progress tracked centrally

---

## 🔧 Step 1: Get mindshiftplus Auth Token

You need the auth token for the mindshiftplus database. 

**Option A: From biblefunland.com project**
1. Go to biblefunland project folder
2. Check `.env` file for `TURSO_AUTH_TOKEN`
3. Copy the token

**Option B: From Turso Dashboard**
1. Go to https://turso.tech/
2. Select `mindshiftplus` database
3. Go to "Settings" → "Tokens"
4. Copy or create a new token

---

## 🔧 Step 2: Update Local Environment

**Update `.env` file:**
```env
TURSO_DATABASE_URL="libsql://mindshiftplus-th3on7in3gam3r.aws-us-east-1.turso.io"
TURSO_AUTH_TOKEN="<PASTE_MINDSHIFTPLUS_TOKEN_HERE>"
```

---

## 🔧 Step 3: Update Vercel Environment Variables

1. **Go to Vercel Project Settings:**
   https://vercel.com/jerlessm-5552s-projects/bibleletteradventures/settings/environment-variables

2. **Update these variables:**

   **TURSO_DATABASE_URL:**
   - Current: `libsql://biblelettersadventures-th3on7in3gam3r.aws-us-east-1.turso.io`
   - **New:** `libsql://mindshiftplus-th3on7in3gam3r.aws-us-east-1.turso.io`

   **TURSO_AUTH_TOKEN:**
   - Current: (old token)
   - **New:** (mindshiftplus token from Step 1)

3. **Click "Save"**

4. **Redeploy:**
   - Go to Deployments
   - Click "Redeploy" on latest deployment

---

## 📋 Step 4: Update Database Schema

The `player_state` table needs to be created in mindshiftplus database if it doesn't exist.

**The API will auto-create it**, but you can manually verify:

```sql
-- Check if table exists
SELECT name FROM sqlite_master WHERE type='table' AND name='player_state';

-- If not exists, create it (API does this automatically)
CREATE TABLE IF NOT EXISTS player_state (
  player_id TEXT PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
```

---

## 🔗 Step 5: Connect Premium Status

Update `WordList.tsx` to check real premium status:

**Current (hardcoded):**
```typescript
const isPremium = false;
```

**Updated (from biblefunland.com):**
```typescript
// TODO: Add authentication context from biblefunland.com
// For now, check localStorage for premium status
const checkPremiumStatus = () => {
  try {
    const userStr = localStorage.getItem('bfl_user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return user?.subscription?.plan === 'pro' || 
           user?.subscription?.plan === 'family';
  } catch {
    return false;
  }
};

const isPremium = checkPremiumStatus();
```

---

## 🧪 Testing the Connection

### Test 1: Database Connection
1. Deploy with new credentials
2. Play a word
3. Check browser console - no 500 errors
4. Progress should save

### Test 2: Premium Status (Future)
1. Login to biblefunland.com with Pro account
2. Open Bible Letters Adventure
3. Should have access to all words
4. No upgrade modal

### Test 3: Progress Sync
1. Complete words on Bible Letters
2. Check mindshiftplus database
3. Should see `player_state` entries

---

## 📊 Database Tables

### Existing in mindshiftplus:
- `profiles` - User accounts
- `subscriptions` - Premium status
- `child_profiles` - Family accounts
- Many more...

### New table (auto-created):
- `player_state` - Bible Letters progress

---

## 🔐 Security Notes

- ✅ Auth token is server-side only (API endpoint)
- ✅ Not exposed to client
- ✅ Same security as biblefunland.com
- ✅ Shared database = shared security model

---

## 🎯 Benefits

### For Users:
- ✅ One account for everything
- ✅ Premium unlocks all features
- ✅ Progress syncs everywhere

### For You:
- ✅ Single database to manage
- ✅ Unified analytics
- ✅ Easier premium management
- ✅ Lower costs (one database)

---

## 🚨 Important Notes

1. **Backup First:** The old `biblelettersadventures` database has existing data
2. **Migration:** Existing users will start fresh (or migrate data manually)
3. **Testing:** Test thoroughly before going live
4. **Rollback:** Keep old credentials handy in case of issues

---

## 📝 Checklist

- [ ] Get mindshiftplus auth token
- [ ] Update local `.env` file
- [ ] Update Vercel environment variables
- [ ] Redeploy on Vercel
- [ ] Test database connection
- [ ] Verify progress saves
- [ ] (Future) Connect premium status
- [ ] (Future) Add user authentication

---

## 🆘 Troubleshooting

### Error: "Missing TURSO_DATABASE_URL"
- Check Vercel environment variables are set
- Redeploy after setting variables

### Error: 500 on /api/state
- Verify auth token is correct
- Check token has read/write permissions
- Verify database URL is correct

### Progress not saving
- Check browser console for errors
- Verify API endpoint is accessible
- Check Vercel function logs

---

## ✅ Success Criteria

When everything is working:
- ✅ No console errors
- ✅ Progress saves and persists
- ✅ API returns 200 status
- ✅ Database shows player_state entries
- ✅ (Future) Premium status syncs

---

**Ready to connect? Follow the steps above!** 🚀
