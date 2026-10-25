import { site } from "@/lib/site";

/** Support WhatsApp number, digits only (SUPPORT_WHATSAPP overrides the default). */
export function supportWhatsApp(): string {
  return (process.env.SUPPORT_WHATSAPP || site.supportWhatsApp).replace(/\D/g, "");
}

/** Optional support email, from SUPPORT_EMAIL. */
export function supportEmail(): string | null {
  return process.env.SUPPORT_EMAIL?.trim() || null;
}

/** "+237 676 99 92 21" style, for display. */
export function formatWhatsApp(digits: string): string {
  const local = digits.startsWith("237") ? digits.slice(3) : digits;
  const grouped = local.replace(/^(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5");
  return digits.startsWith("237") ? `+237 ${grouped}` : grouped;
}

export function whatsAppLink(digits: string, text?: string): string {
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
