/**
 * Normalises a Cameroonian phone number to E.164 (+237XXXXXXXXX).
 * Accepts spaces, dashes, and an optional 237 / +237 / 00237 prefix.
 * Mobile numbers start with 6, landlines with 2; both are 9 digits.
 */
export function normalizeCameroonPhone(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.length === 12 && digits.startsWith("237")) digits = digits.slice(3);
  if (!/^[26]\d{8}$/.test(digits)) return null;
  return `+237${digits}`;
}

/** Mobile Money only works on mobile numbers (+2376…), not landlines (+2372…). */
export function isCameroonMobile(e164: string): boolean {
  return /^\+2376\d{8}$/.test(e164);
}
