# Addee Setup Guide

## ✅ Completed
- Project structure initialized from bloggy
- Branding & colors updated (red/orange + green + blue)
- Database schema created (brands, campaigns, ad_drafts)
- Pages & UI built (brands, campaigns, ad generation)
- Generation API endpoint created
- Environment variables configured (.env.local)

## 🔧 Next Steps

### 1. Run Database Migrations

Choose one approach:

**Option A: Using Supabase Dashboard (Easiest)**
1. Go to https://app.supabase.com
2. Login with your account
3. Navigate to SQL Editor
4. Copy & paste the SQL from `supabase/sql/migration_addee_schema.sql`
5. Run the script

**Option B: Using Supabase CLI**
```bash
# Install CLI
npm install -g supabase

# Link project
supabase link --project-ref pseibsrdizajjeputhbp

# Push migrations
supabase db push
```

### 2. Test Locally
```bash
npm install
npm run dev
```

Visit http://localhost:3000 and test:
- [ ] Sign up / Login
- [ ] Create a brand
- [ ] Create a campaign
- [ ] Generate ads

### 3. Push to GitHub
```bash
git init
git add .
git commit -m "Initial Addee project"
git remote add origin https://github.com/yourusername/addee.git
git push -u origin main
```

### 4. Deploy to Vercel
1. Go to https://vercel.com
2. Connect your GitHub repo
3. Set environment variables (copy from .env.local)
4. Deploy
5. Add custom domain: addee.online

### 5. Configure OAuth (Optional, for future features)

For Google/LinkedIn integrations, you'll need to update:
- Google Cloud Console: Set OAuth redirect to https://addee.online/api/social/gmb/callback
- LinkedIn Developers: Set redirect to https://addee.online/api/social/linkedin/callback

## 📋 Features to Add Next

- [ ] Ayrshare integration for multi-platform publishing
- [ ] Image generation with DALL-E
- [ ] Edit UI for generated ads
- [ ] Direct publish to platforms
- [ ] Analytics dashboard
- [ ] Team collaboration
