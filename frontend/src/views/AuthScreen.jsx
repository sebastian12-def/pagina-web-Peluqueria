import { Shield, User } from "lucide-react";
import React, { useState } from "react";
import { api, setSession } from "../api.js";
import { Input } from "../components/forms.jsx";

export function AuthScreen({ view, setView, onAuth }) {
  const isRegister = view === "register";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await api("/api/auth/register", { method: "POST", body: form });
        setView("login");
        return;
      }

      const session = await api("/api/auth/login", {
        method: "POST",
        body: { email: form.email, password: form.password }
      });
      setSession(session);
      onAuth(session.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="grid min-h-screen bg-ink lg:grid-cols-[1.1fr_0.9fr]">
      <section className="flex min-h-[42vh] flex-col justify-end bg-[linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,.8)),url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center p-6 lg:min-h-screen lg:p-12">
        <p className="mb-3 w-fit bg-acid px-3 py-1 text-xs font-black uppercase text-ink">Reservas online</p>
        <h1 className="max-w-2xl text-5xl font-black leading-none text-white md:text-7xl">Agenda urbana para barbería.</h1>
        <p className="mt-5 max-w-xl text-lg text-steel">Clientes reservan desde el celular. El peluquero controla citas, servicios, pagos manuales y disponibilidad.</p>
      </section>
      <section className="flex items-center justify-center px-4 py-8">
        <form onSubmit={submit} className="street-panel w-full max-w-md rounded-lg p-6">
          <div className="mb-6 flex items-center gap-3">
            {isRegister ? <User className="text-acid" /> : <Shield className="text-acid" />}
            <div>
              <h2 className="text-2xl font-black text-white">{isRegister ? "Registro de clientes" : "Inicio de sesión"}</h2>
              <p className="text-sm text-steel">{isRegister ? "El registro público es individual para clientes." : "El rol se valida automáticamente."}</p>
            </div>
          </div>
          {isRegister && <Input label="Nombre" value={form.name} onChange={(name) => setForm({ ...form, name })} />}
          {isRegister && <Input label="Teléfono" value={form.phone} autoComplete="tel" onChange={(phone) => setForm({ ...form, phone })} />}
          <Input label="Correo electrónico" type="email" value={form.email} autoComplete="email" onChange={(email) => setForm({ ...form, email })} />
          <Input label="Contraseña" type="password" value={form.password} autoComplete={isRegister ? "new-password" : "current-password"} onChange={(password) => setForm({ ...form, password })} />
          {error && <p className="mb-4 rounded-md bg-ember/20 px-3 py-2 text-sm text-white">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-acid px-4 py-3 font-black text-ink">{isRegister ? "Crear cuenta" : "Entrar"}</button>
          {!isRegister && <div className="mt-4 rounded-md bg-white/5 p-3 text-xs text-steel">
            <b className="text-white">Administrador de demostración:</b> admin@peluqueria.com / Admin123*<br />
            <b className="text-white">Cliente de demostración:</b> cliente@demo.com / Cliente123*
          </div>}
          <button type="button" onClick={() => setView(isRegister ? "login" : "register")} className="mt-4 w-full text-sm font-bold text-steel">
            {isRegister ? "Ya tengo cuenta" : "Crear cuenta de cliente"}
          </button>
        </form>
      </section>
    </div>
  );
}
