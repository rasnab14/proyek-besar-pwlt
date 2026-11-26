import Sidebar from "@/components/sidebar/Sidebar";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar role="owner" />
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>{children}</div>
    </div>
  );
}
