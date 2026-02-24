-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.cart_items (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid,
product_id uuid,
quantity integer DEFAULT 1,
created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
CONSTRAINT cart_items_pkey PRIMARY KEY (id),
CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.products (
id uuid NOT NULL DEFAULT gen_random_uuid(),
name text NOT NULL,
description text,
category text,
price numeric NOT NULL,
original_price numeric,
stock_status text DEFAULT 'in_stock'::text CHECK (stock_status = ANY (ARRAY['in_stock'::text, 'out_of_stock'::text])),
duration text DEFAULT '30 Hari'::text,
is_popular boolean DEFAULT false,
sold_count integer DEFAULT 0,
created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
id uuid NOT NULL,
full_name text,
phone text,
avatar_url text,
role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'admin'::text])),
created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
CONSTRAINT profiles_pkey PRIMARY KEY (id),
CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.transactions (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid,
product_id uuid,
order_id text NOT NULL,
amount numeric NOT NULL,
status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'success'::text, 'failed'::text, 'expired'::text])),
snap_token text,
account_credentials text,
created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
CONSTRAINT transactions_pkey PRIMARY KEY (id),
CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
CONSTRAINT transactions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
