import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export const GET = async (request) => {
  // const rawAuthHeader = headers().get("authorization");
  // const token = rawAuthHeader.split(" ")[1];

  // let roomId = null;
  // let role = null;

  // try {
  //   const payload = jwt.verify(token, process.env.JWT_SECRET);
  //   // roomId = payload.roomId;
  //   role = payload.role;
  // } catch {
  //   return NextResponse.json(
  //     {
  //       ok: false,
  //       message: "Invalid token",
  //     },
  //     { status: 401 }
  //   );
  // }

  readDB();
  let totalRooms = 0;
  for (const room of DB.rooms) {
    totalRooms++;
  }
  // const rooms = DB.rooms;
  // const totalRooms = DB.totalRooms;
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: totalRooms,
  });
};

export const POST = async (request) => {
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
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  const body = await request.json();
  const { roomName } = body;
  const roomId = nanoid();
  readDB();
  const foundRoomName = DB.rooms.find((x) => x.roomName === roomName);
  if (foundRoomName) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  DB.rooms.push({
    roomName,
    roomId,
  });

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
