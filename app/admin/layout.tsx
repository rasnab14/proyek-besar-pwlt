import Sidebar from "@/components/sidebar/Sidebar";
import MobileNav from "@/components/mobile/MobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <MobileNav role="admin" />
      <Sidebar role="admin" />
      <div className="app-main">{children}</div>
    </div>
  );
}
