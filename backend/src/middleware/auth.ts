import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/env.js";
import { HttpError } from "../lib/http.js";

export type AuthPayload = {
  sub: string;
  email: string;
};

declare module "express-serve-static-core" {
  interface Request {
    usuario?: AuthPayload;
  }
}

export const createToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "8h" });
};

export const authMiddleware: RequestHandler = (request, _response, next) => {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Token de autenticacao ausente.");
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    request.usuario = payload;
    next();
  } catch {
    throw new HttpError(401, "Token de autenticacao invalido ou expirado.");
  }
};
