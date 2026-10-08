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
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-sm">P</div>
            <span className="font-bold text-xl">Pluvy Shop</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/carrinho" className="relative text-sm hover:text-red-400 transition">
              Carrinho
              {count > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
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

      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/produto/${product.id}`}
              className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden hover:border-red-600/50 transition group"
            >
              <div className="aspect-[4/3] bg-[#0a0a0a] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <span className="text-lg font-bold text-red-500">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <h3 className="font-semibold text-base group-hover:text-red-400 transition line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#1f1f1f] py-8 text-center text-sm text-gray-500">
        <p>© 2026 Pluvy Shop — Todos os direitos reservados</p>
        <p className="mt-1">Suporte via WhatsApp</p>
      </footer>
    </div>
  );
}
