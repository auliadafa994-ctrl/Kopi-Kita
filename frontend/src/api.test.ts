import { describe, expect, it } from "vitest";
import { rupiah, statusLabels } from "./api";

describe("display helpers", () => {
  it("formats Indonesian rupiah", () => {
    expect(rupiah(125000)).toContain("125.000");
    expect(rupiah(125000)).toContain("Rp");
  });
  it("labels each order state in Indonesian", () => {
    expect(Object.keys(statusLabels)).toHaveLength(5);
    expect(statusLabels.CANCELLED).toBe("Dibatalkan");
  });
});
