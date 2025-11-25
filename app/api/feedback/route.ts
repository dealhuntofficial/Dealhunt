import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message, rating, userId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const rec = await prisma.feedback.create({
      data: {
        message,
        rating: rating ?? null,
        userId: userId ?? null,
      },
    });

    return NextResponse.json({ success: true, id: rec.id });
  } catch (error) {
    console.error("Feedback Error:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
