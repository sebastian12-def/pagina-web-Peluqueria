import { Check } from "lucide-react";
import React from "react";

export function StatusCard({ status }) {
  return (
    <div className="street-panel flex items-center justify-between rounded-lg p-4">
      <div>
        <p className="text-xs uppercase text-steel">Estado del peluquero</p>
        <h2 className="text-2xl font-black text-white">{status?.label || "Consultando..."}</h2>
      </div>
      <div className="rounded-full bg-acid p-3 text-ink"><Check /></div>
    </div>
  );
}
