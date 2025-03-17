"use client";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { LoginButton } from "./login-button";
import UserButton from "./user-button";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function SidebarUserNav() {
  const wallet = useWallet();
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex justify-center">
        {!wallet.connected ? <LoginButton /> : <UserButton />}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
