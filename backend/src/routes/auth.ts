import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError, validateBody } from "../lib/http.js";
import { createToken } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  nome: z.string().trim().min(2),
  email: z.string().trim().email().toLowerCase(),
  senha: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  senha: z.string().min(1)
});

router.post(
  "/register",
  asyncHandler(async (request, response) => {
    const data = validateBody(registerSchema, request.body);
    const exists = await prisma.usuario.findUnique({ where: { email: data.email } });

    if (exists) {
      throw new HttpError(409, "E-mail ja cadastrado.");
    }

    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash: await bcrypt.hash(data.senha, 10)
      },
      select: { id: true, nome: true, email: true }
    });

    response.status(201).json({
      usuario,
      token: createToken({ sub: usuario.id, email: usuario.email })
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (request, response) => {
    const data = validateBody(loginSchema, request.body);
    const usuario = await prisma.usuario.findUnique({ where: { email: data.email } });

    if (!usuario || !(await bcrypt.compare(data.senha, usuario.senhaHash))) {
      throw new HttpError(401, "Credenciais invalidas.");
    }

    response.json({
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      token: createToken({ sub: usuario.id, email: usuario.email })
    });
  })
);

export default router;
