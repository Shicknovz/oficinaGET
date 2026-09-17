import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, validateBody } from "../lib/http.js";
import { idParamSchema, money, optionalText } from "../schemas/common.js";

const router = Router();

const itemSchema = z.object({
  tipo: z.string().trim().min(1),
  descricao: z.string().trim().min(1),
  quantidade: money.default(1),
  valorUnitario: money.default(0),
  valorTotal: money.default(0)
});

const ordemSchema = z.object({
  clienteId: z.string().uuid(),
  veiculoId: z.string().uuid(),
  numero: optionalText,
  status: z.string().trim().min(1),
  descricao: z.string().trim().min(1),
  diagnostico: optionalText,
  valorTotal: money.default(0),
  dataFechamento: z.coerce.date().optional().nullable(),
  itens: z.array(itemSchema).default([])
});

router.get(
  "/",
  asyncHandler(async (_request, response) => {
    const ordens = await prisma.ordemServico.findMany({
      orderBy: { dataAbertura: "desc" },
      include: {
        cliente: true,
        veiculo: true,
        itens: true
      }
    });
    response.json(ordens);
  })
);

router.post(
  "/",
  asyncHandler(async (request, response) => {
    const data = validateBody(ordemSchema, request.body);
    const { itens, ...ordemData } = data;
    const ordem = await prisma.ordemServico.create({
      data: {
        ...ordemData,
        itens: { create: itens }
      },
      include: { itens: true }
    });
    response.status(201).json(ordem);
  })
);

router.put(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const data = validateBody(ordemSchema.partial(), request.body);
    const { itens, ...ordemData } = data;

    const ordem = await prisma.$transaction(async (transaction) => {
      if (itens) {
        await transaction.itemOrdemServico.deleteMany({ where: { ordemServicoId: id } });
      }

      return transaction.ordemServico.update({
        where: { id },
        data: {
          ...ordemData,
          ...(itens ? { itens: { create: itens } } : {})
        },
        include: { itens: true }
      });
    });

    response.json(ordem);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await prisma.ordemServico.delete({ where: { id } });
    response.status(204).send();
  })
);

export default router;
