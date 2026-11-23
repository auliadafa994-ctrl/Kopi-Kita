import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { api, Product, User } from "./api";

type Auth = { user: User | null; ready: boolean; login: (email: string, password: string) => Promise<void>; register: (name: string, email: string, password: string) => Promise<void>; logout: () => void };
type Line = { product: Product; quantity: number };
type Cart = { lines: Line[]; add: (p: Product) => void; update: (id: string, n: number) => void; remove: (id: string) => void; clear: () => void; count: number; subtotal: number };
const AuthContext = createContext<Auth | null>(null);
const CartContext = createContext<Cart | null>(null);
export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<Line[]>(() => { try { return JSON.parse(localStorage.getItem("kopikita-cart") || "[]") as Line[]; } catch { return []; } });
  useEffect(() => { if (!localStorage.getItem("kopikita-token")) { setReady(true); return; } api<User>("/auth/me").then(setUser).catch(() => localStorage.removeItem("kopikita-token")).finally(() => setReady(true)); }, []);
  useEffect(() => { localStorage.setItem("kopikita-cart", JSON.stringify(lines)); }, [lines]);
  const authenticate = async (path: string, body: object) => { const result = await api<{ user: User; token: string }>(path, { method: "POST", body: JSON.stringify(body) }); localStorage.setItem("kopikita-token", result.token); setUser(result.user); };
  const auth = useMemo<Auth>(() => ({ user, ready, login: (email, password) => authenticate("/auth/login", { email, password }), register: (name, email, password) => authenticate("/auth/register", { name, email, password }), logout: () => { localStorage.removeItem("kopikita-token"); setUser(null); } }), [user, ready]);
  const cart = useMemo<Cart>(() => ({
    lines, add: product => setLines(old => { const current = old.find(v => v.product.id === product.id); return current ? old.map(v => v.product.id === product.id ? { ...v, quantity: Math.min(v.quantity + 1, product.stock) } : v) : [...old, { product, quantity: 1 }]; }),
    update: (id, n) => setLines(old => old.map(v => v.product.id === id ? { ...v, quantity: Math.max(1, Math.min(n, v.product.stock)) } : v)),
    remove: id => setLines(old => old.filter(v => v.product.id !== id)), clear: () => setLines([]),
    count: lines.reduce((n, v) => n + v.quantity, 0), subtotal: lines.reduce((n, v) => n + v.product.price * v.quantity, 0)
  }), [lines]);
  return <AuthContext.Provider value={auth}><CartContext.Provider value={cart}>{children}</CartContext.Provider></AuthContext.Provider>;
}
export const useAuth = () => { const v = useContext(AuthContext); if (!v) throw new Error("Auth provider missing"); return v; };
export const useCart = () => { const v = useContext(CartContext); if (!v) throw new Error("Cart provider missing"); return v; };
