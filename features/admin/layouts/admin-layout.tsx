import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/admin/components/app-sidebar";
import { requireUser } from "@/backend/auth";
export default async function AdminLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const user = await requireUser();
  return (
    <SidebarProvider>
      <AppSidebar isAdmin={user.role === "ADMIN"} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center border-b bg-background px-3">
          <SidebarTrigger aria-label="Toggle CMS navigation" />
        </header>
        <main className="min-h-dvh bg-background p-6 md:p-12">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
