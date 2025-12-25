# TheSedder - eBook & Course Selling Platform

## Overview
TheSedder is a production-ready website for selling eBooks and video courses. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and designed to integrate with Supabase (Auth, Database, Storage).

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth/Database:** Supabase (to be configured)
- **Payments:** Manual verification via bKash/Nagad/Rocket Send Money

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
│   ├── checkout/          # Dynamic checkout with payment methods
│   ├── admin/             # Admin panel for payment verification
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
NEXT_PUBLIC_APP_URL=your-app-url
```

## Payment Integration (Dynamic - Supabase Managed)

### IMPORTANT: No Hardcoded Payment Numbers
All payment settings are stored in Supabase `payment_settings` table. Admin can update payment numbers directly in Supabase without code changes.

### payment_settings Table Schema
```sql
CREATE TABLE payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_name TEXT NOT NULL CHECK (method_name IN ('bkash', 'nagad', 'rocket')),
  display_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  required_reference TEXT NOT NULL DEFAULT 'E-book',
  instructions TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example: Insert bKash payment method
INSERT INTO payment_settings (method_name, display_name, account_number, required_reference, is_enabled, display_order)
VALUES ('bkash', 'bKash', '01XXXXXXXXX', 'E-book', true, 1);

-- Example: Insert Nagad payment method
INSERT INTO payment_settings (method_name, display_name, account_number, required_reference, is_enabled, display_order)
VALUES ('nagad', 'Nagad', '01XXXXXXXXX', 'E-book', true, 2);

-- Example: Insert Rocket payment method
INSERT INTO payment_settings (method_name, display_name, account_number, required_reference, is_enabled, display_order)
VALUES ('rocket', 'Rocket', '01XXXXXXXXX', 'E-book', false, 3);
```

### orders Table Schema
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  product_id TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  status TEXT NOT NULL CHECK (status IN ('pending_verification', 'paid', 'rejected', 'cancelled')),
  payment_method TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  sender_number TEXT NOT NULL,
  reference TEXT NOT NULL,
  trxid TEXT NOT NULL UNIQUE,
  rejection_reason TEXT,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Payment Flow
1. Customer selects product and goes to checkout
2. Checkout page fetches enabled payment methods from `payment_settings` table
3. Customer selects payment method (bKash/Nagad/Rocket)
4. Customer sends money to the displayed account number
5. Customer submits payment details (sender number, reference, TrxID)
6. Order is created with status `pending_verification`
7. Admin verifies payment at `/admin` and approves/rejects
8. Upon approval, user gets access to purchased content

### Features
- Multiple payment methods (bKash, Nagad, Rocket)
- Enable/disable toggle per method
- Configurable reference requirement per method
- Custom instructions per method
- Display order control
- Currency: BDT only
- No refunds policy

## Recent Changes (Dec 25, 2024)
- Removed all hardcoded payment numbers
- Implemented dynamic payment settings from Supabase
- Support for multiple payment methods (bKash, Nagad, Rocket)
- Dynamic reference validation per payment method
- Updated checkout page to load payment methods from API
- Updated admin panel to show payment method per order
- Logo made 3x bigger in header

## Admin Panel
- URL: `/admin`
- Features: View pending payments, approve/reject orders, filter by status
