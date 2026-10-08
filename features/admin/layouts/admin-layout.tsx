import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { requireUser } from "@/lib/auth";
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
    const user = await requireUser();
    return (
        <SidebarProvider>
            <AppSidebar isAdmin={user.role === "ADMIN"} />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center border-b bg-background px-3">
                    <SidebarTrigger aria-label="Toggle CMS navigation" />
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
