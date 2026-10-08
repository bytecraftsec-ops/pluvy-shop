"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState<any>(null);

  function formatPrice(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  async function handlePay() {
    if (!name.trim() || !email.trim()) {
      setError("Preencha nome e e-mail");
      return;
    }
    if (items.length === 0) {
      setError("Carrinho vazio");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const productNames = items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ");
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          productName: productNames,
          amount: total,
          productId: items.map((i) => i.product.id).join(","),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar pagamento");
      setPaymentData(data);
      clearCart();
    } catch (err: any) {
      setError(err.message || "Erro ao processar");
    } finally {
      setLoading(false);
    }
  }

  if (paymentData) {
    const pixCode =
      paymentData?.pixCode ||
      paymentData?.qrCode ||
      paymentData?.payment?.pixCode ||
      paymentData?.data?.pixCode ||
      paymentData?.brCode ||
      paymentData?.copyPaste ||
      paymentData?.emv ||
      "";
    const qrImage =
      paymentData?.qrCodeImage ||
      paymentData?.qrCodeBase64 ||
      paymentData?.payment?.qrCodeImage ||
      paymentData?.qrcode ||
      paymentData?.qr_code_base64 ||
      "";

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Pedido criado!</h2>
          <p className="text-gray-400 mb-6">Escaneie o QR Code ou copie o código Pix</p>

          {qrImage ? (
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <img
                src={qrImage.startsWith("data:") ? qrImage : `data:image/png;base64,${qrImage}`}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
          ) : null}

          {pixCode && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Pix Copia e Cola</p>
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 text-xs break-all font-mono max-h-24 overflow-y-auto">
                {pixCode}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(pixCode)}
                className="mt-2 text-sm text-red-500 hover:text-red-400"
              >
                Copiar código
              </button>
            </div>
          )}

          {!pixCode && !qrImage && (
            <pre className="text-left text-xs bg-[#0a0a0a] p-3 rounded-lg overflow-auto max-h-40 mb-4">
              {JSON.stringify(paymentData, null, 2)}
            </pre>
          )}

          <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 text-left mt-6">
            <p className="text-sm text-gray-400 mb-2">Após o pagamento aprovado:</p>
            <p className="font-medium">Envie uma mensagem no WhatsApp:</p>
            <a
              href="https://wa.me/5547996245076"
              target="_blank"
              className="text-red-500 font-bold text-lg block mt-1"
            >
              (47) 99624-5076
            </a>
            <p className="text-sm text-gray-400 mt-2">
              Informe o produto e seu e-mail da compra.
            </p>
          </div>

          <Link
            href="/"
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition inline-block"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Carrinho vazio</p>
          <Link href="/" className="text-red-500 hover:underline">
            Ver produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-sm">P</div>
            <span className="font-bold text-xl">Pluvy Shop</span>
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 mb-6 space-y-2">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-gray-300">
                {item.quantity}x {item.product.name}
              </span>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-[#1f1f1f] pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-red-500">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Nome completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111] border border-[#1f1f1f] rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111] border border-[#1f1f1f] rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition"
        >
          {loading ? "Gerando Pix..." : "Gerar Pix"}
        </button>
      </main>
    </div>
  );
}
