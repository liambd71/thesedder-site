# TheSedder - eBook & Course Selling Platform

## Overview
TheSedder is a production-ready website for selling eBooks and video courses. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and designed to integrate with Supabase (Auth, Database, Storage) and Stripe for payments.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth/Database:** Supabase (to be configured)
- **Payments:** Stripe (to be configured)

## Project Structure
```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── shop/              # Shop/catalog page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── library/           # User library (purchased content)
│   ├── terms/             # Terms of service
│   ├── privacy/           # Privacy policy
│   └── refund/            # Refund policy
├── components/
│   ├── ui/                # Shadcn-style UI components
│   ├── layout/            # Header, Footer
│   └── products/          # Product cards
├── lib/
│   ├── supabase/          # Supabase client (client, server, middleware)
│   └── utils.ts           # Utility functions
├── types/
│   └── database.ts        # TypeScript types for database
└── middleware.ts          # Auth middleware
```

## Running the App
```bash
npx next dev -p 5000
```

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SSLCOMMERZ_STORE_ID=your-sslcommerz-store-id
SSLCOMMERZ_STORE_PASSWORD=your-sslcommerz-store-password
SSLCOMMERZ_IS_LIVE=false
NEXT_PUBLIC_APP_URL=your-app-url
```

## Payment Integration (SSLCOMMERZ - Bangladesh Only)
- Payment gateway: SSLCOMMERZ (primary)
- Supported methods: VISA/Mastercard, bKash, Nagad, Rocket, and 30+ banks
- Currency: BDT only
- No refunds policy
- Modular architecture allows adding more BD gateways (bKash direct, Nagad direct, etc.)

## Recent Changes (Dec 24, 2024)
- Initial project setup with Next.js 14
- Created all public pages (Home, Shop, About, Contact)
- Created auth pages (Login, Signup)
- Created user library page
- Created legal pages (Terms, Privacy, Refund)
- Set up Supabase client utilities
- Created UI components (Button, Card, Input, Label, Badge)
- Created product card component

## Next Steps
1. Configure Supabase project and environment variables
2. Set up Stripe API keys for payments
3. Create database tables in Supabase
4. Implement product detail pages
5. Implement checkout flow
6. Build admin panel
