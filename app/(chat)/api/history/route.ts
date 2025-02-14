import type { NextRequest } from "next/server";
import { getChatsByUserId } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const chats = await getChatsByUserId({ id: userId as string });
    return Response.json(chats);
  } catch (error) {
    console.log(error);
    return Response.json("Unauthorized!", { status: 401 });
  }
}
