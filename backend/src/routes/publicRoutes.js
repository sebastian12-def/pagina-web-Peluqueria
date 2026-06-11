import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { getAvailableSlots, getBusinessSetting, getEffectiveBarberStatus } from "../services/availabilityService.js";

export const publicRouter = Router();

publicRouter.get("/services", async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });
  res.json({ services });
});

publicRouter.get("/business", async (_req, res) => {
  const business = await getBusinessSetting();
  res.json({ business });
});

publicRouter.get("/barber-status", async (_req, res) => {
  const status = await getEffectiveBarberStatus();
  res.json(status);
});

publicRouter.get("/availability", async (req, res, next) => {
  try {
    const query = z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      serviceId: z.string().min(1)
    }).parse(req.query);

    const slots = await getAvailableSlots(query);
    res.json({ slots });
  } catch (error) {
    next(error);
  }
});
