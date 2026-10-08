"use client";

import { useState, useMemo } from "react";
import { products, categories, Product } from "@/lib/products";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    if (selectedCategory === "Todos") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  async function handleBuyNow() {
    if (!selectedProduct || !name.trim() || !email.trim()) {
      setError("Preencha nome e e-mail");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          productName: selectedProduct.name,
          amount: selectedProduct.price,
          productId: selectedProduct.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar pagamento");
      setPaymentData(data);
      setShowCheckout(false);
    } catch (err: any) {
      setError(err.message || "Erro ao processar");
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  if (paymentData) {
    const pixCode =
      paymentData?.pixCode ||
      paymentData?.qrCode ||
      paymentData?.payment?.pixCode ||
      paymentData?.data?.pixCode ||
      "";
    const qrImage =
      paymentData?.qrCodeImage ||
      paymentData?.qrCodeBase64 ||
      paymentData?.payment?.qrCodeImage ||
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

          {qrImage && (
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <img src={qrImage.startsWith("data:") ? qrImage : `data:image/png;base64,${qrImage}`} alt="QR Code" className="w-48 h-48" />
            </div>
          )}

          {pixCode && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Pix Copia e Cola</p>
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 text-xs break-all font-mono">
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

          <button
            onClick={() => {
              setPaymentData(null);
              setSelectedProduct(null);
              setName("");
              setEmail("");
            }}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-sm">P</div>
            <span className="font-bold text-xl">Pluvy Shop</span>
          </div>
          <a
            href="https://wa.me/5547996245076"
            target="_blank"
            className="text-sm bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Produtos Digitais <span className="text-red-500">Premium</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Contas, likes, passes e mais. Entrega rápida via WhatsApp após confirmação do Pix.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-red-600 text-white"
                  : "bg-[#111] text-gray-300 hover:bg-[#1a1a1a] border border-[#1f1f1f]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 hover:border-red-600/50 transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded">
                  {product.category}
                </span>
                <span className="text-xl font-bold text-red-500">
                  {formatPrice(product.price)}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-red-400 transition">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                {product.description.slice(0, 120)}...
              </p>
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setShowCheckout(true);
                  setError("");
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Comprar Agora
              </button>
            </div>
          ))}
        </div>
      </main>

      {showCheckout && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Finalizar Compra</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#0a0a0a] rounded-xl p-4 mb-4">
              <p className="font-medium">{selectedProduct.name}</p>
              <p className="text-red-500 font-bold text-lg mt-1">
                {formatPrice(selectedProduct.price)}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Nome completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <button
              onClick={handleBuyNow}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Gerando Pix..." : "Gerar Pix"}
            </button>
          </div>
        </div>
      )}

      <footer className="border-t border-[#1f1f1f] py-8 text-center text-sm text-gray-500">
        <p>© 2026 Pluvy Shop — Todos os direitos reservados</p>
        <p className="mt-1">Suporte via WhatsApp</p>
      </footer>
    </div>
  );
}
