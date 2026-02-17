-- 1. Tabel Profiles (Extends Supabase Auth User)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Tabel Products (Manajemen Aplikasi Premium)
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text,
  price numeric not null,
  stock_status text default 'in_stock' check (stock_status in ('in_stock', 'out_of_stock')),
  duration_days int default 30,
  is_popular boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Tabel Transactions (Integrasi Midtrans)
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id),
  order_id text unique not null, -- ID untuk Midtrans
  amount numeric not null,
  status text default 'pending' check (status in ('pending', 'success', 'failed', 'expired')),
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ENABLE ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table products enable row level security;
alter table transactions enable row level security;

-- POLICIES
-- Profiles: User hanya bisa lihat/edit data sendiri
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Products: Semua orang bisa lihat, hanya admin bisa modifikasi
create policy "Anyone can view products" on products for select using (true);

-- Transactions: User hanya bisa lihat transaksi milik sendiri
create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);

-- TRIGGER: Buat profil otomatis saat user Register di Supabase Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();