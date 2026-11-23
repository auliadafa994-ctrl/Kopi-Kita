import { z } from "zod";
export const orderStatuses = ["PENDING_PAYMENT", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const;
export const checkoutSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(50) })).min(1).max(30),
  recipientName: z.string().trim().min(2).max(100), phone: z.string().trim().regex(/^[+0-9() -]{8,20}$/),
  address: z.string().trim().min(8).max(300), city: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().regex(/^[0-9]{5}$/), shippingMethod: z.enum(["Reguler", "Kilat"]),
  paymentMethod: z.enum(["Transfer Bank (Simulasi)", "QRIS (Simulasi)", "COD"])
});
export const shippingFee = (method: "Reguler" | "Kilat") => method === "Kilat" ? 30000 : 15000;
