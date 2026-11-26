import Sidebar from "@/components/sidebar/Sidebar";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <Sidebar role="owner" />
      <div className="app-main">{children}</div>
    </div>
  );
}
