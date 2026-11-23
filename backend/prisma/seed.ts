import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const categories = [
  { name: "Arabika Nusantara", slug: "arabika-nusantara", description: "Arabika pilihan dari berbagai daerah Indonesia." },
  { name: "Robusta Pilihan", slug: "robusta-pilihan", description: "Karakter kuat dari perkebunan robusta lokal." },
  { name: "House Blend", slug: "house-blend", description: "Racikan khas KopiKita untuk setiap suasana." }
];
const beans = [
  ["Gayo Wine", "gayo-wine", 135000, "Aceh", "Light", "arabika-nusantara", "Manis buah beri dengan aroma fermentasi lembut."],
  ["Mandheling Heritage", "mandheling-heritage", 118000, "Sumatera Utara", "Medium", "arabika-nusantara", "Body tebal, rempah hangat, dan sentuhan cokelat."],
  ["Java Preanger", "java-preanger", 99000, "Jawa Barat", "Medium", "arabika-nusantara", "Seimbang dengan rasa karamel dan kacang."],
  ["Kintamani Citrus", "kintamani-citrus", 125000, "Bali", "Light", "arabika-nusantara", "Segar dengan nuansa jeruk dan bunga."],
  ["Toraja Kalosi", "toraja-kalosi", 142000, "Sulawesi Selatan", "Medium-dark", "arabika-nusantara", "Rasa kompleks, rempah, dan akhir bersih."],
  ["Flores Bajawa", "flores-bajawa", 112000, "Nusa Tenggara Timur", "Medium", "arabika-nusantara", "Cokelat susu dan karamel dengan acidity lembut."],
  ["Robusta Temanggung", "robusta-temanggung", 78000, "Jawa Tengah", "Dark", "robusta-pilihan", "Kuat dan pekat, cocok untuk espresso dan susu."],
  ["KopiKita House Blend", "kopikita-house-blend", 89000, "Nusantara", "Medium-dark", "house-blend", "Perpaduan arabika dan robusta untuk kopi harian."]
] as const;
async function main() {
  const hash = await bcrypt.hash("KopiKita123!", 12);
  await prisma.user.upsert({ where: { email: "admin@kopikita.local" }, update: {}, create: { name: "Admin KopiKita", email: "admin@kopikita.local", passwordHash: hash, role: UserRole.ADMIN } });
  await prisma.user.upsert({ where: { email: "pelanggan@kopikita.local" }, update: {}, create: { name: "Pelanggan Demo", email: "pelanggan@kopikita.local", passwordHash: hash } });
  for (const cat of categories) {
    const saved = await prisma.category.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
    for (const [name, slug, price, origin, roastLevel, catSlug, description] of beans.filter(p => p[5] === cat.slug)) {
      await prisma.product.upsert({ where: { slug }, update: {}, create: { name, slug, price, origin, roastLevel, description, weight: 200, stock: 25, rating: 4.8, imageUrl: "/images/coffee-beans.svg", categoryId: saved.id } });
    }
  }
  console.log("Seed selesai: 3 kategori, 8 produk, dan akun demo lokal.");
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
