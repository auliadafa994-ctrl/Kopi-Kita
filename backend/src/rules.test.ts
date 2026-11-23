import { describe, expect, it } from "vitest";
import { checkoutSchema, orderStatuses, shippingFee } from "./rules";
describe("checkout rules", () => {
  const input = { items: [{ productId: "p1", quantity: 2 }], recipientName: "Rani", phone: "+62 812 1234 5678", address: "Jalan Melati nomor 10", city: "Bandung", postalCode: "40123", shippingMethod: "Reguler", paymentMethod: "QRIS (Simulasi)" };
  it("validates delivery details and quantities", () => {
    expect(checkoutSchema.safeParse(input).success).toBe(true);
    expect(checkoutSchema.safeParse({ ...input, postalCode: "123" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...input, items: [{ productId: "p1", quantity: 0 }] }).success).toBe(false);
  });
  it("defines order states and local fees", () => {
    expect(orderStatuses).toHaveLength(5);
    expect(shippingFee("Reguler")).toBe(15000);
    expect(shippingFee("Kilat")).toBe(30000);
  });
});
