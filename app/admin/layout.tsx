import Sidebar from "@/components/sidebar/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <Sidebar role="admin" />
      <div className="app-main">{children}</div>
    </div>
  );
}
