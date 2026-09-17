import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, validateBody } from "../lib/http.js";
import { idParamSchema, money, optionalText } from "../schemas/common.js";

const router = Router();

const transacaoSchema = z.object({
  ordemServicoId: z.string().uuid().optional().nullable(),
  tipo: z.string().trim().min(1),
  descricao: z.string().trim().min(1),
  valor: money,
  data: z.coerce.date(),
  categoria: optionalText,
  formaPagamento: optionalText
});

router.get(
  "/",
  asyncHandler(async (_request, response) => {
    const transacoes = await prisma.transacaoFinanceira.findMany({
      orderBy: { data: "desc" },
      include: { ordemServico: true }
    });
    response.json(transacoes);
  })
);

router.post(
  "/",
  asyncHandler(async (request, response) => {
    const data = validateBody(transacaoSchema, request.body);
    const transacao = await prisma.transacaoFinanceira.create({ data });
    response.status(201).json(transacao);
  })
);

router.put(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const data = validateBody(transacaoSchema.partial(), request.body);
    const transacao = await prisma.transacaoFinanceira.update({ where: { id }, data });
    response.json(transacao);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await prisma.transacaoFinanceira.delete({ where: { id } });
    response.status(204).send();
  })
);

export default router;
