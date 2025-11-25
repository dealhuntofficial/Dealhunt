import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET WALLET INFO
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: { transactions: true },
    });

    return NextResponse.json({ success: true, wallet });
  } catch (err) {
    console.error("Wallet GET Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ADD TRANSACTION (Credit/Debit)
export async function POST(req: Request) {
  try {
    const { userId, type, amount } = await req.json();

    if (!userId || !type || !amount)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Ensure wallet exists
    let wallet = await prisma.wallet.findUnique({ where: { userId } });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, balance: 0 },
      });
    }

    // Update balance
    const newBalance =
      type === "credit"
        ? wallet.balance + amount
        : wallet.balance - amount;

    const updatedWallet = await prisma.wallet.update({
      where: { userId },
      data: {
        balance: newBalance,
        transactions: {
          create: {
            type,
            amount,
          },
        },
      },
      include: { transactions: true },
    });

    return NextResponse.json({ success: true, wallet: updatedWallet });
  } catch (err) {
    console.error("Wallet POST Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
