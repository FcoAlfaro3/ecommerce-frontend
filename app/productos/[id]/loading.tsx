export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Cargando producto">
      <div className="skeleton h-4 w-32" />
      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="skeleton aspect-square rounded-xl" />
        <div className="space-y-5">
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-12 w-36" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-11 w-56" />
        </div>
      </div>
    </div>
  );
}
