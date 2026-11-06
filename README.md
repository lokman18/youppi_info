# YOUPPI INFO — Premium Computer Store for Algeria

**YOUPPI INFO** is a production-grade, multilingual e-commerce web platform engineered specifically for the Algerian computer and technology hardware market. It specializes in pre-owned laptops, certified refurbished business workstations, custom gaming rigs, graphics cards, and essential tech accessories.

---

## 🌟 Key Features

### 1. Brand Identity & Visual Aesthetic
- **Visual Direction**: Premium dark tech aesthetic (`#07090D` background, `#10141C` elevated cards, `#1677FF` electric blue primary, `#32D5FF` cyan accent).
- **Geometric YI Monogram**: Distinctive brand identity and responsive typography with Plus Jakarta Sans & Tajawal (Arabic).
- **Zero-Pill Discipline & Anti-Slop**: Clean typography, unboxed text metadata with `·` separators, tabular figures for all DZD currency prices, no artificial countdowns.

### 2. WhatsApp-First Sales Funnel
- Direct WhatsApp integration with automatic normalization for Algerian numbers (`+213...`, dropping domestic leading 0).
- Localized pre-filled inquiry messages (French, Arabic RTL, English) containing exact Product Name, internal SKU, price in DZD, and permanent product URL.
- Privacy-conscious local inquiry logging for seller conversion auditing.
- Floating responsive WhatsApp contact button and instant quick-chat triggers on every product card.

### 3. Multilingual & Native RTL Support
- Complete interface localization in **French (Default)**, **Arabic (العربية with full RTL layout and typography)**, and **English**.
- Automatic document direction (`dir="rtl"` vs `dir="ltr"`) and persistent language preferences in `localStorage`.
- Proper number and model alignment so that technical specs (e.g., `Core i7-1165G7`, `16GB RAM`, `RTX 4070`) remain legible across both LTR and RTL views.

### 4. Advanced Product Catalog & Multi-Filtering
- Search by name, brand, SKU, processor model, GPU, or specifications.
- Combined filters: Category, Brand, Hardware Condition (*Used / Occasion*, *Refurbished / Reconditionné*, *New / Neuf*), Stock Status (*Available*, *Reserved*, *Sold*), and Price range in DZD.
- Sorting by Newest, Price (Ascending/Descending), and Featured items.
- Shareable URL parameters (`/products?category=...&condition=...`).
- Interactive Quick View modal for rapid hardware inspection.

### 5. Secure Admin Dashboard & Inventory Management
- **Dashboard Overview**: Metrics for Total Products, Available, Reserved, Sold, Low-stock alerts, Total inventory valuation in DZD, and recorded WhatsApp inquiries.
- **Product CRUD**: Add, edit, duplicate, delete products with multi-image gallery management, comprehensive technical specs, and confidentiality protections.
- **Private Cost Protection**: Purchase cost (`purchaseCostDzd`) and technician internal notes are strictly quarantined to authorized admin sessions and never leak into public customer views.
- **Inventory Audit Trail**: Stock-in, stock-out, sales, and client reservation movements recorded with quantity delta, reason, and author.
- **Store Settings**: Real-time management of store phone, official WhatsApp number, opening hours, announcement bar, and admin credentials.
- **JSON Backup & Restore**: One-click data backup and import.

---

## 🔐 Authentication & Roles

### 1. أمين المخزن (إدخال وإخراج السلعة فقط / Warehouse Stock Clerk)
- **Direct Terminal URL**: `/stock` (or `/admin/stock-clerk`)
- **Username**: `stock`
- **Password**: `nexbyte_stock2026`
- **Permissions**: Rapid Stock IN (`+`), Stock OUT (`-`), custom quantity movement recording, live inventory levels lookup, and movement history audit.
- **Restrictions**: Purchase costs (`purchaseCostDzd`), profit margins, store settings, product deletion, and financial records are strictly hidden.

### 2. المدير العام (Super Admin)
- **Dashboard URL**: `/admin`
- **Username**: `admin`
- **Password**: `nexbyte_dz_admin2026`
- **Permissions**: Complete access across financial valuation, product creation/editing/deletion, inventory audit, categories, inquiries, and store settings.

*Administrators can update passwords and manage permissions directly from `/admin/settings`.*

---

## 🗄️ Database Schema & Supabase Setup

The application features a complete PostgreSQL database schema with Row Level Security (RLS) located at:
`supabase/migrations/20261017000000_init_nexbyte.sql`

To deploy this backend to Supabase:
1. Open your Supabase project dashboard.
2. Go to the **SQL Editor**.
3. Paste the contents of `supabase/migrations/20261017000000_init_nexbyte.sql` and run.
4. The schema includes tables for `products`, `categories`, `brands`, `inventory_movements`, `inquiry_events`, and `store_settings`, protected with fine-grained RLS policies.

---

## 🚀 Local Development & Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript checks
npm run lint

# Compile production build
npm run build
```
