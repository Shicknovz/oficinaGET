import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { env } from "./lib/env.js";
import { HttpError } from "./lib/http.js";
import { prisma } from "./lib/prisma.js";
import { authMiddleware } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import clientesRoutes from "./routes/clientes.js";
import veiculosRoutes from "./routes/veiculos.js";
import ordensRoutes from "./routes/ordens.js";
import agendamentosRoutes from "./routes/agendamentos.js";
import pecasRoutes from "./routes/pecas.js";
import financeiroRoutes from "./routes/financeiro.js";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN }));
app.use(express.json({ limit: "2mb" }));

app.get("/health", async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.json({ status: "ok", database: "ok" });
  } catch {
    response.status(503).json({ status: "degraded", database: "unavailable" });
  }
});

app.use("/auth", authRoutes);
app.use("/clientes", authMiddleware, clientesRoutes);
app.use("/veiculos", authMiddleware, veiculosRoutes);
app.use("/ordens", authMiddleware, ordensRoutes);
app.use("/agendamentos", authMiddleware, agendamentosRoutes);
app.use("/pecas", authMiddleware, pecasRoutes);
app.use("/financeiro", authMiddleware, financeiroRoutes);

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({ message: error.message });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    response.status(400).json({ message: "Operacao invalida para os dados informados." });
    return;
  }

  response.status(500).json({ message: "Erro interno do servidor." });
};

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`OficinaPro API rodando na porta ${env.PORT}`);
});
