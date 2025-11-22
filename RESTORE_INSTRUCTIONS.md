# Complete Restoration Instructions

## Overview
This guide provides detailed step-by-step instructions for restoring this furniture e-commerce website backup to a new environment, including Bolt.new or any other development platform.

---

## Method 1: Restore to Bolt.new (Recommended)

### Step 1: Create New Bolt.new Project
1. Go to https://bolt.new
2. Create a new blank project
3. Wait for the project to initialize

### Step 2: Upload Backup Files
1. Extract `project-files.tar.gz` on your local machine
2. Upload all files to the new Bolt.new project using the file upload feature
3. Alternatively, paste file contents one by one through the interface

### Step 3: Install Dependencies
In the Bolt.new terminal, run:
```bash
npm install
```

### Step 4: Configure Environment
1. Create a `.env` file in the project root
2. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 5: Setup Database
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migrations in order from `supabase/migrations/` folder
   - Or run `complete_database_schema.sql` for complete setup

### Step 6: Start Development Server
The development server should start automatically in Bolt.new. If not:
```bash
npm run dev
```

---

## Method 2: Restore to Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git (optional)
- Code editor (VS Code recommended)

### Step 1: Extract Files
```bash
mkdir furniture-ecommerce
cd furniture-ecommerce
tar -xzf project-files.tar.gz
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Setup Supabase

#### Option A: Use Existing Supabase Project
1. Login to Supabase dashboard
2. Get your project URL and anon key from Settings → API
3. Apply migrations from `supabase/migrations/` folder in SQL Editor

#### Option B: Create New Supabase Project
1. Go to https://app.supabase.com
2. Create new project
3. Wait for provisioning to complete
4. Get credentials from Settings → API
5. Apply database schema using SQL Editor

### Step 5: Run Development Server
```bash
npm run dev
```

Access the application at `http://localhost:5173`

---

## Method 3: Deploy to Production

### Prerequisites
- Completed local setup
- Production Supabase project
- Hosting platform account (Vercel, Netlify, etc.)

### Step 1: Build for Production
```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### Step 2: Configure Production Environment
Set environment variables in your hosting platform:
```
VITE_SUPABASE_URL=production_supabase_url
VITE_SUPABASE_ANON_KEY=production_anon_key
```

### Step 3: Deploy

#### Vercel:
```bash
npm install -g vercel
vercel --prod
```

#### Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Manual:
1. Upload contents of `dist/` folder to your web server
2. Configure server to serve `index.html` for all routes (SPA routing)

---

## Database Setup Details

### Migration Order
Migrations must be applied in chronological order:
1. `20251022091602_create_furniture_ecommerce_schema.sql`
2. `20251022121839_fix_profiles_rls_infinite_recursion.sql`
3. `20251022124737_add_payment_method_to_orders.sql`
4. `20251022133321_create_hero_dynamic_content_tables.sql`
5. `20251022174750_add_search_and_backorder_features.sql`
6. `20251023104340_add_delivery_date_to_orders.sql`
7. `20251023131149_add_order_tracking_system.sql`
8. `20251024111010_fix_guest_checkout_rls.sql`

### Alternative: Complete Schema
Run `complete_database_schema.sql` which contains all migrations combined.

### Verify Database Setup
After applying migrations, verify tables exist:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see 21 tables including:
- products
- categories
- orders
- order_items
- cart_items
- profiles
- shipping_addresses
- hero_slides
- craftsmanship_highlights
- And more...

---

## Troubleshooting

### Issue: Dependencies Won't Install
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Supabase Connection Error
**Solution:**
1. Verify `.env` file exists and has correct credentials
2. Check Supabase project is active (not paused)
3. Verify API keys are correct in Supabase dashboard
4. Ensure anon key has proper permissions

### Issue: Build Fails
**Solution:**
```bash
npm run typecheck  # Check for TypeScript errors
npm run lint       # Check for linting issues
```

### Issue: Database Migrations Fail
**Solution:**
1. Check migration files are in correct order
2. Verify you have proper database permissions
3. Check for syntax errors in SQL files
4. Try running migrations one at a time

### Issue: Images Not Loading
**Solution:**
1. Verify `public/` folder was copied correctly
2. Check image paths in database match actual files
3. Ensure build process includes public assets

---

## Post-Restoration Checklist

- [ ] All dependencies installed successfully
- [ ] Environment variables configured correctly
- [ ] Database migrations applied without errors
- [ ] Development server starts without errors
- [ ] Homepage loads correctly
- [ ] Product catalog displays products
- [ ] Navigation works properly
- [ ] Cart functionality works
- [ ] Admin panel accessible (if you have admin user)
- [ ] Multi-language switching works
- [ ] Multi-currency switching works
- [ ] Responsive design works on mobile

---

## Creating Admin User

After restoration, create an admin user:

1. Sign up through the website interface
2. Get the user ID from Supabase Authentication
3. Run in Supabase SQL Editor:
```sql
UPDATE profiles
SET is_admin = true
WHERE id = 'your-user-id-here';
```

---

## Additional Resources

- **Supabase Documentation**: https://supabase.com/docs
- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **TailwindCSS Documentation**: https://tailwindcss.com/docs
- **React Router Documentation**: https://reactrouter.com

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the SETUP_GUIDE.md file
3. Consult the original backup metadata
4. Review console errors for specific issues

---

**Backup Created:** October 26, 2025 at 19:22:34
**Version:** v8
**Status:** Production-ready stable release
