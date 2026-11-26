import Sidebar from "@/components/sidebar/Sidebar";
import MobileNav from "@/components/mobile/MobileNav";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <MobileNav role="owner" />
      <Sidebar role="owner" />
      <div className="app-main">{children}</div>
    </div>
  );
}
