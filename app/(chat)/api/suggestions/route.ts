import privy from "../privy";
import { getSuggestionsByDocumentId } from "@/lib/db/queries";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return new Response("Not Found", { status: 404 });
  }

  const cookieAuthToken = request.cookies.get("privy-token");

  try {
    const claims = await privy.verifyAuthToken(cookieAuthToken?.value ?? "");

    if (!claims || !claims.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const suggestions = await getSuggestionsByDocumentId({
      documentId,
    });

    const [suggestion] = suggestions;

    if (!suggestion) {
      return Response.json([], { status: 200 });
    }

    if (suggestion.userId !== claims.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    return Response.json(suggestions, { status: 200 });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}
