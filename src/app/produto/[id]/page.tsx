"use client";

import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const product = getProduct(params.id as string);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Link href="/" className="text-red-500 hover:underline">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  function formatPrice(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function handleAddToCart() {
    addToCart(product!);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addToCart(product!);
    router.push("/checkout");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-sm">P</div>
            <span className="font-bold text-xl">Pluvy Shop</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/carrinho" className="text-sm hover:text-red-400 transition">
              Carrinho
            </Link>
            <a
              href="https://wa.me/5547996245076"
              target="_blank"
              className="text-sm bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
          ← Voltar para a loja
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-xs font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold mt-4 mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-red-500 mb-6">
              {formatPrice(product.price)}
            </p>

            <div className="text-gray-300 whitespace-pre-line mb-8 text-sm leading-relaxed">
              {product.description}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-white font-semibold py-4 rounded-xl transition"
              >
                {added ? "✓ Adicionado!" : "Adicionar ao Carrinho"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition"
              >
                Comprar Agora
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Após o pagamento, você receberá as instruções de entrega no WhatsApp.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
