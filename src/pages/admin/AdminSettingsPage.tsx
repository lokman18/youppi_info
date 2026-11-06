import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { storeService } from '../../services/storeService';
import { authService } from '../../services/authService';
import { AdminLayout } from './AdminLayout';
import { StoreSettings } from '../../types';
import { 
  Settings, 
  Save, 
  Download, 
  Upload, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Database,
  Code,
  X,
  MessageCircle,
  MapPin,
  Clock
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [settings, setSettings] = useState<StoreSettings>(() => storeService.getSettings());

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // General feedback
  const [toastMsg, setToastMsg] = useState('');
  const [sqlModalOpen, setSqlModalOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storeService.updateSettings(settings);
    setToastMsg('Paramètres enregistrés avec succès !');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    const res = authService.updatePassword(oldPassword, newPassword);
    if (res.success) {
      setPwdMsg({ type: 'success', text: 'Mot de passe administrateur mis à jour avec succès.' });
      setOldPassword('');
      setNewPassword('');
    } else {
      setPwdMsg({ type: 'error', text: res.error || 'Erreur lors de la modification du mot de passe.' });
    }
  };

  const handleExportJson = () => {
    const jsonStr = storeService.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youppi-info-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const ok = storeService.importDatabaseJson(text);
        if (ok) {
          setSettings(storeService.getSettings());
          setToastMsg('Base de données restaurée avec succès !');
          setTimeout(() => setToastMsg(''), 3000);
        } else {
          alert('Fichier JSON invalide.');
        }
      };
      reader.readAsText(file);
    }
  };

  const supabaseSqlSchema = `-- YOUPPI INFO: Production Supabase PostgreSQL Schema & Security Rules (RLS)
-- Run this in your Supabase SQL Editor to provision the complete production backend

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name_fr TEXT NOT NULL,
    name_ar TEXT,
    name_en TEXT,
    description_fr TEXT,
    description_ar TEXT,
    description_en TEXT,
    icon_name TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    brand TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id),
    name TEXT NOT NULL,
    name_ar TEXT,
    condition TEXT NOT NULL CHECK (condition IN ('used', 'refurbished', 'new')),
    price_dzd NUMERIC NOT NULL CHECK (price_dzd >= 0),
    original_price_dzd NUMERIC,
    purchase_cost_dzd NUMERIC,
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT DEFAULT 2,
    status TEXT NOT NULL CHECK (status IN ('available', 'reserved', 'sold')),
    description TEXT,
    description_ar TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_offer BOOLEAN DEFAULT false,
    internal_notes TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Inventory Movements Audit Table
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    movement_type TEXT NOT NULL,
    quantity_delta INT NOT NULL,
    resulting_quantity INT NOT NULL,
    reason TEXT NOT NULL,
    reference TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create WhatsApp Inquiries Tracking Table
CREATE TABLE IF NOT EXISTS public.whatsapp_inquiries (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    price_dzd NUMERIC NOT NULL,
    source_page TEXT NOT NULL,
    language TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products
    FOR SELECT TO anon, authenticated
    USING (status != 'deleted');

CREATE POLICY "Admin full access products" ON public.products
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');
`;

  return (
    <AdminLayout activeTab="settings">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#0075FF] mb-1 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            Configuration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('admin.settings')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Numéro WhatsApp officiel, coordonnées du magasin et sauvegarde de la base de données
          </p>
        </div>

        {/* Success Toast */}
        {toastMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Main Store Form */}
        <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
          
          {/* WhatsApp & Contact */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Canal WhatsApp & Coordonnées Vendeur</h2>
                <p className="text-[11px] text-slate-500">Numéros de contact et informations du magasin</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Numéro WhatsApp (Format International sans +) *</label>
                <input
                  type="text"
                  required
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="213555123456"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <span className="text-[11px] text-slate-500 block">
                  Exemple : <code className="text-[#0075FF] font-bold">213555123456</code> (l'indicatif 213 remplace le 0 initial en Algérie).
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Téléphone affiché aux clients</label>
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="0555 12 34 56"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Adresse de l'Atelier / Point de retrait (Français)
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-700">Adresse en Arabe</label>
                <input
                  type="text"
                  dir="rtl"
                  value={settings.addressAr}
                  onChange={(e) => setSettings({ ...settings, addressAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Horaires d'ouverture (Français)
                </label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Horaires en Arabe</label>
                <input
                  type="text"
                  dir="rtl"
                  value={settings.openingHoursAr}
                  onChange={(e) => setSettings({ ...settings, openingHoursAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Announcement Bar Settings */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Bandeau d'Annonces Publicitaires (Haut de page)
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold text-xs">
                <input
                  type="checkbox"
                  checked={settings.isAnnouncementEnabled}
                  onChange={(e) => setSettings({ ...settings, isAnnouncementEnabled: e.target.checked })}
                  className="rounded text-[#0075FF] focus:ring-blue-500"
                />
                <span>Activer le bandeau</span>
              </label>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Message (Français)</label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Message (Arabe)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={settings.announcementTextAr}
                  onChange={(e) => setSettings({ ...settings, announcementTextAr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-cyan-400/30 transition-all flex items-center gap-2 hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>
        </form>

        {/* Admin Password Change Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5 text-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Sécurité & Modification du mot de passe</h2>
              <p className="text-[11px] text-slate-500">Administrateur principal</p>
            </div>
          </div>

          {pwdMsg && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              pwdMsg.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {pwdMsg.type === 'success' 
                ? <CheckCircle2 className="w-4 h-4 shrink-0" /> 
                : <AlertCircle className="w-4 h-4 shrink-0" />
              }
              <span>{pwdMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Ancien mot de passe</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Mot de passe actuel"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Nouveau mot de passe</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-sm transition-all text-xs"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>

        {/* Data Persistence, JSON Backup & Supabase Schema */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5 text-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <Database className="w-4 h-4 text-[#0075FF]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Sauvegarde & Migration Base de Données</h2>
              <p className="text-[11px] text-slate-500">PostgreSQL / Supabase Compatible</p>
            </div>
          </div>
          
          <p className="text-slate-600 leading-relaxed">
            Exportez l'intégralité de votre catalogue, inventaire et historiques sous forme de fichier JSON autonome ou récupérez le script SQL prêt à déployer sur Supabase.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportJson}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl font-bold flex items-center gap-2 border border-slate-200 shadow-sm transition-all hover:scale-105"
            >
              <Download className="w-4 h-4 text-[#0075FF]" />
              <span>Exporter sauvegarde JSON</span>
            </button>

            <label className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl font-bold flex items-center gap-2 border border-slate-200 shadow-sm transition-all hover:scale-105 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Restaurer depuis JSON</span>
              <input
                type="file"
                accept="application/json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setSqlModalOpen(true)}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#0075FF] rounded-xl font-bold flex items-center gap-2 border border-blue-200 shadow-sm transition-all hover:scale-105"
            >
              <Code className="w-4 h-4" />
              <span>Voir le schéma SQL Supabase (RLS)</span>
            </button>
          </div>
        </div>

        {/* Supabase SQL Modal */}
        {sqlModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Code className="w-3.5 h-3.5 text-[#0075FF]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Schéma SQL PostgreSQL pour Supabase (Migrations & RLS)</h3>
                </div>
                <button 
                  onClick={() => setSqlModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-[#0A1128] rounded-xl border border-cyan-500/15">
                <pre className="text-[11px] font-mono text-cyan-300 leading-relaxed whitespace-pre-wrap">
                  {supabaseSqlSchema}
                </pre>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSqlModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(supabaseSqlSchema);
                    alert('Script SQL copié dans le presse-papier !');
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all"
                >
                  Copier le code SQL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
