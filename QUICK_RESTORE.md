# Quick Restore Guide - 5 Minutes

This guide gets you up and running in 5 minutes.

---

## For Bolt.new (Fastest)

### 1. Extract Archive
```bash
tar -xzf project-files.tar.gz
```

### 2. Upload to Bolt.new
- Create new Bolt.new project
- Upload all extracted files
- Bolt.new will auto-install dependencies

### 3. Configure Environment
Create `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Setup Database
In Supabase SQL Editor, paste and run:
```bash
complete_database_schema.sql
```

### ✅ Done!
Your site should be running automatically.

---

## For Local Development

### 1. Extract & Install
```bash
tar -xzf project-files.tar.gz
npm install
```

### 2. Configure
Create `.env` with Supabase credentials.

### 3. Database
Run `complete_database_schema.sql` in Supabase.

### 4. Start
```bash
npm run dev
```

### ✅ Done!
Visit http://localhost:5173

---

## Minimal Requirements

✓ Node.js 18+
✓ Supabase account (free tier works)
✓ Modern web browser

---

## Quick Test Checklist

After restoration, verify these work:
- [ ] Homepage loads
- [ ] Products page shows items
- [ ] Cart works
- [ ] Language switcher works
- [ ] Currency switcher works

---

## Get Supabase Credentials

1. Visit https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL
   - anon/public key

---

## Common Issues

**Can't connect to Supabase?**
→ Check .env file has correct credentials

**Products not showing?**
→ Verify database migrations ran successfully

**Build errors?**
→ Run: `rm -rf node_modules && npm install`

---

**Need detailed help?** See `RESTORE_INSTRUCTIONS.md`

**Version:** v8 | **Date:** October 26, 2025
