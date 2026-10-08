import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pluvy Shop | Produtos Digitais",
  description: "Loja de produtos digitais com entrega rápida via WhatsApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-[#0a0a0a] text-white">
        {children}
      </body>
    </html>
  );
}
