"use client";

import { WalletProvider } from "@razorlabs/razorkit";
import "@razorlabs/razorkit/style.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
