import { site } from "@/lib/site";

/** The Cameroon flag: green, red and yellow bands with a yellow star on the red. */
export function CameroonFlag({ className = "h-4 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={`shrink-0 rounded-[2px] shadow-sm ${className}`}
      aria-hidden
    >
      <rect width="10" height="20" fill="#007a5e" />
      <rect x="10" width="10" height="20" fill="#ce1126" />
      <rect x="20" width="10" height="20" fill="#fcd116" />
      <polygon
        points="15,6.2 16.06,9.45 19.47,9.45 16.71,11.45 17.76,14.7 15,12.7 12.24,14.7 13.29,11.45 10.53,9.45 13.94,9.45"
        fill="#fcd116"
      />
    </svg>
  );
}

/** A thin green, red and yellow band, as on the flag. */
export function FlagStripe({ className = "h-1" }: { className?: string }) {
  return (
    <div className={`flex w-full ${className}`} aria-hidden>
      <span className="flex-1 bg-cm-green" />
      <span className="flex-1 bg-cm-red" />
      <span className="flex-1 bg-cm-yellow" />
    </div>
  );
}

/** The site name with the flag and the motto underneath. */
export function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <CameroonFlag />
      <span className="flex flex-col leading-tight">
        <span
          className={`text-base font-bold sm:text-lg ${inverted ? "text-white" : "text-brand-700"}`}
        >
          {site.name}
        </span>
        <span
          className={`text-[11px] italic sm:text-xs ${inverted ? "text-brand-100" : "text-slate-500"}`}
        >
          “{site.slogan}”
        </span>
      </span>
    </span>
  );
}
