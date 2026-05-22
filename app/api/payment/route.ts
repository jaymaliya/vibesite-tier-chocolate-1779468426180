import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
const rz = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID ?? "rzp_test_", key_secret: process.env.RAZORPAY_KEY_SECRET ?? "" });
export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR" } = await req.json();
    const order = await rz.orders.create({ amount: Math.round(amount * 100), currency, receipt: "r_" + Date.now() });
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}