"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, count } = useCart();
  const router = useRouter();

  function formatPrice(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-sm">P</div>
            <span className="font-bold text-xl">Pluvy Shop</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            Continuar comprando
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Carrinho ({count})</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Seu carrinho está vazio</p>
            <Link
              href="/"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex gap-4 items-center"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.product.name}</h3>
                  <p className="text-red-500 font-semibold">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 bg-[#1a1a1a] rounded-lg hover:bg-[#252525]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 bg-[#1a1a1a] rounded-lg hover:bg-[#252525]"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-gray-500 hover:text-red-500 text-sm ml-2"
                >
                  Remover
                </button>
              </div>
            ))}

            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 mt-6">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span className="text-red-500">{formatPrice(total)}</span>
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
