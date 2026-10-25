/** All times are shown in Cameroon time, whatever the server's time zone. */
const TIME_ZONE = "Africa/Douala";

const dateTime = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

export function formatDateTime(date: Date): string {
  return dateTime.format(date);
}

const dateOnly = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});

/** e.g. "25 Nov 2026", in Cameroon time. */
export function formatDate(date: Date): string {
  return dateOnly.format(date);
}

export function formatSeconds(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

// Cameroon is UTC+1 all year (no daylight saving time).
const DOUALA_OFFSET_MS = 60 * 60 * 1000;

/** Value for an <input type="datetime-local"> showing the date in Cameroon time. */
export function toDoualaInput(date: Date): string {
  return new Date(date.getTime() + DOUALA_OFFSET_MS).toISOString().slice(0, 16);
}

/** Parses an <input type="datetime-local"> value entered in Cameroon time. */
export function fromDoualaInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+01:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}
