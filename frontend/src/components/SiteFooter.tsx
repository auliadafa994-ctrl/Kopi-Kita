import { Link } from "react-router-dom";
import { Coffee } from "../icons";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <Link to="/" className="brand" aria-label="KopiKita, beranda">
          <span className="brand-icon"><Coffee /></span>
          <span>KopiKita<small>RASA NUSANTARA</small></span>
        </Link>
        <p>Secangkir cerita baik, disangrai segar dari kebun terbaik Indonesia.</p>
        <div className="social-links" aria-label="Media sosial">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <span>↗</span></a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">TikTok <span>↗</span></a>
        </div>
      </div>
      <div className="footer-column"><b>Jelajahi</b><Link to="/produk">Semua kopi</Link><Link to="/keranjang">Keranjang</Link><Link to="/pesanan">Pesanan saya</Link></div>
      <div className="footer-column"><b>Bantuan</b><a href="mailto:halo@kopikita.local">halo@kopikita.local</a><span>Senin–Sabtu, 09.00–17.00</span><span>Jakarta, Indonesia</span></div>
      <div className="footer-note"><span className="footer-bean">01 / 03</span><p>Diracik dengan hati,<br />dinikmati dengan tenang.</p><small>© 2026 KopiKita</small></div>
    </div>
  </footer>;
}
