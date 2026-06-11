import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { assertSlotAvailable } from "../services/availabilityService.js";

export const clientRouter = Router();

clientRouter.use(requireAuth, requireRole("CLIENT"));

clientRouter.get("/appointments", async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    where: { clientId: req.user.id },
    include: { service: true, payment: true },
    orderBy: { startsAt: "desc" }
  });
  res.json({ appointments });
});

clientRouter.post("/appointments", async (req, res, next) => {
  try {
    const data = z.object({
      serviceId: z.string().min(1),
      startsAt: z.string().datetime(),
      notes: z.string().max(500).optional()
    }).parse(req.body);

    const slot = await assertSlotAvailable(data);
    const appointment = await prisma.appointment.create({
      data: {
        clientId: req.user.id,
        serviceId: data.serviceId,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        notes: data.notes,
        status: "PENDING"
      },
      include: { service: true }
    });

    res.status(201).json({ appointment });
  } catch (error) {
    next(error);
  }
});

clientRouter.patch("/appointments/:id/cancel", async (req, res, next) => {
  try {
    const appointment = await prisma.appointment.findFirst({
      where: { id: req.params.id, clientId: req.user.id }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada." });
    }

    const updated = await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: "CANCELLED" },
      include: { service: true }
    });

    res.json({ appointment: updated });
  } catch (error) {
    next(error);
  }
});
