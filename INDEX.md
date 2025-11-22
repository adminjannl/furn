# Backup Index - Quick Reference Guide

## 📋 Table of Contents

- [Quick Access](#quick-access)
- [Documentation Files](#documentation-files)
- [Source Code Structure](#source-code-structure)
- [Database Files](#database-files)
- [Configuration Files](#configuration-files)
- [Common Tasks](#common-tasks)

---

## 🚀 Quick Access

### Start Here
- **New to this backup?** → Read `00-START-HERE.txt`
- **Quick 5-minute restore?** → Follow `QUICK_RESTORE.md`
- **Detailed instructions?** → Read `RESTORE_INSTRUCTIONS.md`
- **Technical details?** → Check `BACKUP_METADATA.json`

### Most Used Files
- **Project Archive**: `project-files.tar.gz`
- **Database Schema**: `complete_database_schema.sql`
- **Dependencies**: `package.json`
- **Environment Template**: See RESTORE_INSTRUCTIONS.md

---

## 📚 Documentation Files

### Overview Documents
| File | Purpose | Read Time |
|------|---------|-----------|
| `00-START-HERE.txt` | Quick overview and navigation | 2 min |
| `BACKUP_SUMMARY.txt` | Detailed backup report | 3 min |
| `MANIFEST.txt` | Complete file listing | 2 min |
| `INDEX.md` | This file - Quick reference | - |

### Restoration Guides
| File | Purpose | Skill Level |
|------|---------|-------------|
| `QUICK_RESTORE.md` | 5-minute quick start | Beginner |
| `RESTORE_INSTRUCTIONS.md` | Complete restoration guide | All levels |
| `BACKUP_VERIFICATION.txt` | Post-restore checklist | Intermediate |

### Technical References
| File | Contents | Use Case |
|------|----------|----------|
| `BACKUP_METADATA.json` | Machine-readable specs | Automation |
| `README.md` | Project overview | Understanding |
| `SETUP_GUIDE.md` | Configuration guide | Setup |

---

## 🗂️ Source Code Structure

### Main Application
```
src/
├── App.tsx                 → Main app component
├── main.tsx               → Entry point
└── index.css              → Global styles
```

### Components (38 total)
```
src/components/
├── Layout Components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── UtilityHeader.tsx
│   └── Breadcrumb.tsx
│
├── Product Components
│   ├── ProductOfTheMonth.tsx
│   ├── QuickViewModal.tsx
│   ├── RecentlyViewed.tsx
│   ├── ProductImageZoom.tsx
│   └── PriceBreakdown.tsx
│
├── UI Components
│   ├── Button.tsx
│   ├── LoadingSpinner.tsx
│   ├── Toast.tsx
│   ├── DatePicker.tsx
│   └── SearchBar.tsx
│
├── Visual Effects
│   ├── GradientMesh.tsx
│   ├── FurnitureParticles.tsx
│   ├── Snowfall.tsx
│   └── SpotlightCursor.tsx
│
└── Content Components
    ├── HeroBanner.tsx
    ├── HeroFeatures.tsx
    ├── CraftsmanshipHighlights.tsx
    └── TrustBadges.tsx
```

### Pages (34 total)
```
src/pages/
├── Public Pages (24)
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── ... (19 more)
│
└── Admin Pages (10)
    ├── Dashboard.tsx
    ├── Products.tsx
    ├── Orders.tsx
    └── ... (7 more)
```

### State Management
```
src/contexts/
├── AuthContext.tsx        → User authentication
├── CartContext.tsx        → Shopping cart state
└── CurrencyContext.tsx    → Currency management
```

### Utilities & Hooks
```
src/
├── hooks/
│   ├── useCurrencyFormat.ts
│   └── useRecentlyViewed.ts
│
├── utils/
│   ├── currency.ts
│   └── pricing.ts
│
└── lib/
    ├── supabase.ts
    ├── database.types.ts
    └── queryClient.ts
```

### Internationalization
```
src/i18n/
├── config.ts              → i18n configuration
└── locales/
    ├── en.json            → English
    ├── nl.json            → Dutch
    ├── de.json            → German
    └── fr.json            → French
```

---

## 🗄️ Database Files

### Migration Files (Apply in order)
```
supabase/migrations/
├── 1. 20251022091602_create_furniture_ecommerce_schema.sql
├── 2. 20251022121839_fix_profiles_rls_infinite_recursion.sql
├── 3. 20251022124737_add_payment_method_to_orders.sql
├── 4. 20251022133321_create_hero_dynamic_content_tables.sql
├── 5. 20251022174750_add_search_and_backorder_features.sql
├── 6. 20251023104340_add_delivery_date_to_orders.sql
├── 7. 20251023131149_add_order_tracking_system.sql
└── 8. 20251024111010_fix_guest_checkout_rls.sql
```

### Quick Schema Setup
**File**: `complete_database_schema.sql`
- All migrations combined
- Single file to run
- Faster initial setup

### Database Tables (21 total)
**Core Tables:**
- products, categories, product_images, product_colors
- orders, order_items, order_status_history, order_tracking_events
- cart_items, shipping_addresses
- profiles (users)

**Feature Tables:**
- back_orders, search_history
- hero_slides, hero_features
- craftsmanship_highlights
- production_stages, quality_checkpoints
- material_sources, team_members, workshop_facilities

---

## ⚙️ Configuration Files

### Build & Development
| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Vite build configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | TailwindCSS theme |
| `postcss.config.js` | PostCSS processing |
| `eslint.config.js` | Code linting rules |

### Application
| File | Purpose |
|------|---------|
| `index.html` | HTML entry point |
| `.env` | Environment variables (not included) |
| `public/manifest.json` | PWA manifest |

---

## 🔧 Common Tasks

### Restore Backup to Bolt.new
```bash
# See: QUICK_RESTORE.md
1. Extract: tar -xzf project-files.tar.gz
2. Upload all files to new Bolt.new project
3. Create .env with Supabase credentials
4. Run complete_database_schema.sql in Supabase
```

### Restore to Local Development
```bash
# See: RESTORE_INSTRUCTIONS.md → Method 2
1. tar -xzf project-files.tar.gz
2. npm install
3. Create .env file
4. Run database migrations
5. npm run dev
```

### Find Specific Component
1. Check `src/components/` directory listing above
2. Or use `MANIFEST.txt` for complete file list
3. All components are in TypeScript (.tsx)

### Update Database Schema
```sql
-- Apply migrations in order from supabase/migrations/
-- Or run complete_database_schema.sql for fresh install
```

### Add New Language
```javascript
// Add translation file to src/i18n/locales/
// Format: { "key": "Translation" }
// Update src/i18n/config.ts to include new language
```

### Create Admin User
```sql
-- After signing up through website
UPDATE profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

### Build for Production
```bash
npm run build
# Output in dist/ directory
```

### Check Code Quality
```bash
npm run lint      # Check for linting issues
npm run typecheck # Check TypeScript types
```

---

## 🔍 Finding Things

### Need to find...

**A specific page?**
→ Check `src/pages/` or `src/pages/admin/`

**A component?**
→ Check `src/components/` + see structure above

**Styling?**
→ `src/index.css` (global) or component files

**Database table structure?**
→ `src/lib/database.types.ts` or migrations

**Translations?**
→ `src/i18n/locales/[language].json`

**Configuration?**
→ Root directory config files (see list above)

**Business logic?**
→ `src/contexts/` for state, `src/utils/` for helpers

---

## 📞 Quick Reference Links

**In This Backup:**
- 📖 Full Instructions: `RESTORE_INSTRUCTIONS.md`
- ⚡ Quick Start: `QUICK_RESTORE.md`
- 📊 Detailed Stats: `BACKUP_METADATA.json`
- ✓ Verification: `BACKUP_VERIFICATION.txt`

**External Resources:**
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Tailwind Docs: https://tailwindcss.com/docs

---

## 📈 Version Information

**Backup Version:** v8
**Created:** October 26, 2025 at 19:22:34
**Status:** Production Ready ✓
**Total Files:** 115
**Archive Size:** 185KB

---

*This index provides quick navigation to all backup contents. For detailed information, reference the specific documentation files mentioned above.*
