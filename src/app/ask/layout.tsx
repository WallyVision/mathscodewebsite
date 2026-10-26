import { GceNav } from "@/components/gce-nav";

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GceNav />
      {children}
    </>
  );
}
