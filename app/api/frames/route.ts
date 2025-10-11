import db from "@/config/db";
import { chatTable, frameTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const frameId = searchParams.get("frameId");
  const projectId = searchParams.get("projectId");

  const frameResult = await db
    .select()
    .from(frameTable)
    // @ts-ignore
    .where(eq(frameTable.frameId, frameId));

  const chatResult = await db
    .select()
    .from(chatTable)
    // @ts-ignore
    .where(eq(chatTable.frameId, frameId));

  const finalResult = {
    ...frameResult[0],
    chatMessages: chatResult[0]?.chatMessage,
  };

  return NextResponse.json(finalResult);
}

export async function PUT(req: NextRequest) {
  const { frameId, designCode, projectId } = await req.json();
  const result = await db
    .update(frameTable)
    .set({
      designCode,
    })
    .where(
      and(eq(frameTable.frameId, frameId), eq(frameTable.projectId, projectId))
    );
  return NextResponse.json({
    result: "updated",
  });
}
