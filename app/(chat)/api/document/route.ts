import { user } from "./../../../../lib/db/schema";
import type { BlockKind } from "@/components/block";
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from "@/lib/db/queries";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  try {
    const documents = await getDocumentsById({ id });
    const [document] = documents;

    if (!document) {
      return new Response("Not Found", { status: 404 });
    }

    return Response.json(documents, { status: 200 });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  try {
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
      userId: userId as string,
    });

    return Response.json(document, { status: 200 });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  const { timestamp }: { timestamp: string } = await request.json();

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  try {
    const documents = await getDocumentsById({ id });

    const [document] = documents;

    if (document.userId !== userId) {
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
