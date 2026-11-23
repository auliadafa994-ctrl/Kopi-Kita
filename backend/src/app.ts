import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma, PrismaClient, OrderStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import { checkoutSchema, shippingFee } from "./rules";

export const prisma = new PrismaClient();
const app = express();
const secret = process.env.JWT_SECRET ?? "";
const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];
app.use(helmet());
app.use(cors({ origin: [process.env.CLIENT_ORIGIN ?? "http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json({ limit: "100kb" }));
type AuthRequest = Request & { auth?: { id: string; role: UserRole } };
type Handler = (req: AuthRequest, res: Response) => Promise<unknown> | unknown;
const route = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(handler(req as AuthRequest, res)).catch(next);
const respond = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });
const problem = (status: number, message: string, details?: unknown) => Object.assign(new Error(message), { status, details });
const parse = <T>(schema: z.ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) throw problem(400, "Data tidak valid", result.error.flatten());
  return result.data;
};
const idSchema = z.object({ id: z.string().min(1) });
const userFields = { id: true, email: true, name: true, role: true } as const;
const auth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return next(problem(401, "Silakan masuk terlebih dahulu"));
  if (secret.length < 32) return next(problem(500, "JWT_SECRET belum dikonfigurasi dengan aman"));
  try {
    const claims = jwt.verify(token, secret) as { sub: string; role: UserRole };
    (req as AuthRequest).auth = { id: claims.sub, role: claims.role };
    next();
  } catch { next(problem(401, "Token tidak valid atau kedaluwarsa")); }
};
const admin = (req: Request, _res: Response, next: NextFunction) => (req as AuthRequest).auth?.role === "ADMIN" ? next() : next(problem(403, "Akses khusus admin"));
const registerSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(254).transform(v => v.toLowerCase()), password: z.string().min(8).max(72) });
const loginSchema = z.object({ email: z.string().email().transform(v => v.toLowerCase()), password: z.string().min(1).max(72) });
const slug = z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const productSchema = z.object({
  name: z.string().trim().min(2).max(120), slug, description: z.string().trim().min(10).max(2000),
  price: z.number().int().positive().max(100000000), weight: z.number().int().positive().max(10000),
  origin: z.string().trim().min(2).max(100), roastLevel: z.string().trim().min(2).max(40),
  stock: z.number().int().min(0).max(100000), rating: z.number().min(0).max(5).default(4.8),
  imageUrl: z.string().max(500).default(""), categoryId: z.string().min(1), active: z.boolean().default(true)
});
const categorySchema = z.object({ name: z.string().trim().min(2).max(80), slug, description: z.string().trim().max(500).default("") });
app.get("/api/health", (_req, res) => respond(res, { status: "ok", service: "kopikita-api" }));
app.post("/api/auth/register", route(async (req, res) => {
  const input = parse(registerSchema, req.body);
  if (secret.length < 32) throw problem(500, "JWT_SECRET belum dikonfigurasi dengan aman");
  if (await prisma.user.findUnique({ where: { email: input.email } })) throw problem(409, "Email sudah terdaftar");
  const { password, ...userData } = input;
  const user = await prisma.user.create({ data: { ...userData, passwordHash: await bcrypt.hash(password, 12) }, select: userFields });
  const token = jwt.sign({ role: user.role }, secret, { subject: user.id, expiresIn });
  respond(res, { user, token }, 201);
}));
app.post("/api/auth/login", route(async (req, res) => {
  const input = parse(loginSchema, req.body);
  if (secret.length < 32) throw problem(500, "JWT_SECRET belum dikonfigurasi dengan aman");
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw problem(401, "Email atau kata sandi salah");
  const token = jwt.sign({ role: user.role }, secret, { subject: user.id, expiresIn });
  respond(res, { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
}));
app.get("/api/auth/me", auth, route(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: (req as AuthRequest).auth!.id }, select: userFields });
  if (!user) throw problem(404, "Pengguna tidak ditemukan");
  respond(res, user);
}));
app.get("/api/categories", route(async (_req, res) => respond(res, await prisma.category.findMany({ orderBy: { name: "asc" } }))));
app.get("/api/products", route(async (req, res) => {
  const q = z.object({ q: z.string().max(100).optional(), category: z.string().optional(), minPrice: z.coerce.number().int().min(0).optional(), maxPrice: z.coerce.number().int().min(0).optional(), sort: z.enum(["newest", "price-asc", "price-desc", "rating"]).default("newest") }).parse(req.query);
  if (q.minPrice !== undefined && q.maxPrice !== undefined && q.minPrice > q.maxPrice) throw problem(400, "Rentang harga tidak valid");
  const orderBy: Prisma.ProductOrderByWithRelationInput = q.sort === "price-asc" ? { price: "asc" } : q.sort === "price-desc" ? { price: "desc" } : q.sort === "rating" ? { rating: "desc" } : { createdAt: "desc" };
  respond(res, await prisma.product.findMany({
    where: { active: true, ...(q.category ? { category: { slug: q.category } } : {}),
      ...(q.q ? { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { origin: { contains: q.q, mode: "insensitive" } }] } : {}),
      ...(q.minPrice !== undefined || q.maxPrice !== undefined ? { price: { ...(q.minPrice !== undefined ? { gte: q.minPrice } : {}), ...(q.maxPrice !== undefined ? { lte: q.maxPrice } : {}) } } : {}) },
    include: { category: true }, orderBy
  }));
}));
app.get("/api/products/:slug", route(async (req, res) => {
  const product = await prisma.product.findFirst({ where: { slug: req.params.slug as string, active: true }, include: { category: true } });
  if (!product) throw problem(404, "Produk tidak ditemukan");
  respond(res, product);
}));
app.post("/api/admin/categories", auth, admin, route(async (req, res) => respond(res, await prisma.category.create({ data: parse(categorySchema, req.body) }), 201)));
app.patch("/api/admin/categories/:id", auth, admin, route(async (req, res) => {
  const { id } = parse(idSchema, req.params); const data = parse(categorySchema.partial(), req.body);
  if (!Object.keys(data).length) throw problem(400, "Tidak ada perubahan");
  respond(res, await prisma.category.update({ where: { id }, data }));
}));
app.delete("/api/admin/categories/:id", auth, admin, route(async (req, res) => {
  const { id } = parse(idSchema, req.params); await prisma.category.delete({ where: { id } }); respond(res, { message: "Kategori dihapus" });
}));
app.post("/api/admin/products", auth, admin, route(async (req, res) => respond(res, await prisma.product.create({ data: parse(productSchema, req.body), include: { category: true } }), 201)));
app.patch("/api/admin/products/:id", auth, admin, route(async (req, res) => {
  const { id } = parse(idSchema, req.params); const data = parse(productSchema.partial(), req.body);
  if (!Object.keys(data).length) throw problem(400, "Tidak ada perubahan");
  respond(res, await prisma.product.update({ where: { id }, data, include: { category: true } }));
}));
app.delete("/api/admin/products/:id", auth, admin, route(async (req, res) => {
  const { id } = parse(idSchema, req.params); respond(res, await prisma.product.update({ where: { id }, data: { active: false } }));
}));
app.post("/api/orders", auth, route(async (req, res) => {
  const input = parse(checkoutSchema, req.body);
  const quantities = new Map<string, number>();
  input.items.forEach(item => quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity));
  const order = await prisma.$transaction(async tx => {
    const products = await tx.product.findMany({ where: { id: { in: [...quantities.keys()] }, active: true } });
    if (products.length !== quantities.size) throw problem(400, "Ada produk yang tidak tersedia");
    let subtotal = 0;
    const items = products.map(product => {
      const quantity = quantities.get(product.id)!;
      if (product.stock < quantity) throw problem(409, `Stok ${product.name} tidak mencukupi`);
      subtotal += product.price * quantity;
      return { productId: product.id, productName: product.name, unitPrice: product.price, quantity, lineTotal: product.price * quantity };
    });
    for (const item of items) {
      const result = await tx.product.updateMany({ where: { id: item.productId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
      if (!result.count) throw problem(409, "Stok berubah. Silakan coba kembali");
    }
    const fee = shippingFee(input.shippingMethod);
    return tx.order.create({ data: {
      userId: (req as AuthRequest).auth!.id, recipientName: input.recipientName, phone: input.phone,
      address: input.address, city: input.city, postalCode: input.postalCode, shippingMethod: input.shippingMethod,
      shippingFee: fee, subtotal, total: subtotal + fee, paymentMethod: input.paymentMethod, items: { create: items }
    }, include: { items: true } });
  });
  respond(res, order, 201);
}));
app.get("/api/orders", auth, route(async (req, res) => respond(res, await prisma.order.findMany({ where: { userId: (req as AuthRequest).auth!.id }, include: { items: true }, orderBy: { createdAt: "desc" } }))));
app.get("/api/orders/:id", auth, route(async (req, res) => {
  const { id } = parse(idSchema, req.params);
  const order = await prisma.order.findFirst({ where: { id, userId: (req as AuthRequest).auth!.id }, include: { items: true } });
  if (!order) throw problem(404, "Pesanan tidak ditemukan");
  respond(res, order);
}));
app.get("/api/admin/orders", auth, admin, route(async (_req, res) => respond(res, await prisma.order.findMany({ include: { items: true, user: { select: userFields } }, orderBy: { createdAt: "desc" } }))));
app.get("/api/admin/orders/:id", auth, admin, route(async (req, res) => {
  const { id } = parse(idSchema, req.params);
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true, user: { select: userFields } } });
  if (!order) throw problem(404, "Pesanan tidak ditemukan");
  respond(res, order);
}));
app.patch("/api/admin/orders/:id/status", auth, admin, route(async (req, res) => {
  const { id } = parse(idSchema, req.params); const { status } = parse(z.object({ status: z.nativeEnum(OrderStatus) }), req.body);
  const updated = await prisma.$transaction(async tx => {
    const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) throw problem(404, "Pesanan tidak ditemukan");
    if (order.status === "CANCELLED" && status !== "CANCELLED") throw problem(409, "Pesanan dibatalkan tidak dapat diaktifkan kembali");
    if (order.status === status) return order;
    const changed = await tx.order.updateMany({ where: { id, status: order.status }, data: { status } });
    if (!changed.count) throw problem(409, "Status pesanan berubah. Muat ulang lalu coba kembali");
    if (status === "CANCELLED" && order.status !== "CANCELLED") {
      for (const item of order.items) await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
    }
    return tx.order.findUniqueOrThrow({ where: { id }, include: { items: true } });
  });
  respond(res, updated);
}));
app.use((_req, _res, next) => next(problem(404, "Rute tidak ditemukan")));
app.use((err: Error & { status?: number; details?: unknown }, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) return res.status(400).json({ success: false, error: { message: "Parameter tidak valid", details: err.flatten() } });
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const status = err.code === "P2025" ? 404 : err.code === "P2002" ? 409 : err.code === "P2003" ? 400 : 500;
    const message = err.code === "P2025" ? "Data tidak ditemukan" : err.code === "P2002" ? "Data sudah digunakan" : err.code === "P2003" ? "Data masih digunakan" : "Kesalahan database";
    return res.status(status).json({ success: false, error: { message } });
  }
  const status = err.status ?? 500;
  return res.status(status).json({ success: false, error: { message: status >= 500 ? "Kesalahan server" : err.message, ...(err.details ? { details: err.details } : {}) } });
});
export default app;
