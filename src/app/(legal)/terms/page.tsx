import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL_UPDATED, termsMarkdown } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return <LegalPage title="Terms and Conditions" updated={LEGAL_UPDATED} body={termsMarkdown()} />;
}
