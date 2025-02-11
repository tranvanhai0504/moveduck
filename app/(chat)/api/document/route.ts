import type { BlockKind } from "@/components/block";
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from "@/lib/db/queries";
import privy from "../privy";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const cookieAuthToken = request.cookies.get("privy-token");

  try {
    const claims = await privy.verifyAuthToken(cookieAuthToken?.value ?? "");

    if (!claims || !claims.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const documents = await getDocumentsById({ id });
    const [document] = documents;

    if (!document) {
      return new Response("Not Found", { status: 404 });
    }

    if (document.userId !== claims.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    return Response.json(documents, { status: 200 });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const cookieAuthToken = request.cookies.get("privy-token");

  try {
    if (!cookieAuthToken?.value) {
      return new Response("Unauthorized", { status: 401 });
    }
    const claims = await privy.verifyAuthToken(cookieAuthToken.value);

    if (!claims || !claims.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const {
      content,
      title,
      kind,
    }: { content: string; title: string; kind: BlockKind } =
      await request.json();

    const document = await saveDocument({
      id,
      content,
      title,
      kind,
      userId: claims.userId,
    });

    return Response.json(document, { status: 200 });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const { timestamp }: { timestamp: string } = await request.json();

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const cookieAuthToken = request.cookies.get("privy-token");

  try {
    const claims = await privy.verifyAuthToken(cookieAuthToken?.value ?? "");

    if (!claims || !claims.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const documents = await getDocumentsById({ id });

    const [document] = documents;

    if (document.userId !== claims.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteDocumentsByIdAfterTimestamp({
      id,
      timestamp: new Date(timestamp),
    });

    return new Response("Deleted", { status: 200 });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}
