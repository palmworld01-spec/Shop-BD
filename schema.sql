-- Supabase SQL Editor এ এই schema রান করুন
create extension if not exists "uuid-ossp";

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  price numeric not null,
  compare_at_price numeric,
  image_url text not null,
  images jsonb default '[]'::jsonb,
  description text not null,
  long_description text,
  category text,
  brand text,
  sku text,
  stock integer not null default 0,
  features jsonb default '[]'::jsonb,
  specs jsonb default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  phone text not null,
  address text not null,
  payment_method text not null,
  sender_number text,
  trx_id text,
  paid_amount numeric default 0,
  note text,
  status text not null default 'pending_payment_verification',
  items jsonb not null,
  total numeric not null,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Allow read products" on public.products;
drop policy if exists "Allow insert products" on public.products;
drop policy if exists "Allow update products" on public.products;
drop policy if exists "Allow delete products" on public.products;
drop policy if exists "Allow insert orders" on public.orders;
drop policy if exists "Allow read orders" on public.orders;
drop policy if exists "Allow update orders" on public.orders;

-- MVP/demo mode policies. Production এ service role + strict RLS ব্যবহার করুন।
create policy "Allow read products" on public.products for select using (true);
create policy "Allow insert products" on public.products for insert with check (true);
create policy "Allow update products" on public.products for update using (true);
create policy "Allow delete products" on public.products for delete using (true);

create policy "Allow insert orders" on public.orders for insert with check (true);
create policy "Allow read orders" on public.orders for select using (true);
create policy "Allow update orders" on public.orders for update using (true);

insert into public.products (slug, name, price, compare_at_price, image_url, images, description, long_description, category, brand, sku, stock, features, specs, is_active)
values
('premium-cotton-tshirt', 'Premium Cotton T-Shirt', 650, 850, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&auto=format&fit=crop', '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&auto=format&fit=crop"]', 'Soft cotton everyday T-shirt.', 'Premium breathable cotton fabric দিয়ে তৈরি comfortable everyday T-shirt. Regular fit, smooth stitching এবং daily use-এর জন্য perfect.', 'Clothing', 'ShopBD', 'TSHIRT-001', 25, '["100% soft cotton feel","Comfortable regular fit","Machine washable","Daily wear friendly"]', '{"Material":"Cotton","Fit":"Regular","Origin":"Bangladesh","Warranty":"7 days replacement"}', true),
('classic-sneakers', 'Classic Sneakers', 1850, 2200, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop"]', 'Comfortable casual sneakers.', 'Lightweight casual sneakers, walking এবং everyday outfit-এর সাথে use করার জন্য suitable. Grip sole এবং padded inner comfort রয়েছে.', 'Footwear', 'ShopBD', 'SHOE-002', 12, '["Lightweight design","Comfortable inner padding","Durable outsole","Casual streetwear look"]', '{"Upper":"Synthetic","Sole":"Rubber","Closure":"Lace-up","Warranty":"7 days replacement"}', true),
('smart-backpack', 'Smart Backpack', 1250, 1500, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&auto=format&fit=crop', '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&auto=format&fit=crop","https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1200&auto=format&fit=crop"]', 'Durable backpack for daily use.', 'Office, school, travel এবং daily use-এর জন্য durable backpack. Multiple compartments, laptop space এবং comfortable shoulder straps রয়েছে.', 'Bags', 'ShopBD', 'BAG-003', 18, '["Laptop compartment","Multiple pockets","Comfortable straps","Travel friendly"]', '{"Capacity":"22L","Material":"Polyester","Laptop":"Up to 15 inch","Warranty":"7 days replacement"}', true)
on conflict (slug) do nothing;
