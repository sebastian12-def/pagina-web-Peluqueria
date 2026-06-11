import { prisma } from "../db.js";
import { addMinutes, parseDayTime, overlaps, toTimeString } from "../utils/time.js";

export async function getBusinessSetting() {
  return prisma.businessSetting.findFirst();
}

export async function getEffectiveBarberStatus(now = new Date()) {
  const manual = await prisma.barberStatus.findFirst();
  const dayOfWeek = now.getDay();
  const businessHour = await prisma.businessHour.findFirst({ where: { dayOfWeek } });

  if (!businessHour?.isOpen) {
    return { status: "OUT_OF_HOURS", label: "Fuera de horario", busyUntil: null, source: "automatic" };
  }

  const opensAt = parseDayTime(now, businessHour.opensAt);
  const closesAt = parseDayTime(now, businessHour.closesAt);

  if (now < opensAt || now >= closesAt) {
    return { status: "OUT_OF_HOURS", label: "Fuera de horario", busyUntil: null, source: "automatic" };
  }

  if (manual?.manualOverride) {
    if (manual.busyUntil && manual.busyUntil <= now) {
      await prisma.barberStatus.update({
        where: { id: manual.id },
        data: { manualOverride: false, busyUntil: null, status: "AVAILABLE", note: null }
      });
    } else {
      return {
        status: manual.status,
        label: statusLabel(manual.status, manual.busyUntil),
        busyUntil: manual.busyUntil,
        source: "manual"
      };
    }
  }

  const activeAppointment = await prisma.appointment.findFirst({
    where: {
      startsAt: { lte: now },
      endsAt: { gt: now },
      status: { in: ["PENDING", "CONFIRMED"] }
    },
    orderBy: { endsAt: "asc" }
  });

  if (activeAppointment) {
    return {
      status: "BUSY",
      label: `Ocupado hasta las ${toTimeString(activeAppointment.endsAt)}`,
      busyUntil: activeAppointment.endsAt,
      source: "automatic"
    };
  }

  return { status: "AVAILABLE", label: "Disponible ahora", busyUntil: null, source: "automatic" };
}

export async function assertSlotAvailable({ serviceId, startsAt, appointmentIdToIgnore }) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.isActive) {
    const error = new Error("Servicio no disponible.");
    error.status = 400;
    throw error;
  }

  const start = new Date(startsAt);
  const end = addMinutes(start, service.durationMinutes);
  const dayOfWeek = start.getDay();
  const businessHour = await prisma.businessHour.findFirst({ where: { dayOfWeek } });

  if (!businessHour?.isOpen) {
    const error = new Error("El negocio no abre ese dia.");
    error.status = 400;
    throw error;
  }

  const open = parseDayTime(start, businessHour.opensAt);
  const close = parseDayTime(start, businessHour.closesAt);

  if (start < open || end > close) {
    const error = new Error("La cita esta fuera del horario laboral.");
    error.status = 400;
    throw error;
  }

  const blocked = await prisma.blockedSlot.findFirst({
    where: { startsAt: { lt: end }, endsAt: { gt: start } }
  });

  if (blocked) {
    const error = new Error("Ese horario esta bloqueado.");
    error.status = 409;
    throw error;
  }

  const existing = await prisma.appointment.findFirst({
    where: {
      id: appointmentIdToIgnore ? { not: appointmentIdToIgnore } : undefined,
      status: { in: ["PENDING", "CONFIRMED"] },
      startsAt: { lt: end },
      endsAt: { gt: start }
    }
  });

  if (existing) {
    const error = new Error("Ese horario ya esta reservado.");
    error.status = 409;
    throw error;
  }

  return { service, startsAt: start, endsAt: end };
}

export async function getAvailableSlots({ date, serviceId }) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return [];

  const baseDate = new Date(`${date}T00:00:00`);
  const businessHour = await prisma.businessHour.findFirst({ where: { dayOfWeek: baseDate.getDay() } });
  if (!businessHour?.isOpen) return [];

  const open = parseDayTime(baseDate, businessHour.opensAt);
  const close = parseDayTime(baseDate, businessHour.closesAt);
  const appointments = await prisma.appointment.findMany({
    where: {
      startsAt: { lt: close },
      endsAt: { gt: open },
      status: { in: ["PENDING", "CONFIRMED"] }
    }
  });
  const blockedSlots = await prisma.blockedSlot.findMany({
    where: { startsAt: { lt: close }, endsAt: { gt: open } }
  });

  const slots = [];
  const interval = 15;
  for (let slotStart = open; addMinutes(slotStart, service.durationMinutes) <= close; slotStart = addMinutes(slotStart, interval)) {
    const slotEnd = addMinutes(slotStart, service.durationMinutes);
    const busy = appointments.some((item) => overlaps(slotStart, slotEnd, item.startsAt, item.endsAt));
    const blocked = blockedSlots.some((item) => overlaps(slotStart, slotEnd, item.startsAt, item.endsAt));

    if (!busy && !blocked && slotStart > new Date()) {
      slots.push({ startsAt: slotStart, endsAt: slotEnd, label: toTimeString(slotStart) });
    }
  }

  return slots;
}

function statusLabel(status, busyUntil) {
  if (status === "AVAILABLE") return "Disponible ahora";
  if (status === "BUSY" && busyUntil) return `Ocupado hasta las ${toTimeString(busyUntil)}`;
  if (status === "BUSY") return "Ocupado";
  if (status === "PAUSED") return "Pausado";
  return "Fuera de horario";
}
