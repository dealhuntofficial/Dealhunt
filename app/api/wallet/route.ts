import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET WALLET INFO
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId)
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );

    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: { transactions: true },
    });

    // IMPORTANT FIX — wallet missing → create new
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
        include: { transactions: true },
      });
    }

    return NextResponse.json({ success: true, wallet });
  } catch (err) {
    console.error("Wallet GET Error:", err);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}

// ADD TRANSACTION (Credit/Debit)
export async function POST(req: Request) {
  try {
    const { userId, type, amount } = await req.json();

    if (!userId || !type || !amount)
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );

    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    // Wallet exist ना हो → create
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, balance: 0 },
      });
    }

    const newBalance =
      type === "credit"
        ? wallet.balance + Number(amount)
        : wallet.balance - Number(amount);

    const updatedWallet = await prisma.wallet.update({
      where: { userId },
      data: {
        balance: newBalance,
        transactions: {
          create: {
            type,
            amount: Number(amount),
          },
        },
      },
      include: { transactions: true },
    });

    return NextResponse.json({ success: true, wallet: updatedWallet });
  } catch (err) {
    console.error("Wallet POST Error:", err);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
