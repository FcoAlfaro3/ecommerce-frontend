export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl" aria-busy="true" aria-label="Cargando el pago">
      <div className="skeleton h-9 w-60" />
      <div className="skeleton mb-6 mt-3 h-4 w-80" />
      <div className="space-y-px overflow-hidden rounded-xl border border-line bg-surface">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex justify-between px-5 py-4">
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-4 w-16" />
          </div>
        ))}
        <div className="px-5 py-5">
          <div className="skeleton h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
