import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Nattapoom Pothongsunun",
    studentId: "650610761",
  });
};
