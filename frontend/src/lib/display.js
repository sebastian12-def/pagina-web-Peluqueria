export const today = new Date().toISOString().slice(0, 10);

export function statusText(status) {
  return {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmada",
    COMPLETED: "Atendida",
    CANCELLED: "Cancelada",
    NO_SHOW: "No asistio"
  }[status] || status;
}

export function paymentText(status = "PENDING") {
  return {
    PENDING: "Pago pendiente",
    PARTIAL: "Abonada",
    PAID: "Pagada"
  }[status] || status;
}
