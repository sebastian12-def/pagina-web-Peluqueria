import { LogOut } from "lucide-react";
import React from "react";

export function Shell({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-white/10 bg-black/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase text-acid">Peluquería Urbana</p>
            <h1 className="text-xl font-black text-white">Reservas, agenda y pagos manuales.</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-steel sm:inline">{user.name}</span>
            <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-ink">
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
