import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correct = process.env.UPSC_ACCESS_PASSWORD;

  if (!correct) {
    return NextResponse.json(
      { error: "Server misconfigured: UPSC_ACCESS_PASSWORD is not set." },
      { status: 500 }
    );
  }

  if (password !== correct) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("upsc_session", "granted", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
