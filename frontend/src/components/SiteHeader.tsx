import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Coffee, Menu, Moon, ShoppingBag, Sun, X } from "../icons";
import { useAuth, useCart } from "../state";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("kopikita-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("kopikita-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 12);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname, location.search]);

  return <>
    <div className="topline"><span>Roast segar dari kebun pilihan Nusantara</span><span>Gratis ongkir untuk belanja Rp250.000+</span></div>
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container site-nav">
        <button className="icon mobile menu-toggle" onClick={() => setOpen(value => !value)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="primary-navigation">
          {open ? <X /> : <Menu />}
        </button>
        <Link to="/" className="brand" aria-label="KopiKita, beranda">
          <span className="brand-icon"><Coffee /></span>
          <span>Kopi<span>Kita</span><small>RASA NUSANTARA</small></span>
        </Link>
        <nav id="primary-navigation" className={`site-links${open ? " open" : ""}`} aria-label="Navigasi utama">
          <Link to="/produk">Koleksi</Link>
          <a href="/#cerita">Cerita kami</a>
          <a href="/#pilihan">Pilihan barista</a>
          {user?.role === "ADMIN" && <Link to="/admin/produk">Panel admin</Link>}
        </nav>
        <div className="site-actions">
          <button className="icon theme-toggle" onClick={() => setDark(value => !value)} aria-label={dark ? "Aktifkan tema terang" : "Aktifkan tema gelap"} title={dark ? "Tema terang" : "Tema gelap"}>
            {dark ? <Sun /> : <Moon />}
          </button>
          {user
            ? <div className="account"><Link to={user.role === "ADMIN" ? "/admin/produk" : "/pesanan"}>{user.name.split(" ")[0]}</Link><button onClick={logout}>Keluar</button></div>
            : <Link to="/masuk" className="signin">Masuk <ArrowUpRight size={14} /></Link>}
          <Link className="bag" to="/keranjang" aria-label={`Keranjang, ${count} item`}>
            <ShoppingBag /><span>Keranjang</span><b>{count}</b>
          </Link>
        </div>
      </div>
    </header>
  </>;
}
