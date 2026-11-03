-- ─────────────────────────────────────────────
-- Multi Business Style — Supabase Schema
-- ─────────────────────────────────────────────

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Categories
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  gender text check (gender in ('men', 'women', 'kids', 'unisex')),
  image text,
  display_order int default 0,
  created_at timestamptz default now()
);
alter table public.categories enable row level security;
create policy "Anyone can view categories" on public.categories for select using (true);
create policy "Admins can manage categories" on public.categories
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Products
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  images text[] default '{}',
  category_id uuid references public.categories(id) on delete set null,
  gender text not null check (gender in ('men', 'women', 'kids', 'unisex')),
  sizes text[] default '{}',
  colors text[] default '{}',
  stock int not null default 0,
  featured boolean default false,
  active boolean default true,
  created_at timestamptz default now()
);
alter table public.products enable row level security;
create policy "Anyone can view active products" on public.products
  for select using (active = true);
create policy "Admins can manage products" on public.products
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index products_category_id_idx on public.products(category_id);
create index products_gender_idx on public.products(gender);
create index products_featured_idx on public.products(featured);
create index products_slug_idx on public.products(slug);

-- Delivery rates
create table public.delivery_rates (
  id uuid default gen_random_uuid() primary key,
  province text not null unique,
  rate numeric(10,2) not null,
  free_above numeric(10,2),
  is_johannesburg boolean default false
);
alter table public.delivery_rates enable row level security;
create policy "Anyone can view delivery rates" on public.delivery_rates for select using (true);
create policy "Admins can manage delivery rates" on public.delivery_rates
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed default delivery rates
insert into public.delivery_rates (province, rate, free_above, is_johannesburg) values
  ('Johannesburg (own delivery)', 60, 1000, true),
  ('Gauteng (other)', 80, 1000, false),
  ('Western Cape', 130, 1200, false),
  ('KwaZulu-Natal', 110, 1200, false),
  ('Eastern Cape', 120, 1200, false),
  ('Free State', 100, 1000, false),
  ('Limpopo', 130, 1200, false),
  ('Mpumalanga', 120, 1200, false),
  ('North West', 110, 1200, false),
  ('Northern Cape', 150, 1500, false);

-- Orders
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null default 'MBS-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  customer_id uuid references public.profiles(id) on delete set null,
  guest_email text,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) not null,
  total numeric(10,2) not null,
  province text not null,
  suburb text not null,
  shipping_address jsonb not null,
  status text not null default 'pending' check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  payfast_payment_id text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.orders enable row level security;

create policy "Customers can view own orders" on public.orders
  for select using (auth.uid() = customer_id);
create policy "Admins can view all orders" on public.orders
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admins can update orders" on public.orders
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Anyone can insert orders" on public.orders
  for insert with check (true);

create index orders_customer_id_idx on public.orders(customer_id);
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);

-- Seed categories
insert into public.categories (name, slug, gender, display_order) values
  ('Men', 'men', 'men', 1),
  ('Women', 'women', 'women', 2),
  ('Kids', 'kids', 'kids', 3),
  ('Accessories', 'accessories', 'unisex', 4);
