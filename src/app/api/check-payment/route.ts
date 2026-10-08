import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/sharpify";

export async function GET(req: NextRequest) {
  try {
    const paymentLinkId = req.nextUrl.searchParams.get("id");
    if (!paymentLinkId) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const payment = await getPayment(paymentLinkId);
    return NextResponse.json(payment);
  } catch (error: any) {
    console.error("Check payment error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao consultar pagamento" },
      { status: 500 }
    );
  }
}
