import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { hashPassword, publicUser, signToken, verifyPassword } from "../utils/auth.js";

export const authRouter = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRouter.post("/register", authLimiter, async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

    if (existing) {
      return res.status(409).json({ message: "Ya existe una cuenta con ese correo." });
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash: await hashPassword(data.password),
        role: "CLIENT"
      }
    });

    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", authLimiter, async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos." });
    }

    return res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: publicUser(req.user) });
});

authRouter.post("/change-password", requireAuth, authLimiter, async (req, res, next) => {
  try {
    const data = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8)
    }).parse(req.body);

    if (!(await verifyPassword(data.currentPassword, req.user.passwordHash))) {
      return res.status(401).json({ message: "La contraseña actual no coincide." });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        passwordHash: await hashPassword(data.newPassword),
        mustChangePassword: false
      }
    });

    return res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});
