import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, validateBody } from "../lib/http.js";
import { idParamSchema, money, optionalText } from "../schemas/common.js";

const router = Router();

const pecaSchema = z.object({
  nome: z.string().trim().min(1),
  codigo: optionalText,
  fabricante: optionalText,
  quantidade: z.coerce.number().int().nonnegative().default(0),
  estoqueMinimo: z.coerce.number().int().nonnegative().default(0),
  valorCusto: money.default(0),
  valorVenda: money.default(0)
});

router.get(
  "/",
  asyncHandler(async (_request, response) => {
    const pecas = await prisma.peca.findMany({ orderBy: { nome: "asc" } });
    response.json(pecas);
  })
);

router.post(
  "/",
  asyncHandler(async (request, response) => {
    const data = validateBody(pecaSchema, request.body);
    const peca = await prisma.peca.create({ data });
    response.status(201).json(peca);
  })
);

router.put(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const data = validateBody(pecaSchema.partial(), request.body);
    const peca = await prisma.peca.update({ where: { id }, data });
    response.json(peca);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await prisma.peca.delete({ where: { id } });
    response.status(204).send();
  })
);

export default router;
