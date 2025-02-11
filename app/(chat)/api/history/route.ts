import type { NextRequest } from "next/server";
import privy from "../privy";
import { getChatsByUserId } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const cookieAuthToken = request.cookies.get("privy-token");

  try {
    const claims = await privy.verifyAuthToken(cookieAuthToken?.value ?? "");

    if (!claims || !claims.userId) {
      return Response.json("Unauthorized!", { status: 401 });
    }

    const chats = await getChatsByUserId({ id: claims.userId });
    return Response.json(chats);
  } catch (error) {
    console.log(error);
    return Response.json("Unauthorized!", { status: 401 });
  }
}
