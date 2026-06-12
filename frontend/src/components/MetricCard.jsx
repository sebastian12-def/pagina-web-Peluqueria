import { BarChart3 } from "lucide-react";
import React from "react";

export function MetricCard({ label, value, detail }) {
  return (
    <div className="street-panel rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-steel">{label}</p>
        <BarChart3 size={18} className="text-acid" />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-steel">{detail}</p>
    </div>
  );
}
