import Sidebar from "@/components/sidebar/Sidebar";
import MobileNav from "@/components/mobile/MobileNav";
import PageTransition from "@/components/transitions/PageTransition";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <MobileNav role="owner" />
      <Sidebar role="owner" />
      <div className="app-main">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
