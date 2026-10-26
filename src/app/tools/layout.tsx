import { GceNav } from "@/components/gce-nav";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GceNav />
      {children}
    </>
  );
}
