import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/auth/auth";

export async function GET(
  req: Request,
  { params }: { params: { syncId: string } }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { syncId } = params;

  // ensure sync exists
  const sync = await prisma.sync.findUnique({ where: { id: syncId } });
  if (!sync) {
    return NextResponse.json({ success: false, message: "Sync not found" }, { status: 404 });
  }

  // find or create chat room for the sync
  let chatRoom = await prisma.chatRoom.findUnique({ where: { syncId } });

  if (!chatRoom) {
    chatRoom = await prisma.chatRoom.create({ data: { syncId } });
  }

  const messages = await prisma.message.findMany({
    where: { chatRoomId: chatRoom.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ success: true, chatRoom, messages });
}

export async function POST(
  req: Request,
  { params }: { params: { syncId: string } }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { syncId } = params;
  const body = await req.json();
  const { content } = body;

  if (!content || typeof content !== "string") {
    return NextResponse.json({ success: false, message: "Invalid message" }, { status: 400 });
  }

  const sync = await prisma.sync.findUnique({ where: { id: syncId } });
  if (!sync) {
    return NextResponse.json({ success: false, message: "Sync not found" }, { status: 404 });
  }

  // find or create chat room
  let chatRoom = await prisma.chatRoom.findUnique({ where: { syncId } });

  if (!chatRoom) {
    chatRoom = await prisma.chatRoom.create({ data: { syncId } });
  }

  const message = await prisma.message.create({
    data: {
      chatRoomId: chatRoom.id,
      senderId: userId,
      content,
    },
  });

  return NextResponse.json({ success: true, message });
}
