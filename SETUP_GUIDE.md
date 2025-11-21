# FurniShop - Furniture E-Commerce Platform

A full-featured furniture e-commerce platform built with React, TypeScript, Tailwind CSS, and Supabase.

## Features Implemented

### Core Features
- **User Authentication**: Sign up, login, password reset
- **Admin Dashboard**: Complete admin interface for managing the store
- **Category Management**: Add, edit, delete, and organize product categories
- **Product Management**: Comprehensive product listings with search functionality
- **Customer Homepage**: Beautiful landing page with featured products and categories
- **Responsive Design**: Fully responsive design for all screen sizes

### Database Schema
- Categories with images and ordering
- Products with detailed specifications (dimensions, weight, materials, stock, SKU)
- Product images (multiple images per product)
- Product colors/finishes
- User profiles with admin roles
- Orders and order items
- Shopping cart items
- Shipping addresses

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. The environment variables are already configured in `.env`:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

3. Start the development server:
```bash
npm run dev
```

## Creating an Admin User

To access the admin dashboard, you need to create a user account and set it as an admin:

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your app and sign up for a new account at `/signup`
2. After signing up, go to your Supabase dashboard
3. Navigate to: Table Editor → profiles
4. Find your user profile
5. Edit the `is_admin` column and set it to `true`
6. Save the changes
7. Refresh your app and you should see the "Admin Dashboard" option in your user menu

### Method 2: Using SQL (Alternative)

1. First, sign up for an account at `/signup` with your email
2. Go to Supabase Dashboard → SQL Editor
3. Run this query (replace with your email):

```sql
UPDATE profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

### Accessing the Admin Dashboard

Once you have admin access:
1. Log in to your account
2. Click your user icon in the top right
3. Select "Admin Dashboard"
4. You now have access to:
   - Dashboard with stats
   - Categories management
   - Products management
   - Orders management (coming soon)

## Current Pages and Routes

### Public Routes
- `/` - Homepage with featured products
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password reset

### Protected Routes (Require Login)
- `/profile` - User profile (placeholder)
- `/orders` - User order history (placeholder)
- `/cart` - Shopping cart (placeholder)

### Admin Routes (Require Admin Access)
- `/admin` - Admin dashboard with statistics
- `/admin/categories` - Manage product categories
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders (placeholder)

## Sample Data

The database has been populated with sample data:

### Categories
- Sofas
- Chairs
- Tables
- Beds
- Storage
- Decor

### Products
8 sample products including:
- Modern Velvet Sofa
- Classic Leather Sectional
- Dining Chair Set
- Executive Office Chair
- Rustic Dining Table
- Glass Coffee Table
- King Size Platform Bed
- Queen Storage Bed

Each product includes:
- Detailed descriptions
- Pricing
- Physical dimensions
- Materials
- Stock quantities
- Product images
- Available colors/finishes

## What's Next?

The foundation is complete! Here are the next features to implement:

### High Priority
1. **Product Detail Page**: Full product view with image gallery, color selector, and add-to-cart
2. **Shopping Cart**: Cart management with quantity updates and checkout button
3. **Checkout Flow**: Multi-step checkout with shipping address and payment
4. **Stripe Integration**: Payment processing
5. **Order Management**: Complete order tracking for customers and admins

### Medium Priority
1. **Product Edit Form**: Full product creation/editing interface
2. **Category Browsing**: Browse products by category
3. **Product Search**: Search and filter functionality
4. **User Profile**: Edit profile information and manage addresses
5. **Image Upload**: Direct image upload to Supabase Storage

### Nice to Have
1. **Product Reviews**: Customer reviews and ratings
2. **Wishlist**: Save products for later
3. **Email Notifications**: Order confirmations and updates
4. **Inventory Alerts**: Low stock notifications
5. **Analytics**: Sales reports and insights

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Build Tool**: Vite
- **Icons**: Lucide React

## Security

- Row Level Security (RLS) enabled on all tables
- Admin-only access for product management
- User-specific access for orders and cart
- Secure authentication with Supabase
- Protected routes with authentication checks

## Notes

- The build is successful and the app is ready to run
- Sample images are from Pexels (free stock photos)
- All database migrations are applied
- Storage bucket for product images is configured
- The project follows React best practices and TypeScript strict mode
