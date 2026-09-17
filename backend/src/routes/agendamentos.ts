import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, validateBody } from "../lib/http.js";
import { idParamSchema, optionalText } from "../schemas/common.js";

const router = Router();

const agendamentoSchema = z.object({
  clienteId: z.string().uuid(),
  veiculoId: z.string().uuid().optional().nullable(),
  titulo: z.string().trim().min(1),
  descricao: optionalText,
  data: z.coerce.date(),
  status: z.string().trim().min(1)
});

router.get(
  "/",
  asyncHandler(async (_request, response) => {
    const agendamentos = await prisma.agendamento.findMany({
      orderBy: { data: "asc" },
      include: { cliente: true, veiculo: true }
    });
    response.json(agendamentos);
  })
);

router.post(
  "/",
  asyncHandler(async (request, response) => {
    const data = validateBody(agendamentoSchema, request.body);
    const agendamento = await prisma.agendamento.create({ data });
    response.status(201).json(agendamento);
  })
);

router.put(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const data = validateBody(agendamentoSchema.partial(), request.body);
    const agendamento = await prisma.agendamento.update({ where: { id }, data });
    response.json(agendamento);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await prisma.agendamento.delete({ where: { id } });
    response.status(204).send();
  })
);

export default router;
