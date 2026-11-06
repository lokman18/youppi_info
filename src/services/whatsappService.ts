import { Product, Language } from '../types';
import { storeService } from './storeService';

/**
 * Normalizes Algerian phone number to international format without plus or symbols.
 * Examples:
 * "0555 12 34 56" -> "213555123456"
 * "+213 555 12 34 56" -> "213555123456"
 * "213555123456" -> "213555123456"
 */
export function normalizeAlgerianPhone(phone: string): string {
  // Remove non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('213')) {
    return cleaned;
  }

  if (cleaned.startsWith('0')) {
    // Drop the domestic leading 0 and prepend Algerian country code 213
    return '213' + cleaned.substring(1);
  }

  // If already 9 digits (e.g. 555123456, 661..., 770...)
  if (cleaned.length === 9) {
    return '213' + cleaned;
  }

  return cleaned || '213555123456';
}

export function formatPriceFormatted(amount: number): string {
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function buildProductInquiryMessage(product: Product, lang: Language): string {
  const url = window.location.origin + '/products/' + product.slug;
  const priceFormatted = formatPriceFormatted(product.priceDzd);

  if (lang === 'ar') {
    const title = product.nameAr || product.name;
    return `السلام عليكم، أنا مهتم بالمنتج: ${title}، رقم المرجع: ${product.sku}، السعر: ${priceFormatted} دج. هل المنتج متوفر؟ رابط المنتج: ${url}`;
  }

  if (lang === 'en') {
    return `Hello, I am interested in ${product.name}, reference ${product.sku}, listed at ${priceFormatted} DZD. Could you confirm availability? Product link: ${url}`;
  }

  // French default
  return `Bonjour, je suis intéressé par le produit : ${product.name}. Référence : ${product.sku}. Prix affiché : ${priceFormatted} DZD. Pouvez-vous confirmer sa disponibilité ? Lien : ${url}`;
}

export function buildGeneralContactMessage(lang: Language): string {
  if (lang === 'ar') {
    return 'السلام عليكم، أود الاستفسار عن الأجهزة المتوفرة لدى YOUPPI INFO.';
  }
  if (lang === 'en') {
    return 'Hello, I would like to inquire about available computers at YOUPPI INFO.';
  }
  return 'Bonjour, je souhaite me renseigner sur les ordinateurs et composants disponibles chez YOUPPI INFO.';
}

export function openWhatsAppChat(params: {
  product?: Product;
  customMessage?: string;
  sourcePage: string;
  lang: Language;
}) {
  const settings = storeService.getSettings();
  const normalizedNumber = normalizeAlgerianPhone(settings.whatsappNumber);

  let messageText = '';
  if (params.customMessage) {
    messageText = params.customMessage;
  } else if (params.product) {
    messageText = buildProductInquiryMessage(params.product, params.lang);
  } else {
    messageText = buildGeneralContactMessage(params.lang);
  }

  // Log local inquiry if product was specified
  if (params.product) {
    storeService.recordInquiry({
      productId: params.product.id,
      productName: params.product.name,
      productSku: params.product.sku,
      priceDzd: params.product.priceDzd,
      sourcePage: params.sourcePage,
      language: params.lang,
    });
  }

  const encodedText = encodeURIComponent(messageText);
  const waUrl = `https://wa.me/${normalizedNumber}?text=${encodedText}`;

  // Open in new tab safely
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}
