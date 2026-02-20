-- ==========================================
-- 1. RESET (Hapus tabel & trigger lama agar bersih)
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==========================================
-- 2. TABEL PROFILES
-- ==========================================
CREATE TABLE profiles (
id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
full_name TEXT,
phone TEXT,
avatar_url TEXT,
role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 3. TABEL PRODUCTS (Tanpa image_url)
-- ==========================================
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
sold_count INT DEFAULT 0,
created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 4. TABEL CART_ITEMS
-- ==========================================
CREATE TABLE cart_items (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
product_id UUID REFERENCES products(id) ON DELETE CASCADE,
quantity INT DEFAULT 1,
created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 5. TABEL TRANSACTIONS
-- (PENTING: order_id TIDAK LAGI UNIQUE agar bisa simpan banyak barang di 1 Order)
-- ==========================================
CREATE TABLE transactions (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
product_id UUID REFERENCES products(id) ON DELETE SET NULL,
order_id TEXT NOT NULL,
amount NUMERIC NOT NULL,
status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired')),
payment_method TEXT,
snap_token TEXT,
account_credentials TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 6. AKTIFKAN RLS (Row Level Security)
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 7. POLICIES (Aturan Akses Keamanan)
-- ==========================================
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Cart Items
CREATE POLICY "Users can manage their own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can update all transactions" ON transactions FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- ==========================================
-- 8. TRIGGER OTOMATIS (Sync Auth -> Profiles)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $function$
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
$function$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
