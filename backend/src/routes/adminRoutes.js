import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { assertSlotAvailable } from "../services/availabilityService.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("BARBER_ADMIN"));

adminRouter.get("/appointments", async (_req, res) => {
  const appointments = await prisma.appointment.findMany({
    include: { client: true, service: true, payment: true },
    orderBy: { startsAt: "asc" }
  });
  res.json({ appointments });
});

adminRouter.post("/appointments", async (req, res, next) => {
  try {
    const data = z.object({
      clientId: z.string().min(1),
      serviceId: z.string().min(1),
      startsAt: z.string().datetime(),
      notes: z.string().max(500).optional()
    }).parse(req.body);

    const slot = await assertSlotAvailable(data);
    const appointment = await prisma.appointment.create({
      data: {
        clientId: data.clientId,
        serviceId: data.serviceId,
        createdById: req.user.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        notes: data.notes,
        status: "CONFIRMED"
      },
      include: { client: true, service: true }
    });

    res.status(201).json({ appointment });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/appointments/:id/status", async (req, res, next) => {
  try {
    const data = z.object({
      status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"])
    }).parse(req.body);

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data,
      include: { client: true, service: true, payment: true }
    });

    res.json({ appointment });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/clients", async (_req, res) => {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, phone: true, createdAt: true }
  });
  res.json({ clients });
});

adminRouter.get("/services", async (_req, res) => {
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });
  res.json({ services });
});

adminRouter.post("/services", async (req, res, next) => {
  try {
    const data = serviceSchema.parse(req.body);
    const service = await prisma.service.create({ data });
    res.status(201).json({ service });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/services/:id", async (req, res, next) => {
  try {
    const data = serviceSchema.partial().parse(req.body);
    const service = await prisma.service.update({ where: { id: req.params.id }, data });
    res.json({ service });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/business-hours", async (_req, res) => {
  const businessHours = await prisma.businessHour.findMany({ orderBy: { dayOfWeek: "asc" } });
  res.json({ businessHours });
});

adminRouter.put("/business-hours", async (req, res, next) => {
  try {
    const data = z.array(z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      opensAt: z.string().regex(/^\d{2}:\d{2}$/),
      closesAt: z.string().regex(/^\d{2}:\d{2}$/),
      isOpen: z.boolean()
    })).parse(req.body.businessHours);

    await prisma.$transaction(data.map((item) => prisma.businessHour.upsert({
      where: { dayOfWeek: item.dayOfWeek },
      update: item,
      create: item
    })));

    const businessHours = await prisma.businessHour.findMany({ orderBy: { dayOfWeek: "asc" } });
    res.json({ businessHours });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/blocked-slots", async (req, res, next) => {
  try {
    const data = z.object({
      startsAt: z.string().datetime(),
      endsAt: z.string().datetime(),
      reason: z.string().optional()
    }).parse(req.body);

    const blockedSlot = await prisma.blockedSlot.create({
      data: { ...data, startsAt: new Date(data.startsAt), endsAt: new Date(data.endsAt) }
    });
    res.status(201).json({ blockedSlot });
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/barber-status", async (req, res, next) => {
  try {
    const data = z.object({
      status: z.enum(["AVAILABLE", "BUSY", "PAUSED", "OUT_OF_HOURS"]),
      manualOverride: z.boolean().default(true),
      busyUntil: z.string().datetime().nullable().optional(),
      note: z.string().max(200).nullable().optional()
    }).parse(req.body);

    const payload = {
      ...data,
      busyUntil: data.busyUntil ? new Date(data.busyUntil) : null
    };
    const status = await prisma.barberStatus.upsert({
      where: { key: "default" },
      update: payload,
      create: { key: "default", ...payload }
    });

    res.json({ status });
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/payments/:appointmentId", async (req, res, next) => {
  try {
    const data = z.object({
      amountCents: z.number().int().min(0),
      status: z.enum(["PENDING", "PARTIAL", "PAID"]),
      method: z.string().optional(),
      reference: z.string().optional()
    }).parse(req.body);

    const payment = await prisma.payment.upsert({
      where: { appointmentId: req.params.appointmentId },
      update: data,
      create: { ...data, appointmentId: req.params.appointmentId }
    });

    res.json({ payment });
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/business", async (req, res, next) => {
  try {
    const data = z.object({
      name: z.string().min(2),
      address: z.string().min(5),
      phone: z.string().optional().nullable(),
      instagram: z.string().optional().nullable(),
      qrImageUrl: z.string().url().optional().nullable(),
      latitude: z.number().optional().nullable(),
      longitude: z.number().optional().nullable()
    }).parse(req.body);

    const business = await prisma.businessSetting.upsert({
      where: { key: "default" },
      update: data,
      create: { key: "default", ...data }
    });

    res.json({ business });
  } catch (error) {
    next(error);
  }
});

const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  priceCents: z.number().int().min(0),
  durationMinutes: z.number().int().min(5),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().default(true)
});
