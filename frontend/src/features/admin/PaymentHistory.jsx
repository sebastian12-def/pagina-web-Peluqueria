import React from "react";
import { formatDateTime, formatMoney } from "../../api.js";
import { paymentText } from "../../lib/display.js";

export function PaymentHistory({ appointments }) {
  if (!appointments.length) return <p className="text-sm text-steel">Todavia no hay pagos registrados.</p>;

  return (
    <div className="space-y-2">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="grid gap-2 rounded-md bg-white/5 p-3 text-sm md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr]">
          <div>
            <p className="font-black text-white">{appointment.client?.name || "Cliente"}</p>
            <p className="text-xs text-steel">{appointment.service.name}</p>
          </div>
          <p className="text-steel">{formatDateTime(appointment.startsAt)}</p>
          <p className="font-bold text-white">{paymentText(appointment.payment.status)}</p>
          <p className="font-black text-acid">{formatMoney(appointment.payment.amountCents || appointment.service.priceCents)}</p>
        </div>
      ))}
    </div>
  );
}
