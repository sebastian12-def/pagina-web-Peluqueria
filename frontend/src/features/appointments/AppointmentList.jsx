import { Wallet } from "lucide-react";
import React from "react";
import { formatDateTime } from "../../api.js";
import { paymentText, statusText } from "../../lib/display.js";

export function AppointmentList({ appointments, compact = false, onStatus, onPayment, onCancel }) {
  if (!appointments.length) return <p className="text-sm text-steel">No hay citas registradas.</p>;

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="rounded-md bg-white/5 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-black text-white">{appointment.service.name}</p>
              <p className="text-sm text-steel">{formatDateTime(appointment.startsAt)} - {formatDateTime(appointment.endsAt)}</p>
              {!compact && <p className="text-sm text-steel">Cliente: {appointment.client?.name} - {appointment.client?.phone}</p>}
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold uppercase">
                <span className="rounded bg-acid/20 px-2 py-1 text-acid">{statusText(appointment.status)}</span>
                <span className="rounded bg-white/10 px-2 py-1 text-white"><Wallet size={13} className="mr-1 inline" />{paymentText(appointment.payment?.status)}</span>
              </div>
            </div>
            {onStatus && <div className="flex flex-wrap gap-2">
              {["CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"].map((status) => (
                <button key={status} onClick={() => onStatus(appointment.id, status)} className="rounded bg-white px-2 py-1 text-xs font-black text-ink">{statusText(status)}</button>
              ))}
            </div>}
            {onPayment && <div className="flex flex-wrap gap-2">
              {["PENDING", "PARTIAL", "PAID"].map((status) => (
                <button key={status} onClick={() => onPayment(appointment, status)} className="rounded bg-acid px-2 py-1 text-xs font-black text-ink">{paymentText(status)}</button>
              ))}
            </div>}
            {onCancel && appointment.status !== "CANCELLED" && <button onClick={() => onCancel(appointment.id)} className="rounded bg-white/10 px-2 py-1 text-xs font-black text-white">Cancelar</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
