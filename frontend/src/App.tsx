import { FormEvent, ReactNode, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Coffee, Minus, Plus, Search, ShoppingBag, Trash2, Truck } from "./icons";
import { api, Category, imageFor, Order, Product, rupiah, statusLabels } from "./api";
import { useAuth, useCart } from "./state";
import { ProductCard } from "./components/ProductCard";
import { ProductSkeleton } from "./components/ProductSkeleton";
import { Reveal } from "./components/Reveal";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

function useRemote<T>(path: string) {
  const [data, setData] = useState<T | null>(null); const [error, setError] = useState(""); const [refresh, setRefresh] = useState(0);
  useEffect(() => { let alive = true; setError(""); api<T>(path).then(v => alive && setData(v)).catch(e => alive && setError(e.message)); return () => { alive = false; }; }, [path, refresh]);
  return { data, error, reload: () => setRefresh(n => n + 1) };
}
function Shell({ children }: { children: ReactNode }) { return <><SiteHeader /><main>{children}</main><SiteFooter /></>; }
function Alert({ children, good = false }: { children: ReactNode; good?: boolean }) { return <div className={good ? "alert good" : "alert"}>{children}</div>; }
function Loading() { return <div className="loading"><i />Menyiapkan kopi pilihan...</div>; }
function Grid({ items, empty = "Kopi belum tersedia.", featured = false }: { items: Product[]; empty?: string; featured?: boolean }) {
  return items.length
    ? <div className="grid">{items.map((product, index) => <Reveal key={product.id} className="product-reveal" delay={(index % 4) * 70}><ProductCard product={product} badge={featured && index === 0 ? "Pilihan barista" : product.stock === 0 ? "Stok habis" : undefined} /></Reveal>)}</div>
    : <div className="empty"><Coffee /><p>{empty}</p></div>;
}
function Home() {
  const products = useRemote<Product[]>("/products");
  const categories = useRemote<Category[]>("/categories");
  const [subscribed, setSubscribed] = useState(false);

  return <Shell>
    <section className="hero container">
      <Reveal className="hero-copy">
        <small className="eyebrow">● KOPI SPESIALTI NUSANTARA</small>
        <h1>Cerita baik<br />dimulai dari <em>kopi.</em></h1>
        <p>Dari kebun pilihan, dipanggang dengan penuh perhatian, sampai ke cangkirmu dalam kondisi paling segar.</p>
        <div className="hero-buttons"><Link className="btn dark-btn" to="/produk">Belanja sekarang <ArrowRight size={16} /></Link><a href="#cerita">Kenali KopiKita <ArrowDown size={15} /></a></div>
        <div className="proof"><strong>★ 4,9/5</strong><small>pilihan pencinta kopi lokal</small></div>
      </Reveal>
      <Reveal className="hero-image" delay={100}>
        <img src="/images/coffee-beans.svg" alt="Ilustrasi biji kopi pilihan Nusantara" />
        <span className="stamp">100%<small>biji kopi<br />Indonesia</small></span>
        <small className="caption">KEBUN PILIHAN · ROAST SEGAR</small>
        <div className="hero-note"><span>01 / NUSANTARA</span><b>Asal yang istimewa.<br />Rasa yang dikenang.</b></div>
      </Reveal>
    </section>
    <div className="trust"><div className="container">
      <span><Coffee /> 100% biji kopi lokal</span><span><Truck /> Sangrai segar tiap pekan</span><span><Check /> Petani mitra terpilih</span><span>✦ Pilihan barista Indonesia</span>
    </div></div>
    <section className="section container" id="pilihan">
      <Reveal className="section-head"><div><small className="eyebrow">DIKURASI BARISTA KAMI</small><h2>Teman baik untuk harimu.</h2><p>Kopi pilihan dari kebun terbaik, siap menemani ritme harianmu.</p></div><Link to="/produk">Lihat semua <ArrowRight /></Link></Reveal>
      {products.error ? <Alert>{products.error}</Alert> : products.data ? <Grid items={products.data.slice(0, 4)} featured /> : <ProductSkeleton />}
    </section>
    <section className="categories">
      <div className="container"><Reveal className="section-head"><div><small className="eyebrow">JELAJAHI RASA</small><h2>Cari rasa favoritmu.</h2><p>Setiap daerah punya cerita dan karakter yang berbeda.</p></div></Reveal>
        {categories.error ? <Alert>{categories.error}</Alert> : !categories.data ? <div className="category-loading"><span /><span /><span /></div> : <div className="category-grid">{categories.data.map((category, index) => <Reveal key={category.id} delay={index * 80}><Link className={`category c${index % 3}`} to={`/produk?kategori=${category.slug}`}><small>0{index + 1} / ASAL PILIHAN</small><b>{category.name}</b><span>{category.description}</span><ArrowUpRight /></Link></Reveal>)}</div>}
      </div>
    </section>
    <section className="story container" id="cerita">
      <Reveal className="story-image"><img src="/images/coffee-beans.svg" alt="Ilustrasi biji kopi pilihan" /><span>ROASTED LOCALLY<br />WITH CARE</span></Reveal>
      <Reveal className="story-copy" delay={100}><small className="eyebrow">CERITA DI BALIK SETIAP CANGKIR</small><h2>Rasa yang dekat,<br /><em>cerita yang hangat.</em></h2><p>Kami percaya kopi terbaik bukan cuma soal rasa. Ia adalah tentang tangan-tangan yang merawatnya, tanah yang menumbuhkannya, dan momen kecil yang kita bagi bersamanya.</p><Link to="/produk">Kenali koleksi kami <ArrowRight /></Link></Reveal>
    </section>
    <section className="promo-band"><div className="container promo-content"><span className="promo-kicker">KIRIMAN PERTAMA, LEBIH RINGAN</span><div><h2>Lebih banyak cerita,<br /><em>tanpa ongkir.</em></h2><p>Belanja minimal Rp250.000 dan nikmati gratis ongkir.</p></div><Link className="btn light-btn" to="/produk">Pilih kopi <ArrowRight /></Link><span className="promo-orbit orbit-one" /><span className="promo-orbit orbit-two" /></div></section>
    <section className="section testimonial-section">
      <div className="container"><Reveal className="section-head"><div><small className="eyebrow">CATATAN PENIKMAT KOPI</small><h2>Setiap seduhan punya cerita.</h2><p>Contoh tampilan ulasan — ganti dengan ulasan pelanggan terverifikasi saat tersedia.</p></div></Reveal>
        <div className="testimonial-grid">
          {[["“Wangi saat bungkusnya dibuka saja sudah bikin ingin langsung menyeduh.”", "Catatan pelanggan", "Aceh Gayo"], ["“Rasanya seimbang, enak diminum pelan-pelan di pagi hari.”", "Catatan pelanggan", "Java Preanger"], ["“Kemasan rapi dan kopinya terasa baru disangrai.”", "Catatan pelanggan", "Kintamani Citrus"]].map(([quote, author, coffee], index) => <Reveal key={coffee} delay={index * 80}><article className="testimonial-card"><span className="testimonial-stars">★★★★★</span><blockquote>{quote}</blockquote><div><span className="testimonial-avatar">{coffee.charAt(0)}</span><p><b>{author}</b><small>Menikmati {coffee}</small></p></div></article></Reveal>)}
        </div>
      </div>
    </section>
    <section className="newsletter"><div className="container newsletter-inner"><div><small className="eyebrow">CATATAN DARI ROASTERY</small><h2>Kabar baik, diseduh berkala.</h2><p>Kabar panen baru, cerita petani, dan tips seduh.</p></div>{subscribed ? <p className="newsletter-success" role="status"><Check /> Terima kasih, sampai jumpa di cangkir berikutnya.</p> : <form onSubmit={event => { event.preventDefault(); setSubscribed(true); }}><label className="sr-only" htmlFor="newsletter-email">Alamat email</label><input id="newsletter-email" type="email" placeholder="Alamat email kamu" required /><button className="btn dark-btn">Ikut cerita <ArrowRight /></button></form>}</div></section>
  </Shell>;
}
function Catalog() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [roast, setRoast] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const deferredSearch = useDeferredValue(search);
  const query = useMemo(() => {
    const values = new URLSearchParams();
    if (deferredSearch) values.set("q", deferredSearch);
    if (params.get("kategori")) values.set("category", params.get("kategori")!);
    if (params.get("sort")) values.set("sort", params.get("sort")!);
    return values.toString();
  }, [deferredSearch, params]);
  const products = useRemote<Product[]>(`/products${query ? `?${query}` : ""}`);
  const cats = useRemote<Category[]>("/categories");
  const roastLevels = [...new Set((products.data || []).map(product => product.roastLevel))].sort();
  const filtered = (products.data || []).filter(product =>
    (!roast || product.roastLevel === roast) &&
    (!minPrice || product.price >= Number(minPrice)) &&
    (!maxPrice || product.price <= Number(maxPrice))
  );
  const setCategory = (category?: string) => setParams(previous => {
    const next = new URLSearchParams(previous);
    if (category) next.set("kategori", category);
    else next.delete("kategori");
    return next;
  });

  return <Shell><section className="container page catalog-page">
    <div className="page-title"><small className="eyebrow">DARI KEBUN NUSANTARA</small><h1>Koleksi <em>kopi kami.</em></h1><p>Pilih rasa yang paling pas untuk caramu menikmati hari.</p></div>
    <div className="catalog-toolbar">
      <label className="search-field"><Search /><input type="search" aria-label="Cari kopi berdasarkan nama atau asal" placeholder="Cari nama atau asal kopi..." value={search} onChange={event => setSearch(event.target.value)} /></label>
      <label className="sort-field"><span>Urutkan</span><select value={params.get("sort") || "newest"} onChange={event => setParams(previous => { const next = new URLSearchParams(previous); next.set("sort", event.target.value); return next; })}><option value="newest">Terbaru</option><option value="price-asc">Harga terendah</option><option value="price-desc">Harga tertinggi</option><option value="rating">Rating tertinggi</option></select></label>
    </div>
    <div className="category-chips" aria-label="Filter kategori"><button className={!params.get("kategori") ? "selected" : ""} onClick={() => setCategory()}>Semua kopi</button>{(cats.data || []).map(category => <button className={params.get("kategori") === category.slug ? "selected" : ""} key={category.id} onClick={() => setCategory(category.slug)}>{category.name}</button>)}</div>
    <div className="catalog-layout">
      <aside className="filter-panel"><div className="filter-heading"><b>Filter</b><button type="button" onClick={() => { setRoast(""); setMinPrice(""); setMaxPrice(""); setCategory(); }}>Atur ulang</button></div>
        <label className="filter-label">Rentang harga<div className="price-inputs"><input aria-label="Harga minimum" type="number" min="0" placeholder="Min" value={minPrice} onChange={event => setMinPrice(event.target.value)} /><span>—</span><input aria-label="Harga maksimum" type="number" min="0" placeholder="Maks" value={maxPrice} onChange={event => setMaxPrice(event.target.value)} /></div></label>
        <label className="filter-label">Tingkat sangrai<select value={roast} onChange={event => setRoast(event.target.value)}><option value="">Semua roast</option>{roastLevels.map(level => <option key={level} value={level}>{level}</option>)}</select></label>
      </aside>
      <div className="catalog-results">
        {products.error ? <Alert>{products.error}</Alert> : products.data ? <><div className="result-count"><span>{filtered.length} kopi pilihan</span><span>{params.get("kategori") ? "Kategori terpilih" : "Dari kebun Nusantara"}</span></div>{filtered.length ? <Grid items={filtered} empty="Belum ada kopi yang cocok." /> : <div className="empty large"><Coffee /><h3>Kopi belum ditemukan.</h3><p>Coba sesuaikan kata kunci atau rentang filter.</p><button className="btn dark-btn" onClick={() => { setSearch(""); setRoast(""); setMinPrice(""); setMaxPrice(""); setCategory(); }}>Hapus semua filter</button></div>}</> : <ProductSkeleton />}
      </div>
    </div>
  </section></Shell>;
}
function Detail() {
  const { slug = "" } = useParams();
  const { data: p, error } = useRemote<Product>(`/products/${slug}`);
  const { add } = useCart();
  const relatedPath = p?.category?.slug ? `/products?category=${encodeURIComponent(p.category.slug)}` : "/products";
  const related = useRemote<Product[]>(relatedPath);
  if (error) return <Shell><section className="container page"><Alert>{error}</Alert><Link to="/produk">Kembali ke koleksi</Link></section></Shell>;
  if (!p) return <Shell><Loading /></Shell>;
  const relatedProducts = (related.data || []).filter(product => product.id !== p.id).slice(0, 4);
  return <Shell><section className="container detail">
    <small className="breadcrumb"><Link to="/">Beranda</Link><span>/</span><Link to="/produk">Koleksi</Link><span>/</span>{p.name}</small>
    <div className="detail-grid">
      <Reveal className="detail-visual"><img src={imageFor(p.imageUrl)} alt={p.name} /><span className="detail-image-note">KOPI PILIHAN · {p.origin.toUpperCase()}</span></Reveal>
      <Reveal className="detail-copy" delay={100}><small className="eyebrow">{p.category?.name || "KOPI NUSANTARA"}</small><h1>{p.name}</h1><span className="rating">★ {p.rating.toFixed(1)} <span>·</span> Pilihan penikmat kopi</span><p className="detail-description">{p.description}</p>
        <div className="specs"><span>ASAL<b>{p.origin}</b></span><span>SANGRAI<b>{p.roastLevel}</b></span><span>BERAT<b>{p.weight} gram</b></span></div>
        <div className="detail-buy"><div><strong>{rupiah(p.price)}</strong><small>per kemasan {p.weight}g</small></div><small className={p.stock ? "stock-note" : "stock-note out-of-stock"}>{p.stock ? `${p.stock} kemasan tersedia` : "Stok sedang habis"}</small></div>
        <button disabled={!p.stock} className="btn dark-btn wide" onClick={() => add(p)}><ShoppingBag /> Tambah ke keranjang</button><small className="delivery"><Truck /> Dikemas dengan aman, dikirim dari roastery kami.</small>
      </Reveal>
    </div>
    {relatedProducts.length > 0 && <section className="related-products"><div className="section-head"><div><small className="eyebrow">JELAJAHI LEBIH JAUH</small><h2>Rasa lain yang mungkin kamu suka.</h2></div><Link to="/produk">Semua kopi <ArrowRight /></Link></div><Grid items={relatedProducts} /></section>}
  </section></Shell>;
}
function CartPage() {
  const { lines, update, remove, subtotal } = useCart();
  return <Shell><section className="container page"><div className="page-title left"><small className="eyebrow">SEBELUM DISANGRAI UNTUKMU</small><h1>Keranjang <em>belanja.</em></h1></div>{!lines.length ? <div className="empty large"><ShoppingBag /><h3>Keranjangmu masih kosong.</h3><p>Temukan kopi yang cocok menemani harimu.</p><Link className="btn dark-btn" to="/produk">Jelajahi koleksi <ArrowRight /></Link></div> : <div className="cart-layout"><div>{lines.map(l => <div className="cart-line" key={l.product.id}><img src={imageFor(l.product.imageUrl)} alt="" /><div><Link to={`/produk/${l.product.slug}`}>{l.product.name}</Link><small>{l.product.weight}g · {l.product.origin}</small><b>{rupiah(l.product.price)}</b></div><div className="quantity"><button aria-label="Kurangi" onClick={() => update(l.product.id, l.quantity - 1)}><Minus /></button>{l.quantity}<button aria-label="Tambah" onClick={() => update(l.product.id, l.quantity + 1)}><Plus /></button></div><strong>{rupiah(l.product.price * l.quantity)}</strong><button className="icon" aria-label="Hapus" onClick={() => remove(l.product.id)}><Trash2 /></button></div>)}</div><aside className="summary"><h3>Ringkasan pesanan</h3><div><span>Subtotal</span><b>{rupiah(subtotal)}</b></div><div><span>Ongkir</span><span>Dihitung saat checkout</span></div><hr /><div><b>Total sementara</b><b>{rupiah(subtotal)}</b></div><Link className="btn dark-btn wide" to="/checkout">Lanjut ke checkout <ArrowRight /></Link><small>Simulasi pembayaran lokal; tidak ada transaksi sungguhan.</small></aside></div>}</section></Shell>;
}
function Checkout() {
  const { user } = useAuth(); const { lines, subtotal, clear } = useCart(); const navigate = useNavigate(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const [shipping, setShipping] = useState<"Reguler" | "Kilat">("Reguler");
  if (!user) return <Shell><section className="container page"><Alert>Masuk dahulu untuk checkout.</Alert><Link className="btn dark-btn" to="/masuk?next=/checkout">Masuk</Link></section></Shell>;
  if (!lines.length) return <Navigate to="/keranjang" replace />;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError(""); const f = new FormData(e.currentTarget);
    try { const order = await api<Order>("/orders", { method: "POST", body: JSON.stringify({ items: lines.map(l => ({ productId: l.product.id, quantity: l.quantity })), recipientName: f.get("recipientName"), phone: f.get("phone"), address: f.get("address"), city: f.get("city"), postalCode: f.get("postalCode"), shippingMethod: f.get("shippingMethod"), paymentMethod: f.get("paymentMethod") }) }); clear(); navigate(`/pesanan/${order.id}`); }
    catch (x) { setError(x instanceof Error ? x.message : "Checkout gagal"); } finally { setBusy(false); }
  }
  return <Shell><section className="container page"><div className="page-title left"><small className="eyebrow">TINGGAL SELANGKAH LAGI</small><h1>Atur pengiriman <em>kopimu.</em></h1><p>Hai, {user.name}. Pesananmu disiapkan dengan segar.</p></div><form className="checkout" onSubmit={submit}><div className="form"><h3>Alamat pengiriman</h3>{error && <Alert>{error}</Alert>}<div className="fields"><label>Nama penerima<input name="recipientName" defaultValue={user.name} required minLength={2} maxLength={100} /></label><label>Nomor telepon<input name="phone" required pattern="[+0-9() -]{8,20}" placeholder="+62 812 1234 5678" /></label><label className="full">Alamat lengkap<textarea name="address" required minLength={8} placeholder="Jalan, nomor rumah, RT/RW, patokan" /></label><label>Kota<input name="city" required minLength={2} /></label><label>Kode pos<input name="postalCode" required pattern="[0-9]{5}" maxLength={5} /></label><label>Pengiriman<select name="shippingMethod" value={shipping} onChange={e => setShipping(e.target.value as "Reguler" | "Kilat")}><option>Reguler</option><option>Kilat</option></select></label><label>Pembayaran simulasi<select name="paymentMethod"><option>Transfer Bank (Simulasi)</option><option>QRIS (Simulasi)</option><option>COD</option></select></label></div><div className="mock"><Check /> Pembayaran lokal simulasi. Tidak ada gateway atau transaksi sungguhan.</div></div><aside className="summary"><h3>Pesananmu</h3>{lines.map(l => <div key={l.product.id}><span>{l.product.name} × {l.quantity}</span><b>{rupiah(l.product.price * l.quantity)}</b></div>)}<hr /><div><span>Subtotal</span><b>{rupiah(subtotal)}</b></div><div><span>Ongkir {shipping}</span><span>{rupiah(shipping === "Kilat" ? 30000 : 15000)}</span></div><div><b>Total</b><b>{rupiah(subtotal + (shipping === "Kilat" ? 30000 : 15000))}</b></div><button className="btn dark-btn wide" disabled={busy}>{busy ? "Memproses..." : "Buat pesanan simulasi"} <ArrowRight /></button></aside></form></section></Shell>;
}
function AuthPage() {
  const { login, register, user } = useAuth(); const [params] = useSearchParams(); const nav = useNavigate(); const create = location.pathname === "/daftar"; const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={user.role === "ADMIN" ? "/admin/produk" : "/pesanan"} replace />;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError(""); const f = new FormData(e.currentTarget);
    try { if (create) await register(String(f.get("name")), String(f.get("email")), String(f.get("password"))); else await login(String(f.get("email")), String(f.get("password"))); nav(params.get("next") || "/pesanan"); }
    catch (x) { setError(x instanceof Error ? x.message : "Gagal masuk"); } finally { setBusy(false); }
  }
  return <Shell><section className="container auth"><div className="auth-art"><img src="/images/coffee-beans.svg" alt="" /><h2>Secangkir cerita<br />baik menunggumu.</h2></div><form onSubmit={submit}><small className="eyebrow">{create ? "MULAI PERJALANAN KOPIMU" : "SENANG BERTEMU LAGI"}</small><h1>{create ? "Buat akun." : "Masuk ke akun."}</h1><p>{create ? "Simpan pesanan dan temukan rasa favoritmu." : "Masuk untuk melihat pesanan dan cerita kopimu."}</p>{error && <Alert>{error}</Alert>}{create && <label>Nama lengkap<input name="name" required minLength={2} maxLength={80} /></label>}<label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Kata sandi<input name="password" type="password" required minLength={8} maxLength={72} autoComplete={create ? "new-password" : "current-password"} /></label><button className="btn dark-btn wide" disabled={busy}>{busy ? "Mohon tunggu..." : create ? "Buat akun" : "Masuk"} <ArrowRight /></button><small className="switch">{create ? "Sudah punya akun?" : "Belum punya akun?"} <Link to={create ? "/masuk" : "/daftar"}>{create ? "Masuk di sini" : "Daftar sekarang"}</Link></small></form></section></Shell>;
}
function Orders() {
  const { user } = useAuth(); const { data, error } = useRemote<Order[]>("/orders");
  if (!user) return <Navigate to="/masuk?next=/pesanan" replace />;
  return <Shell><section className="container page"><div className="page-title left"><small className="eyebrow">PERJALANAN KOPIMU</small><h1>Pesanan <em>saya.</em></h1></div>{error ? <Alert>{error}</Alert> : !data ? <Loading /> : !data.length ? <div className="empty large"><Coffee /><h3>Belum ada pesanan.</h3><Link to="/produk" className="btn dark-btn">Mulai jelajahi kopi</Link></div> : <div className="orders">{data.map(o => <Link to={`/pesanan/${o.id}`} className="order" key={o.id}><div><small className="eyebrow">PESANAN · {o.id.slice(-7).toUpperCase()}</small><b>{new Date(o.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</b></div><span className={`status ${o.status.toLowerCase()}`}>{statusLabels[o.status]}</span><div className="order-bottom"><span>{o.items.map(i => `${i.productName} × ${i.quantity}`).join(" · ")}</span><b>{rupiah(o.total)}</b></div></Link>)}</div>}</section></Shell>;
}
function OrderDetail() {
  const { id = "" } = useParams(); const { data: o, error } = useRemote<Order>(`/orders/${id}`);
  return <Shell><section className="container page">{error ? <Alert>{error}</Alert> : !o ? <Loading /> : <><div className="page-title left"><small className="eyebrow">DETAIL PESANAN · {o.id.slice(-7).toUpperCase()}</small><h1>Terima kasih <em>atas pesananmu.</em></h1><p>Pembayaran simulasi lokal; tidak ada transaksi finansial yang terjadi.</p></div><div className="summary order-detail"><div><b>Status pesanan</b><span className={`status ${o.status.toLowerCase()}`}>{statusLabels[o.status]}</span></div><hr />{o.items.map(i => <div key={i.id}><span>{i.productName} × {i.quantity}</span><b>{rupiah(i.lineTotal)}</b></div>)}<hr /><div><span>Subtotal</span><b>{rupiah(o.subtotal)}</b></div><div><span>Pengiriman {o.shippingMethod}</span><b>{rupiah(o.shippingFee)}</b></div><div><b>Total</b><b>{rupiah(o.total)}</b></div><hr /><p><b>Dikirim ke:</b> {o.recipientName}, {o.phone}<br />{o.address}, {o.city}, {o.postalCode}</p><p><b>Pembayaran:</b> {o.paymentMethod} (simulasi)</p></div><Link to="/pesanan">Lihat semua pesanan →</Link></>}</section></Shell>;
}
function Guard({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, ready } = useAuth(); if (!ready) return <Loading />; if (!user) return <Navigate to="/masuk" replace />; if (admin && user.role !== "ADMIN") return <Navigate to="/" replace />; return <>{children}</>;
}
function Admin({ title, children }: { title: string; children: ReactNode }) { return <Shell><section className="container page admin"><header><div><small className="eyebrow">RUANG KERJA KOPIKITA</small><h1>{title}</h1></div><nav><Link to="/admin/produk">Produk</Link><Link to="/admin/kategori">Kategori</Link><Link to="/admin/pesanan">Pesanan</Link></nav></header>{children}</section></Shell>; }
function AdminProducts() {
  const { data, error, reload } = useRemote<Product[]>("/products"); const cats = useRemote<Category[]>("/categories"); const [msg, setMsg] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = e.currentTarget; const f = new FormData(form); const name = String(f.get("name")); const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try { await api("/admin/products", { method: "POST", body: JSON.stringify({ name, slug, description: f.get("description"), price: Number(f.get("price")), weight: Number(f.get("weight")), origin: f.get("origin"), roastLevel: f.get("roastLevel"), stock: Number(f.get("stock")), categoryId: f.get("categoryId"), imageUrl: "/images/coffee-beans.svg", active: true }) }); setMsg("Produk berhasil ditambahkan."); form.reset(); reload(); } catch (x) { setMsg(x instanceof Error ? x.message : "Gagal menyimpan"); }
  }
  async function setStock(p: Product) {
    const value = window.prompt(`Stok baru untuk ${p.name}`, String(p.stock));
    if (value === null) return;
    const stock = Number(value);
    if (!Number.isInteger(stock) || stock < 0) { setMsg("Stok harus berupa bilangan bulat nonnegatif."); return; }
    try { await api(`/admin/products/${p.id}`, { method: "PATCH", body: JSON.stringify({ stock }) }); reload(); }
    catch (x) { setMsg(x instanceof Error ? x.message : "Gagal memperbarui stok"); }
  }
  async function setPrice(p: Product) {
    const value = window.prompt(`Harga baru untuk ${p.name} (IDR)`, String(p.price));
    if (value === null) return;
    const price = Number(value);
    if (!Number.isInteger(price) || price <= 0) { setMsg("Harga harus berupa bilangan bulat positif."); return; }
    try { await api(`/admin/products/${p.id}`, { method: "PATCH", body: JSON.stringify({ price }) }); reload(); }
    catch (x) { setMsg(x instanceof Error ? x.message : "Gagal memperbarui harga"); }
  }
  async function deactivate(id: string) { if (!confirm("Nonaktifkan produk ini?")) return; try { await api(`/admin/products/${id}`, { method: "DELETE" }); reload(); } catch (x) { setMsg(x instanceof Error ? x.message : "Gagal memperbarui"); } }
  return <Admin title="Kelola produk"><div className="admin-cols"><form className="form" onSubmit={submit}><h3>Tambah produk</h3>{msg && <Alert good={msg.includes("berhasil")}>{msg}</Alert>}<label>Nama kopi<input name="name" required minLength={2} /></label><label>Deskripsi<textarea name="description" required minLength={10} /></label><div className="fields"><label>Harga<input name="price" type="number" min="1" required /></label><label>Berat<input name="weight" type="number" min="1" defaultValue="200" required /></label><label>Asal<input name="origin" required /></label><label>Roast<input name="roastLevel" required /></label><label>Stok<input name="stock" type="number" min="0" required /></label><label>Kategori<select name="categoryId" required>{(cats.data || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div><button className="btn dark-btn">Simpan produk</button></form><div className="form"><h3>Daftar produk</h3>{error && <Alert>{error}</Alert>}{!data ? <Loading /> : data.map(p => <div className="admin-row" key={p.id}><div><b>{p.name}</b><small>{p.origin} · {rupiah(p.price)} · Stok {p.stock}</small></div><div className="admin-actions"><button onClick={() => setPrice(p)}>Ubah harga</button><button onClick={() => setStock(p)}>Ubah stok</button><button onClick={() => deactivate(p.id)}>Nonaktifkan</button></div></div>)}</div></div></Admin>;
}
function AdminCategories() {
  const { data, error, reload } = useRemote<Category[]>("/categories"); const [msg, setMsg] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = e.currentTarget; const f = new FormData(form); const name = String(f.get("name")); const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try { await api("/admin/categories", { method: "POST", body: JSON.stringify({ name, slug, description: f.get("description") }) }); setMsg("Kategori ditambahkan."); form.reset(); reload(); } catch (x) { setMsg(x instanceof Error ? x.message : "Gagal menambah"); }
  }
  async function rename(c: Category) {
    const name = window.prompt("Nama kategori", c.name);
    if (!name || name.trim().length < 2) return;
    const slug = name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try { await api(`/admin/categories/${c.id}`, { method: "PATCH", body: JSON.stringify({ name: name.trim(), slug }) }); reload(); }
    catch (x) { setMsg(x instanceof Error ? x.message : "Gagal mengubah kategori"); }
  }
  async function remove(id: string) { if (!confirm("Hapus kategori ini? Kategori yang digunakan tidak dapat dihapus.")) return; try { await api(`/admin/categories/${id}`, { method: "DELETE" }); reload(); } catch (x) { setMsg(x instanceof Error ? x.message : "Gagal menghapus"); } }
  return <Admin title="Kelola kategori"><div className="admin-cols"><form className="form" onSubmit={submit}><h3>Kategori baru</h3>{msg && <Alert>{msg}</Alert>}<label>Nama<input name="name" required minLength={2} /></label><label>Deskripsi<textarea name="description" /></label><button className="btn dark-btn">Tambah kategori</button></form><div className="form"><h3>Kategori aktif</h3>{error && <Alert>{error}</Alert>}{!data ? <Loading /> : data.map(c => <div className="admin-row" key={c.id}><div><b>{c.name}</b><small>/{c.slug} · {c.description}</small></div><div className="admin-actions"><button onClick={() => rename(c)}>Ubah</button><button onClick={() => remove(c.id)}>Hapus</button></div></div>)}</div></div></Admin>;
}
function AdminOrders() {
  const { data, error, reload } = useRemote<Order[]>("/admin/orders");
  async function changeStatus(id: string, value: string) { try { await api(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: value }) }); reload(); } catch (x) { alert(x instanceof Error ? x.message : "Gagal memperbarui status"); } }
  return <Admin title="Kelola pesanan"><div className="form">{error && <Alert>{error}</Alert>}{!data ? <Loading /> : !data.length ? <p>Belum ada pesanan.</p> : data.map(o => <div className="admin-row" key={o.id}><div><b>{o.user?.name || o.recipientName} · {rupiah(o.total)}</b><small>{o.id.slice(-8).toUpperCase()} · {o.items.map(i => `${i.productName} ×${i.quantity}`).join(", ")}</small></div><select aria-label="Status pesanan" value={o.status} onChange={e => changeStatus(o.id, e.target.value)}>{Object.entries(statusLabels).map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></div>)}</div></Admin>;
}
function NotFound() { return <Shell><section className="container empty large"><Coffee /><h2>Halaman tidak ditemukan.</h2><Link className="btn dark-btn" to="/">Kembali ke beranda</Link></section></Shell>; }
export default function App() {
  const { ready } = useAuth(); if (!ready) return <Loading />;
  return <Routes><Route path="/" element={<Home />} /><Route path="/produk" element={<Catalog />} /><Route path="/produk/:slug" element={<Detail />} /><Route path="/keranjang" element={<CartPage />} /><Route path="/checkout" element={<Checkout />} /><Route path="/masuk" element={<AuthPage />} /><Route path="/daftar" element={<AuthPage />} /><Route path="/pesanan" element={<Guard><Orders /></Guard>} /><Route path="/pesanan/:id" element={<Guard><OrderDetail /></Guard>} /><Route path="/admin/produk" element={<Guard admin><AdminProducts /></Guard>} /><Route path="/admin/kategori" element={<Guard admin><AdminCategories /></Guard>} /><Route path="/admin/pesanan" element={<Guard admin><AdminOrders /></Guard>} /><Route path="*" element={<NotFound />} /></Routes>;
}
