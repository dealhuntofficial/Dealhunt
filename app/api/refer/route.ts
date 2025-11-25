import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// CREATE REFERRAL
export async function POST(req: Request) {
  try {
    const { senderId, receiverEmail } = await req.json();

    if (!senderId || !receiverEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Recevier user exist karta hai?
    let receiver = await prisma.user.findUnique({
      where: { email: receiverEmail }
    });

    // Agar receiver exist nahi karta → blank user create
    if (!receiver) {
      receiver = await prisma.user.create({
        data: {
          email: receiverEmail,
        },
      });
    }

    const code = Math.random().toString(36).substring(2, 10);

    const rec = await prisma.referral.create({
      data: {
        senderId,
        receiverId: receiver.id,
        code,
      },
    });

    return NextResponse.json(
      { success: true, referral: rec },
      { status: 200 }
    );

  } catch (error) {
    console.error("Referral Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
