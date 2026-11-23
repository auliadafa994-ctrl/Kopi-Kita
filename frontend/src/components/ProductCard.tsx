import { Link } from "react-router-dom";
import { Heart, Plus } from "../icons";
import { imageFor, Product, rupiah } from "../api";
import { useCart } from "../state";

export function ProductCard({ product, badge }: { product: Product; badge?: string }) {
  const { add } = useCart();

  return <article className="product-card">
    <div className="product-media">
      <Link to={`/produk/${product.slug}`} className="product-image-link" aria-label={`Lihat ${product.name}`}>
        <img src={imageFor(product.imageUrl)} alt={product.name} loading="lazy" />
      </Link>
      {badge && <span className="product-badge">{badge}</span>}
      <button className="wishlist-button" type="button" aria-label={`Simpan ${product.name}`} onClick={event => event.currentTarget.classList.toggle("loved")}>
        <Heart size={17} />
      </button>
      <button className="quick-add" type="button" disabled={!product.stock} aria-label={`Tambah ${product.name} ke keranjang`} onClick={() => add(product)}>
        <Plus size={17} /><span>{product.stock ? "Tambah" : "Habis"}</span>
      </button>
    </div>
    <div className="product-meta"><span>{product.category?.name || "Kopi Nusantara"}</span><span>★ {product.rating.toFixed(1)}</span></div>
    <Link className="product-name" to={`/produk/${product.slug}`}>{product.name}</Link>
    <div className="product-origin">{product.origin} · {product.roastLevel} roast</div>
    <div className="product-price"><b>{rupiah(product.price)}</b><span>{product.weight}g</span></div>
  </article>;
}
