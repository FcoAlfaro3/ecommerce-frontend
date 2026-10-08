import Image from "next/image";

interface Props {
  src: string | null;
  alt: string;
  sizes: string;
  /** true para las imágenes visibles al cargar (mejora el LCP). */
  eager?: boolean;
  className?: string;
}

// Las imágenes servidas desde la propia máquina (localhost) no pasan por el
// optimizador de Next.js, que bloquea IPs locales por seguridad.
function isLocal(src: string) {
  try {
    const { hostname, protocol } = new URL(src);
    return protocol === "http:" || ["localhost", "127.0.0.1"].includes(hostname);
  } catch {
    return true;
  }
}

export function ProductImage({ src, alt, sizes, eager = false, className = "" }: Props) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex aspect-square items-center justify-center bg-[#e4ebe8] text-4xl font-bold text-pine-soft/50 ${className}`}
      >
        {alt.trim().charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`relative aspect-square overflow-hidden bg-[#e4ebe8] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        unoptimized={isLocal(src)}
        className="object-cover"
      />
    </div>
  );
}
