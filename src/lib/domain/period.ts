/**
 * Prize periods are calendar months in Cameroon time, written "YYYY-MM".
 * A test belongs to the month in which it closes.
 */
export function parsePeriod(period: string): { start: Date; end: Date } | null {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(period);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const pad = (n: number) => String(n).padStart(2, "0");
  const next = month === 12 ? `${year + 1}-01` : `${year}-${pad(month + 1)}`;
  return {
    start: new Date(`${year}-${pad(month)}-01T00:00:00+01:00`),
    end: new Date(`${next}-01T00:00:00+01:00`),
  };
}

export function periodOf(date: Date): string {
  const local = new Date(date.getTime() + 60 * 60 * 1000);
  return local.toISOString().slice(0, 7);
}

export function previousPeriod(period: string): string {
  const range = parsePeriod(period);
  if (!range) throw new Error(`Invalid period: ${period}`);
  return periodOf(new Date(range.start.getTime() - 1));
}
