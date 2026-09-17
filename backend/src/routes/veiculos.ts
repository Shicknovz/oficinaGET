import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, validateBody } from "../lib/http.js";
import { idParamSchema, optionalText } from "../schemas/common.js";

const router = Router();

const veiculoSchema = z.object({
  clienteId: z.string().uuid(),
  placa: z.string().trim().min(7).max(8).transform((value) => value.toUpperCase()),
  marca: z.string().trim().min(1),
  modelo: z.string().trim().min(1),
  ano: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  cor: optionalText,
  quilometragem: z.coerce.number().int().nonnegative().optional().nullable(),
  observacoes: optionalText
});

router.get(
  "/",
  asyncHandler(async (_request, response) => {
    const veiculos = await prisma.veiculo.findMany({
      orderBy: [{ marca: "asc" }, { modelo: "asc" }],
      include: { cliente: true }
    });
    response.json(veiculos);
  })
);

router.post(
  "/",
  asyncHandler(async (request, response) => {
    const data = validateBody(veiculoSchema, request.body);
    const veiculo = await prisma.veiculo.create({ data });
    response.status(201).json(veiculo);
  })
);

router.put(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const data = validateBody(veiculoSchema.partial(), request.body);
    const veiculo = await prisma.veiculo.update({ where: { id }, data });
    response.json(veiculo);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await prisma.veiculo.delete({ where: { id } });
    response.status(204).send();
  })
);

export default router;
