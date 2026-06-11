import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../db.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token requerido." });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Sesion invalida o expirada." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permiso para esta accion." });
    }

    next();
  };
}
