export type Category = { id: string; name: string; slug: string; description: string };
export type Product = { id: string; name: string; slug: string; description: string; price: number; weight: number; origin: string; roastLevel: string; stock: number; rating: number; imageUrl: string; active: boolean; categoryId: string; category?: Category };
export type User = { id: string; name: string; email: string; role: "CUSTOMER" | "ADMIN" };
export type Order = { id: string; recipientName: string; phone: string; address: string; city: string; postalCode: string; shippingMethod: string; shippingFee: number; subtotal: number; total: number; paymentMethod: string; status: "PENDING_PAYMENT" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED"; createdAt: string; items: { id: string; productId: string; productName: string; unitPrice: number; quantity: number; lineTotal: number }[]; user?: User };
const base = import.meta.env.VITE_API_URL || "http://127.0.0.1:4000/api";
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("kopikita-token");
  const response = await fetch(`${base}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  const body = await response.json().catch(() => null) as { success?: boolean; data?: T; error?: { message?: string } } | null;
  if (!response.ok || !body?.success) throw new Error(body?.error?.message || "Tidak dapat menghubungi server.");
  return body.data as T;
}
export const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
export const imageFor = (path?: string) => path?.startsWith("/") ? path : "/images/coffee-beans.svg";
export const statusLabels: Record<Order["status"], string> = { PENDING_PAYMENT: "Menunggu pembayaran", PROCESSING: "Diproses", SHIPPED: "Dikirim", COMPLETED: "Selesai", CANCELLED: "Dibatalkan" };
