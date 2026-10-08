"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Image01Icon,
  Settings02Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Urutan array = urutan tampil di sidebar.
// `adminOnly: true` -> hanya muncul untuk ADMIN.
const NAV_LINKS = [
  { href: "/admin", label: "Overview", icon: Home01Icon },
  { href: "/admin/content", label: "Content", icon: Settings02Icon },
  { href: "/admin/media", label: "Media", icon: Image01Icon, adminOnly: true },
  { href: "/admin/users", label: "People", icon: UserAccountIcon, adminOnly: true },
  { href: "/admin/account", label: "My account", icon: UserAccountIcon },
];

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = NAV_LINKS.filter((link) => isAdmin || !link.adminOnly);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-2 py-2 font-serif text-xl"
        >
          Asietex<span className="text-[#ab873e]">.</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>CMS workspace</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={<Link href={item.href} />}
                  >
                    <HugeiconsIcon icon={item.icon} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className="px-2 text-xs text-muted-foreground">
          {isAdmin ? "Admin workspace" : "Staff workspace"}
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
