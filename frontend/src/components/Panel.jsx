import React from "react";

export function Panel({ title, icon, children }) {
  return (
    <section className="street-panel rounded-lg p-4">
      <div className="mb-4 flex items-center gap-2 text-white">
        <span className="text-acid">{icon}</span>
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}
