import React from "react";

export function Input({ label, value, onChange, type = "text", ...props }) {
  return (
    <label className="mb-3 block text-sm font-bold text-steel">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-acid" {...props} />
    </label>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <label className="mb-3 block text-sm font-bold text-steel">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-acid">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
