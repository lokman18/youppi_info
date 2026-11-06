import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { storeService } from '../../services/storeService';
import { AdminLayout } from './AdminLayout';
import { MessageCircle, Info } from 'lucide-react';

export const AdminInquiriesPage: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const inquiries = storeService.getInquiries();

  return (
    <AdminLayout activeTab="inquiries">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#25D366] mb-1 flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            Leads & Conversions
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('admin.inquiries')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Historique des clics WhatsApp émis par les visiteurs sur les fiches produits et la vitrine
          </p>
        </div>

        {/* Info Notice */}
        <div className="p-4 bg-blue-50/80 border border-blue-200/70 rounded-2xl text-xs text-slate-700 flex items-start gap-3 shadow-sm">
          <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Info className="w-3.5 h-3.5 text-[#0075FF]" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block mb-0.5">Note de transparence :</span>
            <p className="text-slate-600 leading-relaxed">
              Ces enregistrements indiquent le moment où un client potentiel a cliqué sur le bouton WhatsApp pour initier une discussion.
              Le clic ouvre l'application WhatsApp du client avec le message pré-rempli.
            </p>
          </div>
        </div>

        {/* Stat Badge */}
        {inquiries.length > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-green-50 border border-green-200/80 rounded-xl text-xs font-semibold text-green-800">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>{inquiries.length} demandes WhatsApp enregistrées</span>
          </div>
        )}

        {/* Inquiries Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="px-5 py-3.5 text-start font-bold">Date & Heure</th>
                  <th className="px-5 py-3.5 text-start font-bold">Produit demandé</th>
                  <th className="px-5 py-3.5 text-start font-bold">Réf SKU</th>
                  <th className="px-5 py-3.5 text-start font-bold">Prix affiché</th>
                  <th className="px-5 py-3.5 text-start font-bold">Provenance (Page)</th>
                  <th className="px-5 py-3.5 text-end font-bold">Langue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inquiries.length > 0 ? (
                  inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-green-50/20 transition-colors group">
                      <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-xs truncate group-hover:text-[#25D366] transition-colors">
                        {inq.productName}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-600">
                        {inq.productSku}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-[#0075FF] tabular-nums">
                        {formatPrice(inq.priceDzd)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-slate-500 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-lg">
                          {inq.sourcePage}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-end">
                        <span className="uppercase text-[10px] font-mono px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold">
                          {inq.language}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
                          <MessageCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                          Aucune demande WhatsApp enregistrée pour l'instant.
                        </p>
                        <p className="text-xs text-slate-400">
                          Les clics des visiteurs sur vos produits apparaîtront ici.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
