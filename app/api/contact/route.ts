//app/api/contact/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rec = await prisma.contact.create({
      data: { name, email, message },
    });

    return NextResponse.json({ success: true, id: rec.id });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
