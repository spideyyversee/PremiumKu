-- 1. RESET (Hapus tabel lama agar bersih)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS profiles;

-- 2. TABEL PROFILES (Menyimpan data user & admin)
CREATE TABLE profiles (
id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
full_name TEXT,
phone TEXT,
avatar_url TEXT,
role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABEL PRODUCTS (Katalog Aplikasi)
CREATE TABLE products (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
name TEXT NOT NULL,
description TEXT,
category TEXT,
price NUMERIC NOT NULL,
original_price NUMERIC,
stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock')),
duration TEXT DEFAULT '30 Hari',
is_popular BOOLEAN DEFAULT false,
image_url TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. TABEL TRANSACTIONS (Riwayat Pembelian)
CREATE TABLE transactions (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
product_id UUID REFERENCES products(id),
order_id TEXT UNIQUE NOT NULL, -- ID Order Midtrans
amount NUMERIC NOT NULL,
status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired')),
payment_method TEXT,
snap_token TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. AKTIFKAN SECURITY (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 6. KEBIJAKAN AKSES (Policies)

-- Profiles: Semua orang bisa lihat profil (untuk review dll), tapi edit punya sendiri
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Semua bisa lihat, Admin yang bisa edit
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Transactions: User lihat punya sendiri, Admin lihat semua
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- 7. TRIGGER OTOMATIS (New User -> Profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.profiles (id, full_name, phone, role)
VALUES (
new.id,
new.raw_user_meta_data->>'full_name',
new.raw_user_meta_data->>'phone',
COALESCE(new.raw_user_meta_data->>'role', 'user')
);
RETURN new;
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
$$
