import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL_UPDATED, refundsMarkdown } from "@/lib/legal";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundsPage() {
  return <LegalPage title="Refund Policy" updated={LEGAL_UPDATED} body={refundsMarkdown()} />;
}
