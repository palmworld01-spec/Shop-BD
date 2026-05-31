# Vercel + GitHub Complete E-commerce Starter

Manual bKash/Nagad/Rocket payment verification সহ Next.js e-commerce starter.

## Features

- Product listing homepage
- Product details page: image gallery, full details, features, specification, stock, SKU
- Product share option: Native share, Facebook, WhatsApp, Email, copy link fallback
- Add to cart with quantity
- Checkout form
- Cash on Delivery
- Manual bKash/Nagad/Rocket payment number display
- Customer sender number, TrxID, paid amount submission
- Supabase order save
- Admin panel with PIN
- Admin order approve/reject/shipped/delivered
- Admin product add/edit/delete
- Product active/hidden status
- Supabase SQL schema with demo products seed
- Ready for Vercel + GitHub deployment

## Setup

1. GitHub এ repo create করে এই files push করুন।
2. Supabase এ new project create করুন।
3. Supabase SQL Editor এ `sql/schema.sql` run করুন।
4. `.env.example` copy করে `.env.local` বানান।
5. values বসান:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PIN=123456
NEXT_PUBLIC_BKASH_NUMBER=01XXXXXXXXX
NEXT_PUBLIC_NAGAD_NUMBER=01XXXXXXXXX
NEXT_PUBLIC_ROCKET_NUMBER=01XXXXXXXXX
```

6. Local run:

```bash
npm install
npm run dev
```

7. Vercel এ deploy করার সময় একই environment variables বসাতে হবে।

## Admin panel

Go to:

```txt
/admin
```

Admin PIN দিন, তারপর Load Admin Data চাপুন।

Admin থেকে করা যাবে:

- Order দেখা
- Payment approve/reject
- Order shipped/delivered করা
- Product add করা
- Product edit করা
- Product delete করা
- Product active/hidden করা

## Manual payment flow

Customer checkout করবে → bKash/Nagad/Rocket number দেখবে → টাকা পাঠাবে → Sender number + TrxID দিবে → order status হবে `pending_payment_verification` → admin panel থেকে approve/reject করবে।

## Product details and share flow

Homepage থেকে product click করলে `/products/product-slug` page খুলবে। এখানে থাকবে:

- বড় product image
- gallery thumbnails
- price + old price
- stock
- full product details
- feature list
- specification table
- Add to Cart
- Facebook/WhatsApp/Email/Native Share button

## Important production security note

এই starter দ্রুত MVP launch করার জন্য। Real business production এর জন্য:

- Admin PIN এর বদলে proper login system ব্যবহার করুন
- Supabase service role key server-side only ব্যবহার করুন
- RLS policy আরও strict করুন
- Payment screenshot upload চাইলে Supabase Storage যোগ করুন
- Order email/Gmail notification যোগ করুন
- Courier API integration যোগ করুন
- Rate limit এবং form validation আরও শক্ত করুন
