"use server";
import { createUser, getUser, updateUser } from "@/lib/db/queries";

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
}

export async function CreateUserLogin(
  user_id: string,
  email: string | null,
  walletAddress: string | null
) {
  const user = await getUser(user_id);

  if (user.length !== 0) {
    return;
  }

  function isValidEVMAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  const validWallet = walletAddress;
  return createUser(user_id, email as any, validWallet as any);
}

export async function UpdateUserWallet(user_id: string, walletAddress: string) {
  const user = await getUser(user_id);

  if (user.length === 0) {
    return;
  }

  return updateUser(user_id, walletAddress);
}
