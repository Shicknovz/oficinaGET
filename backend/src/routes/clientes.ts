import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, validateBody } from "../lib/http.js";
import { idParamSchema, optionalText } from "../schemas/common.js";

const router = Router();

const clienteSchema = z.object({
  nome: z.string().trim().min(2),
  telefone: z.string().trim().min(8),
  email: z.string().trim().email().optional().nullable(),
  documento: optionalText,
  endereco: optionalText,
  observacoes: optionalText
});

router.get(
  "/",
  asyncHandler(async (_request, response) => {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: "asc" },
      include: { veiculos: true }
    });
    response.json(clientes);
  })
);

router.post(
  "/",
  asyncHandler(async (request, response) => {
    const data = validateBody(clienteSchema, request.body);
    const cliente = await prisma.cliente.create({ data });
    response.status(201).json(cliente);
  })
);

router.put(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const data = validateBody(clienteSchema.partial(), request.body);
    const cliente = await prisma.cliente.update({ where: { id }, data });
    response.json(cliente);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await prisma.cliente.delete({ where: { id } });
    response.status(204).send();
  })
);

export default router;
