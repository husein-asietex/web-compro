"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions/auth";

// `adminOnly: true` -> hanya muncul untuk ADMIN.
const NAV_GROUPS = [
  {
    label: "Admin",
    links: [
      { href: "/dashboard", label: "Overview", icon: Home01Icon },
      {
        href: "/dashboard/users",
        label: "People",
        icon: UserAccountIcon,
        adminOnly: true,
      },
      {
        href: "/dashboard/account",
        label: "My account",
        icon: UserAccountIcon,
      },
    ],
  },
  {
    label: "CMS",
    links: [
      { href: "/dashboard/content", label: "Content", icon: Settings02Icon },
      {
        href: "/dashboard/media",
        label: "Media",
        icon: Image01Icon,
        adminOnly: true,
      },
    ],
  },
] as const;

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 overflow-hidden px-2 py-2 font-serif text-xl group-data-[collapsible=icon]:justify-center"
        >
          <Image
            src="/LOGOASIETEX.webp"
            alt="Asietex"
            width={28}
            height={28}
            className="size-7 shrink-0 object-contain"
          />
          <span className="group-data-[collapsible=icon]:hidden">Asietex</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => {
          const items = group.links.filter(
            (link) => isAdmin || !("adminOnly" in link && link.adminOnly),
          );

          if (items.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

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
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          {isAdmin ? "Admin workspace" : "Staff workspace"}
        </p>
        <form action={logoutAction} className="w-full">
          <Button
            type="submit"
            variant="outline"
            aria-label="Sign out"
            className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center"
          >
            <LogOutIcon aria-hidden="true" />
            <span className="group-data-[collapsible=icon]:hidden">
              Sign out
            </span>
          </Button>
        </form>
      </SidebarFooter>

      {/* tombol sign out disini */}

      <SidebarRail />
    </Sidebar>
  );
}
