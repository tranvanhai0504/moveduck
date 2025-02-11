import React, { useCallback } from "react";
import { CreateUserLogin } from "@/app/(auth)/actions";
import { ConnectButton } from "@razorlabs/razorkit";
import { useWallet } from "@razorlabs/razorkit";

const LoginButton = () => {

  return (
    <ConnectButton
      className=" !px-4 !text-sm w-40 !py-2 rounded-lg"
      label="Connect Wallet"
    />
  );
};

export default LoginButton;
