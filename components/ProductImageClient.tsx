"use client";

import Image from "next/image";

// Miniatura para componentes cliente (carrito y checkout).
export function ProductImageClient({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  const local = !!src && !src.startsWith("https://");
  return (
    <div className={`relative aspect-square overflow-hidden bg-[#e4ebe8] ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes="96px" unoptimized={local} className="object-cover" />
      ) : (
        <span aria-hidden className="flex h-full items-center justify-center text-xl font-bold text-pine-soft/50">
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
