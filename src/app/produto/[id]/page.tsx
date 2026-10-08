"use client";

import { useParams, useRouter } from "next/navigation";
import { getProduct, Variant, Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, count } = useCart();
  const [added, setAdded] = useState(false);

  const product = getProduct(params.id as string);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Link href="/" className="text-red-500 hover:underline">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return <ProductContent product={product} addToCart={addToCart} count={count} router={router} added={added} setAdded={setAdded} />;
}

function ProductContent({
  product,
  addToCart,
  count,
  router,
  added,
  setAdded,
}: {
  product: Product;
  addToCart: (p: Product) => void;
  count: number;
  router: ReturnType<typeof useRouter>;
  added: boolean;
  setAdded: (v: boolean) => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants?.[0] || null
  );

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentName = selectedVariant
    ? `${product.name} — ${selectedVariant.name}`
    : product.name;

  function formatPrice(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function handleAddToCart() {
    const itemToAdd: Product = {
      ...product,
      id: selectedVariant?.id || product.id,
      name: currentName,
      price: currentPrice,
    };
    addToCart(itemToAdd);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    const itemToAdd: Product = {
      ...product,
      id: selectedVariant?.id || product.id,
      name: currentName,
      price: currentPrice,
    };
    addToCart(itemToAdd);
    router.push("/checkout");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
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

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-flex items-center gap-1">
          ← Voltar
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full w-fit">
              {product.category}
            </span>

            <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-red-500">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-sm text-gray-400">à vista no Pix</span>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Escolha uma opção:</p>
                <div className="space-y-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition flex items-center justify-between ${
                        selectedVariant?.id === v.id
                          ? "border-red-500 bg-red-500/10"
                          : "border-[#1f1f1f] bg-[#111] hover:border-[#333]"
                      }`}
                    >
                      <span className="font-medium">{v.name}</span>
                      <span className="text-red-500 font-semibold">
                        {formatPrice(v.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleBuyNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition text-base"
              >
                Comprar agora
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full bg-transparent hover:bg-[#1a1a1a] border border-[#333] text-white font-semibold py-4 rounded-xl transition text-base"
              >
                {added ? "✓ Adicionado ao carrinho" : "Adicionar ao carrinho"}
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
                <p className="font-medium text-sm mb-1">⚡ Entrega via WhatsApp</p>
                <p className="text-xs text-gray-400">Após confirmação do pagamento você recebe as instruções no WhatsApp.</p>
              </div>
              <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
                <p className="font-medium text-sm mb-1">🔒 Compra segura</p>
                <p className="text-xs text-gray-400">Pagamento via Pix protegido.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#1f1f1f] pt-10">
          <h2 className="text-xl font-bold mb-6">Descrição do produto</h2>
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 text-gray-300 whitespace-pre-line text-sm leading-relaxed">
            {product.description}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1f1f1f] py-8 text-center text-sm text-gray-500 mt-12">
        <p>© 2026 Pluvy Shop</p>
      </footer>
    </div>
  );
}
