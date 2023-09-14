import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  const foundRoomId = DB.messages.find((x) => x.roomId === roomId);
  if (!roomId || !foundRoomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  readDB();
  // const messages = [];
  // for (const message of DB.messages) {
  //   if (message.roomId === roomId) {
  //     messages.push(message);
  //   }
  // }
  let filtered = DB.messages;
  filtered = filtered.filter((x) => x.roomId === roomId);
  return NextResponse.json({
    ok: true,
    messages: filtered,
  });
};

export const POST = async (request) => {
  const body = await request.json();

  readDB();
  const { roomId, messageText } = body;
  const foundRoomId = DB.messages.find((x) => x.roomId === roomId);
  if (!roomId || !foundRoomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();
  DB.messages.push({
    roomId,
    messageId,
    messageText,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  let role = null;
  try {
    const payload = checkToken();
    role = payload.role;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  if (role === "ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { messageId } = body;
  readDB();
  const foundIndex = DB.messages.findIndex((x) => x.messageId === messageId);

  if (foundIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  DB.messages.splice(foundIndex, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
