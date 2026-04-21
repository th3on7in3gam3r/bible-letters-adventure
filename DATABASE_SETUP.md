# Database Setup - Bible Letters Adventure

## ✅ Current Status

Your Bible Letters Adventure game has **Turso database integration** for saving player progress across devices!

### What's Already Set Up:
1. ✅ Turso database created: `biblelettersadventures-th3on7in3gam3r.aws-us-east-1.turso.io`
2. ✅ API endpoint created: `api/state.ts`
3. ✅ Game state hook integrated: `src/hooks/useGameState.ts`
4. ✅ Local `.env` file configured with credentials
5. ✅ `vercel.json` created for API routing

### What the Database Does:
- **Saves player progress** (completed words, stats, streaks)
- **Syncs across devices** using a unique device ID
- **Automatic backup** - players won't lose progress
- **Table**: `player_state` with columns:
  - `player_id` (TEXT) - unique device identifier
  - `state_json` (TEXT) - serialized game state
  - `updated_at` (INTEGER) - timestamp

---

## 🚀 Required: Add Environment Variables to Vercel

You need to add the Turso credentials to your Vercel project so the API can connect to the database.

### Steps:

1. **Go to Vercel Project Settings:**
   - Visit: https://vercel.com/jerlessm-5552s-projects/bibleletteradventures/settings/environment-variables

2. **Add These Environment Variables:**

   **Variable 1:**
   - **Name:** `TURSO_DATABASE_URL`
   - **Value:** `libsql://biblelettersadventures-th3on7in3gam3r.aws-us-east-1.turso.io`
   - **Environment:** Production, Preview, Development (select all)

   **Variable 2:**
   - **Name:** `TURSO_AUTH_TOKEN`
   - **Value:** `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY3MTYyNDAsImlkIjoiMDE5ZGFjODktYzQwMS03ZDgxLWIyYzYtZWQ2YWVkN2NjMzNjIiwicmlkIjoiMmU5OTNhYzYtZGY0OC00YjI5LTgwYTUtYjQ4ZjViNWFiYjRiIn0._RW-zsX575l_8SoWwikm2d42zBCz3WzTmJ3joLo18XHIUuTKtArfsjDo_tzcfIUaZLB7wYgiCjd9U-yTgHGABA`
   - **Environment:** Production, Preview, Development (select all)

3. **Save the variables**

4. **Redeploy your project:**
   - Go to: https://vercel.com/jerlessm-5552s-projects/bibleletteradventures
   - Click on the latest deployment
   - Click "Redeploy" button

---

## 🔍 How to Verify It's Working

After redeploying with the environment variables:

1. **Visit your game:** https://letter.biblefunland.com (once DNS propagates)
2. **Play a game** and complete a word
3. **Check the browser console** (F12) - you should see no errors
4. **Open a different browser** or device
5. **The progress should sync** (same device ID = same progress)

---

## 📊 Database Schema

```sql
CREATE TABLE IF NOT EXISTS player_state (
  player_id TEXT PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
)
```

### Example State JSON:
```json
{
  "progress": ["GOD", "JESUS", "LOVE"],
  "skippedWords": ["ZACCHAEUS"],
  "stats": {
    "letterAttempts": 45,
    "letterCorrect": 42,
    "wordsSkipped": 1,
    "currentStreak": 3,
    "bestStreak": 5,
    "totalPlayMs": 180000
  },
  "settings": {
    "soundEnabled": true,
    "musicEnabled": true
  }
}
```

---

## 🔐 Security Notes

- ✅ Auth token is stored securely in Vercel environment variables
- ✅ Not exposed to the client (only used in API endpoint)
- ✅ API endpoint validates requests
- ✅ Player ID is device-based (no personal information)

---

## 🎯 What Happens Without Database Setup

If you don't add the environment variables to Vercel:
- ❌ API endpoint will fail with "Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN"
- ⚠️ Game will still work (uses localStorage as fallback)
- ⚠️ Progress won't sync across devices
- ⚠️ Players could lose progress if they clear browser data

---

## ✨ Benefits of Database Integration

With the database properly configured:
- ✅ **Cross-device sync** - play on phone, continue on tablet
- ✅ **Progress backup** - won't lose data if browser cache is cleared
- ✅ **Analytics potential** - can track popular words, completion rates
- ✅ **Future features** - leaderboards, achievements, multiplayer

---

## 🛠️ Troubleshooting

### API Returns 500 Error:
- Check that environment variables are set in Vercel
- Verify the Turso database URL is correct
- Check Vercel function logs for detailed errors

### Progress Not Syncing:
- Open browser console (F12) and check for errors
- Verify `/api/state` endpoint is accessible
- Check that the device ID is consistent

### Database Connection Issues:
- Verify Turso auth token hasn't expired
- Check Turso dashboard: https://turso.tech/
- Regenerate token if needed

---

## 📝 Next Steps

1. ✅ Add environment variables to Vercel (see above)
2. ✅ Redeploy the project
3. ✅ Test the game and verify progress saves
4. 🎉 Enjoy cross-device progress syncing!

---

**Need Help?**
- Turso Dashboard: https://turso.tech/
- Vercel Dashboard: https://vercel.com/jerlessm-5552s-projects/bibleletteradventures
- Check Vercel function logs for API errors
