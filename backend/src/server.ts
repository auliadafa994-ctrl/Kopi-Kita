import app, { prisma } from "./app";
const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "127.0.0.1";
const server = app.listen(port, host, () => console.log(`KopiKita API berjalan di http://${host}:${port}`));
const shutdown = () => server.close(() => void prisma.$disconnect().finally(() => process.exit(0)));
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
