"use client";

import { ModelSelector } from "@/components/model-selector";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { memo } from "react";
import type { VisibilityType } from "./visibility-selector";
import LoginButton from "./login-button";
import UserButton from "./user-button";
import { useWallet } from "@razorlabs/razorkit";

function PureChatHeader({
  selectedModelId,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const wallet = useWallet();

  return (
    <header className="flex justify-between sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      {!isReadonly && (
        <div className="flex items-center gap-2">
          <SidebarToggle />
          <ModelSelector
            selectedModelId={selectedModelId}
            className="order-1 md:order-2 rounded-lg"
          />
        </div>
      )}

      {!wallet.connected ? <LoginButton /> : <UserButton />}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
