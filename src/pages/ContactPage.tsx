import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { storeService } from '../services/storeService';
import { openWhatsAppChat } from '../services/whatsappService';
import { 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock, 
  Truck, 
  Send,
  CheckCircle2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language, t } = useLanguage();
  const settings = storeService.getSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const address = language === 'ar' ? settings.addressAr : settings.address;
  const hours = language === 'ar' ? settings.openingHoursAr : settings.openingHours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    // Build personalized WhatsApp inquiry message from the form
    const customMsg = `Bonjour YOUPPI INFO, je m’appelle ${formData.name} (${formData.phone || 'Non renseigné'}).\nSujet: ${formData.subject || 'Renseignement général'}\nMessage: ${formData.message}`;

    openWhatsAppChat({
      customMessage: customMsg,
      sourcePage: 'contact_form',
      lang: language,
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('contact.title')}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Col (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Coordonnées de l’Atelier</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0075FF] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">{t('contact.phone')}</span>
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-sm font-semibold text-slate-900 hover:text-[#0075FF]">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">{t('contact.whatsapp')}</span>
                  <button
                    onClick={() => openWhatsAppChat({ sourcePage: 'contact_info', lang: language })}
                    className="text-sm font-semibold text-slate-900 hover:text-emerald-600 text-start"
                  >
                    +213 (0) 555 12 34 56
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0075FF] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">{t('contact.location')}</span>
                  <span className="text-sm font-semibold text-slate-900 leading-snug block">
                    {address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0075FF] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">{t('contact.hours')}</span>
                  <span className="text-sm font-semibold text-slate-900 leading-snug block">
                    {hours}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Livraison Wilayas</span>
                  <span className="text-xs text-slate-600 leading-relaxed block">
                    {t('contact.wilayas')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openWhatsAppChat({ sourcePage: 'contact_direct_btn', lang: language })}
              className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('contact.openWhatsApp')}</span>
            </button>
          </div>
        </div>

        {/* Form Col (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Envoyez-nous un message</h2>
              <p className="text-xs text-slate-500 mt-1">{t('contact.directChatDesc')}</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50/50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Conversation WhatsApp lancée !</h4>
                <p className="text-xs text-slate-600">
                  Votre message a été mis en forme et la discussion WhatsApp s’est ouverte. Si ce n'est pas le cas, cliquez sur le bouton ci-dessous.
                </p>
                <button
                  onClick={() => openWhatsAppChat({ sourcePage: 'contact_resend', lang: language })}
                  className="px-4 py-2 bg-gradient-to-r from-[#0075FF] to-[#0060DF] text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Ouvrir à nouveau
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Votre Nom / Prénom *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Mohamed B."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0075FF]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: 0550 12 34 56"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0075FF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Modèle concerné ou Objet</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ex: Question sur le ThinkPad T14 ou PC Gamer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0075FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Votre message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Précisez votre demande, budget ou ville de livraison..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0075FF]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer la demande sur WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
