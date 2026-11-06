import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useRouter, Link } from '../../router/Router';
import { storeService } from '../../services/storeService';
import { AdminLayout } from './AdminLayout';
import { Product, ProductCategory, ProductCondition, AvailabilityStatus } from '../../types';
import { compressImageFile, compressDataUrl, formatFileSize } from '../../utils/imageCompressor';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Star, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Layers,
  Loader2,
  Sparkles
} from 'lucide-react';

interface AdminProductFormPageProps {
  productId?: string;
}

export const AdminProductFormPage: React.FC<AdminProductFormPageProps> = ({ productId }) => {
  const { language, t } = useLanguage();
  const { navigate } = useRouter();

  const isEdit = Boolean(productId);
  const categories = storeService.getCategories();

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    sku: '',
    slug: '',
    name: '',
    nameAr: '',
    brand: 'Lenovo',
    category: 'business-laptops',
    condition: 'refurbished',
    priceDzd: 65000,
    originalPriceDzd: 0,
    purchaseCostDzd: 45000,
    stockQuantity: 1,
    lowStockThreshold: 1,
    status: 'available',
    description: '',
    descriptionAr: '',
    specifications: {
      cpu: '',
      ram: '',
      storage: '',
      gpu: '',
      screen: '',
      batteryHealth: '',
      keyboardLayout: 'AZERTY Français',
      chargerIncluded: true,
      cosmeticCondition: 'grade-a',
      knownDefects: '',
      warrantyPeriod: 'Garantie test 30 jours',
    },
    images: [],
    isFeatured: false,
    isOffer: false,
    internalNotes: '',
    publishedAt: new Date().toISOString(),
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressNotice, setCompressNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (productId) {
      const existing = storeService.getProductById(productId, true);
      if (existing) {
        setFormData({
          sku: existing.sku,
          slug: existing.slug,
          name: existing.name,
          nameAr: existing.nameAr || '',
          brand: existing.brand,
          category: existing.category,
          condition: existing.condition,
          priceDzd: existing.priceDzd,
          originalPriceDzd: existing.originalPriceDzd || 0,
          purchaseCostDzd: existing.purchaseCostDzd || 0,
          stockQuantity: existing.stockQuantity,
          lowStockThreshold: existing.lowStockThreshold,
          status: existing.status,
          description: existing.description,
          descriptionAr: existing.descriptionAr || '',
          specifications: { ...existing.specifications },
          images: existing.images ? [...existing.images] : [],
          isFeatured: Boolean(existing.isFeatured),
          isOffer: Boolean(existing.isOffer),
          internalNotes: existing.internalNotes || '',
          publishedAt: existing.publishedAt || new Date().toISOString(),
        });
      }
    }
  }, [productId]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: isEdit ? prev.slug : generateSlug(val),
    }));
  };

  const handleAddImage = async (urlToAdd: string) => {
    if (!urlToAdd.trim()) return;
    let finalUrl = urlToAdd.trim();

    // If a large base64 data URL was pasted, compress it
    if (finalUrl.startsWith('data:image/') && finalUrl.length > 70000) {
      setIsCompressing(true);
      try {
        finalUrl = await compressDataUrl(finalUrl, { maxWidth: 1200, maxHeight: 1200, quality: 0.78 });
      } catch {
        // Fallback to original
      } finally {
        setIsCompressing(false);
      }
    }

    const isFirst = formData.images.length === 0;
    const newImg = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      url: finalUrl,
      altText: formData.name,
      isPrimary: isFirst,
      sortOrder: formData.images.length,
    };
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImg],
    }));
    setNewImageUrl('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setCompressNotice('Optimisation & réduction des photos en cours...');
    setError('');

    try {
      const newImgs: Array<{ id: string; url: string; altText: string; isPrimary: boolean; sortOrder: number }> = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Compresses high-res camera photos from ~5MB down to ~60-90KB
        const result = await compressImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.78 });
        const isFirst = formData.images.length === 0 && newImgs.length === 0;
        newImgs.push({
          id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          url: result.dataUrl,
          altText: formData.name || file.name,
          isPrimary: isFirst,
          sortOrder: formData.images.length + newImgs.length,
        });
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImgs],
      }));

      const singleSize = newImgs[0] ? formatFileSize(Math.round((newImgs[0].url.length * 3) / 4)) : '';
      setCompressNotice(
        files.length === 1
          ? `Photo optimisée avec succès (${singleSize}) — Prête pour le catalogue sans saturation de stockage.`
          : `${files.length} photos importées et optimisées avec succès.`
      );
      setTimeout(() => setCompressNotice(null), 5000);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'optimisation de la photo.");
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleSetPrimaryImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === id,
      })),
    }));
  };

  const handleRemoveImage = (id: string) => {
    setFormData(prev => {
      const remaining = prev.images.filter(img => img.id !== id);
      if (remaining.length > 0 && !remaining.some(i => i.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return { ...prev, images: remaining };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Le titre du produit est obligatoire.');
      return;
    }
    if (!formData.sku.trim()) {
      setError('Le SKU est obligatoire.');
      return;
    }
    if (!formData.priceDzd || formData.priceDzd <= 0) {
      setError('Le prix de vente doit être supérieur à 0 DZD.');
      return;
    }

    setIsSaving(true);
    try {
      if (isEdit && productId) {
        storeService.updateProduct(productId, formData);
      } else {
        storeService.createProduct(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/products');
      }, 700);
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err?.message || 'Erreur lors de la sauvegarde du produit.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout activeTab="products">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Link & Title */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {isEdit ? t('admin.editProduct') : t('admin.addProduct')}
              </h1>
              <span className="text-xs text-slate-500">
                {isEdit ? `ID: ${productId}` : 'Nouvel arrivage matériel'}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{t('admin.productSaved')} Redirection en cours...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Section 1: General Info */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#EF4444]" />
              <span>Informations Générales</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-slate-700">Titre commercial (Français) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Lenovo ThinkPad T14 Gen 2 (Core i7 / 16GB / 512GB)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-slate-700">Titre en Arabe (Optionnel pour affichage RTL)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.nameAr || ''}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: لينوفو ثينك باد T14 الجيل الثاني (Core i7 / 16GB)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">SKU / Réf interne *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Ex: NB-LPT-005"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Slug URL *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ex: lenovo-thinkpad-t14-gen-2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Marque / Fabricant *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Lenovo, Dell, HP, ASUS, NVIDIA..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#EF4444]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameFr}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">État du matériel *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as ProductCondition })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#EF4444]"
                >
                  <option value="used">Occasion (Testé)</option>
                  <option value="refurbished">Reconditionné d'usine</option>
                  <option value="new">Neuf (Boîte scellée)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Statut de disponibilité *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AvailabilityStatus })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#EF4444]"
                >
                  <option value="available">Disponible à la vente</option>
                  <option value="reserved">Réservé par un client</option>
                  <option value="sold">Vendu / Épuisé</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Description détaillée</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Historique de la machine, points forts, utilisation recommandée..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EF4444]"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Tarification & Stock
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Prix de vente public (DZD) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  value={formData.priceDzd}
                  onChange={(e) => setFormData({ ...formData, priceDzd: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Ancien prix barré (Optionnel DZD)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={formData.originalPriceDzd || 0}
                  onChange={(e) => setFormData({ ...formData, originalPriceDzd: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-amber-700">Prix d’achat / Coût (Secret Admin)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={formData.purchaseCostDzd || 0}
                  onChange={(e) => setFormData({ ...formData, purchaseCostDzd: Number(e.target.value) })}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 block">Jamais exposé aux clients publics</span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Quantité en stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Seuil alerte stock bas</label>
                <input
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-2 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-[#EF4444]"
                  />
                  <span>Mettre en avant sur la page d'accueil</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isOffer}
                    onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
                    className="rounded text-[#EF4444]"
                  />
                  <span>Afficher dans les Offres Spéciales</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Specifications */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#EF4444]" />
              <span>Fiche Technique & Spécifications</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Processeur (CPU)</label>
                <input
                  type="text"
                  value={formData.specifications.cpu || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, cpu: e.target.value }
                  })}
                  placeholder="Ex: Intel Core i7-1165G7 (4 Cores, 4.7 GHz)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Mémoire Vive (RAM)</label>
                <input
                  type="text"
                  value={formData.specifications.ram || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, ram: e.target.value }
                  })}
                  placeholder="Ex: 16 Go DDR4 3200MHz"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Stockage (SSD / NVMe)</label>
                <input
                  type="text"
                  value={formData.specifications.storage || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, storage: e.target.value }
                  })}
                  placeholder="Ex: 512 Go SSD M.2 NVMe PCIe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Carte Graphique (GPU)</label>
                <input
                  type="text"
                  value={formData.specifications.gpu || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, gpu: e.target.value }
                  })}
                  placeholder="Ex: NVIDIA RTX 4070 12GB ou Intel Iris Xe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Écran & Résolution</label>
                <input
                  type="text"
                  value={formData.specifications.screen || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, screen: e.target.value }
                  })}
                  placeholder="Ex: 14.0 FHD IPS 300 nits Antireflet"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Santé Batterie (Laptops)</label>
                <input
                  type="text"
                  value={formData.specifications.batteryHealth || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, batteryHealth: e.target.value }
                  })}
                  placeholder="Ex: 92% (Autonomie testée : ~5h30)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Clavier</label>
                <input
                  type="text"
                  value={formData.specifications.keyboardLayout || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, keyboardLayout: e.target.value }
                  })}
                  placeholder="Ex: AZERTY Français rétroéclairé"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Garantie</label>
                <input
                  type="text"
                  value={formData.specifications.warrantyPeriod || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, warrantyPeriod: e.target.value }
                  })}
                  placeholder="Ex: Garantie test atelier 30 jours"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#EF4444]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-slate-700">Défauts esthétiques ou remarques</label>
                <input
                  type="text"
                  value={formData.specifications.knownDefects || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, knownDefects: e.target.value }
                  })}
                  placeholder="Ex: Légères micro-rayures sur le capot supérieur, écran 100% propre"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#EF4444]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Images */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {t('admin.images')}
              </h2>
              <span className="text-xs text-slate-500">
                Format optimisé automatique (pas de limite de stockage)
              </span>
            </div>

            {/* Compression active alert */}
            {isCompressing && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-[#EF4444] flex items-center gap-2 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span className="font-semibold">Optimisation et compression de l'image en cours... (Réduction automatique pour éviter la saturation du stockage)</span>
              </div>
            )}

            {/* Compression notice */}
            {compressNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{compressNotice}</span>
              </div>
            )}

            {/* Existing images list */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group shadow-xs"
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(img.id)}
                        className={`p-1.5 rounded ${img.isPrimary ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                        title="Définir comme image principale"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {img.isPrimary && (
                      <span className="absolute top-1.5 left-1.5 bg-[#DC2626] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">Aucune image enregistrée pour ce produit.</p>
            )}

            {/* Add Image Inputs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Coller l'URL d'une image..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#DC2626]"
                />
                <button
                  type="button"
                  disabled={isCompressing}
                  onClick={() => handleAddImage(newImageUrl)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold border border-slate-200 disabled:opacity-50"
                >
                  Ajouter URL
                </button>
              </div>

              <label className={`px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-2xs ${isCompressing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {isCompressing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#DC2626]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#DC2626]" />
                )}
                <span>{isCompressing ? 'Optimisation...' : 'Importer photos'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isCompressing}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Section 5: Internal Notes (Private) */}
          <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
            <h2 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
              Notes Internes & Traçabilité (Confidentiel)
            </h2>
            <textarea
              rows={2}
              value={formData.internalNotes || ''}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              placeholder="Numéro de série usine, date de repaste thermique, nom du fournisseur..."
              className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold border border-slate-200"
            >
              {t('admin.cancel')}
            </Link>
            <button
              type="submit"
              disabled={isSaving || isCompressing}
              className="px-6 py-2.5 bg-[#DC2626] hover:bg-[#DC2626] disabled:opacity-50 text-white font-bold rounded-lg shadow-md shadow-[#DC2626]/25 flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('admin.save')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
