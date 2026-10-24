import { GceNav } from "@/components/gce-nav";

export default function GceSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GceNav />
      {children}
    </>
  );
}
