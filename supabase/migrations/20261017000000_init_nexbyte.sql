-- ==============================================================================
-- NEXBYTE DZ: Complete Production PostgreSQL Schema & Row Level Security (RLS)
-- Target Platform: Supabase PostgreSQL
-- Store: NEXBYTE DZ (Computer Store Algeria)
-- ==============================================================================

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'inventory_manager', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name_fr TEXT NOT NULL,
    name_ar TEXT,
    name_en TEXT,
    description_fr TEXT,
    description_ar TEXT,
    description_en TEXT,
    icon_name TEXT DEFAULT 'Laptop',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BRANDS
CREATE TABLE IF NOT EXISTS public.brands (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    brand TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    name_ar TEXT,
    condition TEXT NOT NULL CHECK (condition IN ('used', 'refurbished', 'new')),
    price_dzd NUMERIC NOT NULL CHECK (price_dzd >= 0),
    original_price_dzd NUMERIC,
    purchase_cost_dzd NUMERIC, -- Confidential field, strictly protected by RLS
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT DEFAULT 2 CHECK (low_stock_threshold >= 0),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    description TEXT,
    description_ar TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_offer BOOLEAN DEFAULT false,
    internal_notes TEXT, -- Confidential field, strictly protected by RLS
    is_demo BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVENTORY MOVEMENTS (AUDIT LOG)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('stock_in', 'stock_out', 'sale', 'reservation', 'adjustment', 'return')),
    quantity_delta INT NOT NULL,
    resulting_quantity INT NOT NULL CHECK (resulting_quantity >= 0),
    reason TEXT NOT NULL,
    reference TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_settings',
    store_name TEXT NOT NULL DEFAULT 'NEXBYTE DZ',
    phone TEXT NOT NULL DEFAULT '0555 12 34 56',
    whatsapp_number TEXT NOT NULL DEFAULT '213555123456',
    default_language TEXT NOT NULL DEFAULT 'fr',
    currency TEXT NOT NULL DEFAULT 'DZD',
    address TEXT NOT NULL,
    address_ar TEXT,
    opening_hours TEXT NOT NULL,
    opening_hours_ar TEXT,
    announcement_text TEXT,
    announcement_text_ar TEXT,
    is_announcement_enabled BOOLEAN DEFAULT true,
    low_stock_threshold_default INT DEFAULT 2,
    enable_inquiry_tracking BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. WHATSAPP INQUIRY EVENTS (ANALYTICS)
CREATE TABLE IF NOT EXISTS public.inquiry_events (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    price_dzd NUMERIC NOT NULL,
    source_page TEXT NOT NULL,
    language TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_events ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'inventory_manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PUBLIC READ POLICIES
CREATE POLICY "Public read active categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Public read available products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (status != 'deleted');

CREATE POLICY "Public read settings"
    ON public.store_settings FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public insert inquiry events"
    ON public.inquiry_events FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- ADMIN FULL ACCESS POLICIES
CREATE POLICY "Admin manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin view inventory movements"
    ON public.inventory_movements FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage store settings"
    ON public.store_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admin view inquiry events"
    ON public.inquiry_events FOR SELECT
    TO authenticated
    USING (public.is_admin());
