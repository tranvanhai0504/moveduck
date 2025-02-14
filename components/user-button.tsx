"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, Copy, Check, LogOut } from "lucide-react";
import Image from "next/image";
import { shortenWalletAddress } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useWallet } from "@razorlabs/razorkit";
import { CreateUserLogin } from "@/app/(auth)/actions";

const TIMEOUT_COPY = 2000;

const UserButton = () => {
  const [copied, setCopiedState] = useState(false);
  const wallet = useWallet();

  const handleCopy = (text: string) => {
    if (copied) return;
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => {
      setCopiedState(false);
    }, TIMEOUT_COPY);
  };

  const handleCreateUser = useCallback(async () => {
    if (!wallet.connected) return;
    const address = wallet.address;

    if (!address) return;

    await CreateUserLogin(address, null, address);
  }, [wallet.connected, wallet.address]);

  useEffect(() => {
    handleCreateUser();
  }, [handleCreateUser]);

  return wallet.connected ? (
    <>
      {wallet.connected && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex py-1.5 px-4 h-fit md:h-[34px] order-4 w-full rounded-lg">
              {shortenWalletAddress(wallet.address || "")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 border me-4 text-center">
            <DropdownMenuLabel className="flex items-center justify-center px-4 py-2 space-x-2">
              <Image
                src="/images/movement-logo.png"
                alt="MoveStack logo"
                width={20}
                height={20}
              />
              <Link
                href={`https://explorer.movementlabs.xyz/account/${wallet.address}?network=testnet`}
                target="_blank"
                className="hover:underline"
              >
                {shortenWalletAddress(wallet.address || "", 6)}
              </Link>
              <Button
                onClick={() => handleCopy(wallet.address || "")}
                disabled={copied}
                className="!p-0 bg-transparent hover:bg-transparent text-primary"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>Profile</DropdownMenuItem>
              <DropdownMenuItem disabled>Billing</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={wallet.disconnect}
              className="cursor-pointer"
            >
              Log out
              <LogOut size={14} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  ) : (
    <Loader2 className="size-4 animate-spin order-4 md:ml-auto" />
  );
};

export default UserButton;
