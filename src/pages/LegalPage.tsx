import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ShieldCheck, FileText } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { t } = useLanguage();

  if (type === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#EF4444] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>YOUPPI INFO</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Politique de Confidentialité</h1>
          <p className="text-xs text-slate-500">Dernière mise à jour : Octobre 2026</p>
        </div>

        <section className="space-y-3 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">1. Collecte Minimale des Données</h2>
          <p>
            Chez YOUPPI INFO, nous respectons scrupuleusement la vie privée de nos visiteurs. Nous ne collectons aucune donnée personnelle à votre insu. Notre catalogue est accessible librement sans obligation de création de compte public.
          </p>
        </section>

        <section className="space-y-3 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">2. Utilisation de WhatsApp</h2>
          <p>
            Les commandes et demandes de renseignements s’effectuent directement via l’application WhatsApp. Lors d’une conversation avec notre équipe commerciale, vos coordonnées téléphoniques et nom ne sont utilisés qu’aux strictes fins du traitement de votre commande et du suivi de livraison par les transporteurs (Yalidine, Procolis).
          </p>
        </section>

        <section className="space-y-3 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">3. Cookies & Stockage Local</h2>
          <p>
            Notre application utilise le stockage local de votre navigateur (<code className="text-[#EF4444] font-mono bg-red-50 px-1.5 py-0.5 rounded">localStorage</code>) uniquement pour mémoriser votre préférence linguistique (Français, Arabe, Anglais) et garantir le fonctionnement de l’interface sans pisteurs publicitaires tiers.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <div className="border-b border-slate-200 pb-4 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#EF4444] font-semibold">
          <FileText className="w-4 h-4" />
          <span>YOUPPI INFO</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Conditions Générales de Vente & Garantie Matériel</h1>
        <p className="text-xs text-slate-500">Applicable pour l’ensemble des ventes conclues en Algérie</p>
      </div>

      <section className="space-y-3 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900">1. Nature des Produits & État</h2>
        <p>
          YOUPPI INFO commercialise des ordinateurs portables, ordinateurs de bureau et pièces détachées neufs, reconditionnés ou d’occasion. Chaque produit d’occasion est documenté avec son grade esthétique réel et ses spécifications vérifiées. Les photographies correspondent fidèlement au produit proposé.
        </p>
      </section>

      <section className="space-y-3 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900">2. Garantie de Test & Vérification</h2>
        <p>
          Sauf mention contraire explicite sur la fiche produit, les matériels reconditionnés et d’occasion bénéficient d’une <strong>garantie de test de 30 jours</strong> couvrant tout vice matériel ou défaillance interne non signalée. Les dégradations physiques dues aux chocs, liquides ou surtensions électriques ne sont pas couvertes.
        </p>
      </section>

      <section className="space-y-3 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900">3. Modalités de Livraison (58 Wilayas)</h2>
        <p>
          La livraison s’effectue par transporteur privé avec possibilité de paiement à la réception (contre-remboursement). Le client est expressément invité à vérifier l’intégrité du colis et la conformité du matériel avant de finaliser le règlement.
        </p>
      </section>
    </div>
  );
};
