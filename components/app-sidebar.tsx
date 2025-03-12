"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useWallet } from "@razorlabs/razorkit";
import { SidebarUserNav } from "./sidebar-user-nav";
import { useEffect } from "react";
import useStep from "@/hooks/use-step";
import { STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { setOpenMobile, open, setOpen } = useSidebar();
  const { step } = useStep();

  const wallet = useWallet();

  useEffect(() => {
    setOpen(true);
  }, []);
  return (
    <Sidebar className="group-data-[side=left]:border-r-0 p-4 pe-0 !bg-transparent rounded-2xl overflow-hidden max-h-full">
      <SidebarHeader className="rounded-t-2xl bg-white overflow-hidden">
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-2xl font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Move<b className="text-primary font-semibold">Duck</b>
              </span>
            </Link>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white overflow-hidden p-4 ">
        {/* <SidebarHistory userId={wallet.address as string} /> */}
        <div className="flex flex-col gap-2 after:h-full text-sm ps-3 after:bg-[#8A8A8A] after:w-px after:absolute after:left-0 after:z-0 relative">
          <div
            className={cn(
              "w-1 h-1/4 -translate-x-1/2 rounded-full bg-primary absolute top-0 left-0 z-10 transition-transform",
              `translate-y-[${step - 1}00%]`
            )}
          />
          {STEPS.map((s) => (
            <button key={s.step}>
              <div
                className={cn(
                  `flex flex-row items-center gap-2 px-2 py-3 rounded-md text-[#8A8A8A] cursor-pointer`,
                  step === s.step ? "text-black" : ""
                )}
              >
                <span className="text-sm font-semibold">
                  Step {s.step}: {s.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter className="bg-white rounded-b-2xl">
        <SidebarUserNav />
      </SidebarFooter>
    </Sidebar>
  );
}
