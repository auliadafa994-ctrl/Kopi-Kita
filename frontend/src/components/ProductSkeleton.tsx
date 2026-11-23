export function ProductSkeleton({ count = 4 }: { count?: number }) {
  return <div className="grid product-skeletons" aria-label="Memuat produk" aria-busy="true">
    {Array.from({ length: count }, (_, index) => <div className="skeleton-card" key={index}>
      <div className="skeleton-block skeleton-image" />
      <div className="skeleton-block skeleton-line short" />
      <div className="skeleton-block skeleton-line" />
      <div className="skeleton-block skeleton-line price-line" />
    </div>)}
  </div>;
}
