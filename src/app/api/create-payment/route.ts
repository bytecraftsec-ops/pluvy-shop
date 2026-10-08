import { NextRequest, NextResponse } from "next/server";
import { createPixPayment } from "@/lib/sharpify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, productName, amount, productId } = body;

    if (!name || !email || !productName || !amount) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const payment = await createPixPayment({
      name: `${productName} - ${name}`,
      description: `Pedido Pluvy Shop - ${productName} | Cliente: ${name} (${email})`,
      amount: Number(amount),
    });

    return NextResponse.json(payment);
  } catch (error: any) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar pagamento" },
      { status: 500 }
    );
  }
}
