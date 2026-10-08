"use client";

import { useState, useMemo } from "react";
import { products, categories } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { count } = useCart();

  const filtered = useMemo(() => {
    if (selectedCategory === "Todos") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  function formatPrice(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-red-500/20">
              P
            </div>
            <span className="font-bold text-lg tracking-tight">Pluvy Shop</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/carrinho"
              className="relative text-sm text-gray-300 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
            >
              Carrinho
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <a
              href="https://wa.me/5547996245076"
              target="_blank"
              className="text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full transition font-medium"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/produto/${product.id}`}
              className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
            >
              <div className="aspect-square bg-[#0a0a0a] overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-semibold text-white bg-black/60 backdrop-blur px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-3.5">
                <h3 className="font-medium text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-red-400 transition">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-gray-500">A partir de</p>
                    <p className="text-red-500 font-bold text-base">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-red-600 flex items-center justify-center transition">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-gray-600">
        <p>© 2026 Pluvy Shop</p>
      </footer>
    </div>
  );
}
