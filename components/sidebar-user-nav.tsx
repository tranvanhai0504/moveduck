"use client";
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { type User, useLogout } from "@privy-io/react-auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarUserNav({ user }: { user: User }) {
  const { logout } = useLogout();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              <Image
                src={`https://avatar.vercel.sh/${user.email?.address}`}
                alt={user.email?.address ?? "User Avatar"}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="truncate">{user.wallet?.address}</span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            {/* <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {`Toggle ${theme === "light" ? "dark" : "light"} mode`}
            </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => {
                  logout();
                }}
              >
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
