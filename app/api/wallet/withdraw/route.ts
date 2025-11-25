import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const rec = await prisma.withdrawRequest.create({
      data: {
        userId,
        amount: Number(amount),
      },
    });

    return NextResponse.json({ success: true, id: rec.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
