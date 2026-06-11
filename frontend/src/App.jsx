import React from "react";
import { BarChart3, CalendarDays, Check, Clock, CreditCard, LogOut, MapPin, Plus, ReceiptText, Scissors, Shield, User, Wallet } from "lucide-react";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { api, clearSession, formatDateTime, formatMoney, getStoredUser, setSession } from "./api.js";

const today = new Date().toISOString().slice(0, 10);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href
});

export function App() {
  const [user, setUser] = useState(getStoredUser());
  const [view, setView] = useState("login");

  function logout() {
    clearSession();
    setUser(null);
    setView("login");
  }

  if (user?.role === "CLIENT") {
    return <Shell user={user} onLogout={logout}><ClientDashboard /></Shell>;
  }

  if (user?.role === "BARBER_ADMIN") {
    return <Shell user={user} onLogout={logout}><AdminDashboard user={user} /></Shell>;
  }

  return <AuthScreen view={view} setView={setView} onAuth={setUser} />;
}

function Shell({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-white/10 bg-black/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase text-acid">Peluqueria Urbana</p>
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

function AuthScreen({ view, setView, onAuth }) {
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
        <h1 className="max-w-2xl text-5xl font-black leading-none text-white md:text-7xl">Agenda urbana para barberia.</h1>
        <p className="mt-5 max-w-xl text-lg text-steel">Clientes reservan desde el celular. El peluquero controla citas, servicios, pagos manuales y disponibilidad.</p>
      </section>
      <section className="flex items-center justify-center px-4 py-8">
        <form onSubmit={submit} className="street-panel w-full max-w-md rounded-lg p-6">
          <div className="mb-6 flex items-center gap-3">
            {isRegister ? <User className="text-acid" /> : <Shield className="text-acid" />}
            <div>
              <h2 className="text-2xl font-black text-white">{isRegister ? "Registro cliente" : "Inicio de sesion"}</h2>
              <p className="text-sm text-steel">{isRegister ? "El registro publico es solo para clientes." : "El rol se valida automaticamente."}</p>
            </div>
          </div>
          {isRegister && <Input label="Nombre" value={form.name} onChange={(name) => setForm({ ...form, name })} />}
          {isRegister && <Input label="Telefono" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />}
          <Input label="Correo" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
          <Input label="Contrasena" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
          {error && <p className="mb-4 rounded-md bg-ember/20 px-3 py-2 text-sm text-white">{error}</p>}
          <button className="w-full rounded-md bg-acid px-4 py-3 font-black text-ink">{isRegister ? "Crear cuenta" : "Entrar"}</button>
          {!isRegister && <div className="mt-4 rounded-md bg-white/5 p-3 text-xs text-steel">
            <b className="text-white">Demo admin:</b> admin@peluqueria.com / Admin123*<br />
            <b className="text-white">Demo cliente:</b> cliente@demo.com / Cliente123*
          </div>}
          <button type="button" onClick={() => setView(isRegister ? "login" : "register")} className="mt-4 w-full text-sm font-bold text-steel">
            {isRegister ? "Ya tengo cuenta" : "Crear cuenta de cliente"}
          </button>
        </form>
      </section>
    </div>
  );
}

function ClientDashboard() {
  const [services, setServices] = useState([]);
  const [business, setBusiness] = useState(null);
  const [status, setStatus] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const [servicesData, businessData, statusData, appointmentsData] = await Promise.all([
      api("/api/public/services"),
      api("/api/public/business"),
      api("/api/public/barber-status"),
      api("/api/client/appointments")
    ]);
    setServices(servicesData.services);
    setBusiness(businessData.business);
    setStatus(statusData);
    setAppointments(appointmentsData.appointments);
    if (!selectedService && servicesData.services[0]) setSelectedService(servicesData.services[0].id);
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!selectedService) return;
    api(`/api/public/availability?date=${date}&serviceId=${selectedService}`).then((data) => setSlots(data.slots));
  }, [date, selectedService]);

  async function book(startsAt) {
    try {
      await api("/api/client/appointments", { method: "POST", body: { serviceId: selectedService, startsAt } });
      setMessage("Cita registrada. El peluquero la vera en su panel.");
      await load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function cancel(id) {
    await api(`/api/client/appointments/${id}/cancel`, { method: "PATCH" });
    setMessage("Cita cancelada.");
    await load();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <StatusCard status={status} />
        <Panel title="Reservar cita" icon={<CalendarDays />}>
          <div className="grid gap-3 md:grid-cols-2">
            <Select label="Servicio" value={selectedService} onChange={setSelectedService} options={services.map((service) => ({ value: service.id, label: `${service.name} - ${formatMoney(service.priceCents)} - ${service.durationMinutes} min` }))} />
            <Input label="Fecha" type="date" value={date} min={today} onChange={setDate} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {slots.map((slot) => <button key={slot.startsAt} onClick={() => book(slot.startsAt)} className="rounded-md bg-white px-3 py-2 font-bold text-ink">{slot.label}</button>)}
            {!slots.length && <p className="col-span-full text-sm text-steel">No hay horarios disponibles para esa fecha.</p>}
          </div>
          {message && <p className="mt-4 rounded-md bg-acid/20 px-3 py-2 text-sm text-white">{message}</p>}
        </Panel>
        <Panel title="Mis citas" icon={<Clock />}>
          <AppointmentList appointments={appointments} compact onCancel={cancel} />
        </Panel>
      </section>
      <aside className="space-y-5">
        <Panel title="Ubicacion" icon={<MapPin />}>
          {business && <BusinessMap business={business} />}
        </Panel>
        <Panel title="QR del negocio" icon={<CreditCard />}>
          {business?.qrImageUrl ? <img src={business.qrImageUrl} alt="QR del negocio" className="mx-auto max-h-52 rounded-md" /> : <p className="text-sm text-steel">El peluquero configurara el QR en el panel.</p>}
        </Panel>
      </aside>
    </div>
  );
}

function AdminDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState(null);
  const [business, setBusiness] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: "", description: "", priceCents: 2500000, durationMinutes: 30, isActive: true });
  const [statusForm, setStatusForm] = useState({ status: "AVAILABLE", busyUntil: "", note: "" });
  const [businessForm, setBusinessForm] = useState({ name: "", address: "", phone: "", instagram: "", qrImageUrl: "", latitude: 4.711, longitude: -74.0721 });

  async function load() {
    const [appointmentsData, servicesData, statusData, businessData] = await Promise.all([
      api("/api/admin/appointments"),
      api("/api/admin/services"),
      api("/api/public/barber-status"),
      api("/api/public/business")
    ]);
    setAppointments(appointmentsData.appointments);
    setServices(servicesData.services);
    setStatus(statusData);
    setBusiness(businessData.business);
    if (businessData.business) {
      setBusinessForm({
        name: businessData.business.name || "",
        address: businessData.business.address || "",
        phone: businessData.business.phone || "",
        instagram: businessData.business.instagram || "",
        qrImageUrl: businessData.business.qrImageUrl || "",
        latitude: businessData.business.latitude || 4.711,
        longitude: businessData.business.longitude || -74.0721
      });
    }
  }

  useEffect(() => { load(); }, []);

  async function updateAppointment(id, nextStatus) {
    await api(`/api/admin/appointments/${id}/status`, { method: "PATCH", body: { status: nextStatus } });
    await load();
  }

  async function updatePayment(appointment, nextStatus) {
    await api(`/api/admin/payments/${appointment.id}`, {
      method: "PUT",
      body: {
        amountCents: nextStatus === "PARTIAL" ? Math.round(appointment.service.priceCents * 0.5) : appointment.service.priceCents,
        status: nextStatus,
        method: "QR",
        reference: nextStatus === "PAID" ? "Confirmado manualmente" : ""
      }
    });
    await load();
  }

  async function saveService(event) {
    event.preventDefault();
    await api("/api/admin/services", { method: "POST", body: { ...serviceForm, priceCents: Number(serviceForm.priceCents), durationMinutes: Number(serviceForm.durationMinutes) } });
    setServiceForm({ name: "", description: "", priceCents: 2500000, durationMinutes: 30, isActive: true });
    await load();
  }

  async function saveBusiness(event) {
    event.preventDefault();
    await api("/api/admin/business", {
      method: "PUT",
      body: {
        ...businessForm,
        qrImageUrl: businessForm.qrImageUrl || null,
        phone: businessForm.phone || null,
        instagram: businessForm.instagram || null,
        latitude: Number(businessForm.latitude),
        longitude: Number(businessForm.longitude)
      }
    });
    await load();
  }

  async function saveStatus(event) {
    event.preventDefault();
    await api("/api/admin/barber-status", {
      method: "PUT",
      body: {
        status: statusForm.status,
        manualOverride: true,
        busyUntil: statusForm.busyUntil ? new Date(statusForm.busyUntil).toISOString() : null,
        note: statusForm.note || null
      }
    });
    await load();
  }

  async function clearManualStatus() {
    await api("/api/admin/barber-status", { method: "PUT", body: { status: "AVAILABLE", manualOverride: false, busyUntil: null, note: null } });
    await load();
  }

  const activeAppointments = appointments.filter((appointment) => !["CANCELLED", "NO_SHOW"].includes(appointment.status));
  const completedAppointments = appointments.filter((appointment) => appointment.status === "COMPLETED");
  const paidRevenue = appointments.reduce((sum, appointment) => appointment.payment?.status === "PAID" ? sum + appointment.service.priceCents : sum, 0);
  const partialRevenue = appointments.reduce((sum, appointment) => appointment.payment?.status === "PARTIAL" ? sum + (appointment.payment.amountCents || 0) : sum, 0);
  const pendingRevenue = activeAppointments.reduce((sum, appointment) => appointment.payment?.status !== "PAID" ? sum + appointment.service.priceCents : sum, 0);
  const paidAppointments = appointments.filter((appointment) => appointment.payment);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
      <section className="space-y-5">
        {user.mustChangePassword && <div className="rounded-lg border border-ember bg-ember/15 p-4 text-sm text-white">Este admin usa una contrasena temporal. Cambiala desde el endpoint de seguridad antes de produccion.</div>}
        <StatusCard status={status} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Citas activas" value={activeAppointments.length} detail={`${completedAppointments.length} atendidas`} />
          <MetricCard label="Ingresos pagados" value={formatMoney(paidRevenue)} detail={`${formatMoney(partialRevenue)} en abonos`} />
          <MetricCard label="Por cobrar" value={formatMoney(pendingRevenue)} detail="Reservas pendientes o abonadas" />
          <MetricCard label="Servicios" value={services.length} detail="Disponibles para reservar" />
        </div>
        <Panel title="Citas agendadas" icon={<CalendarDays />}>
          <AppointmentList appointments={appointments} onStatus={updateAppointment} onPayment={updatePayment} />
        </Panel>
        <Panel title="Historial de pagos" icon={<ReceiptText />}>
          <PaymentHistory appointments={paidAppointments} />
        </Panel>
      </section>
      <aside className="space-y-5">
        <Panel title="Datos del negocio" icon={<MapPin />}>
          <form onSubmit={saveBusiness} className="space-y-3">
            <Input label="Nombre" value={businessForm.name} onChange={(name) => setBusinessForm({ ...businessForm, name })} />
            <Input label="Direccion" value={businessForm.address} onChange={(address) => setBusinessForm({ ...businessForm, address })} />
            <Input label="Telefono" value={businessForm.phone} onChange={(phone) => setBusinessForm({ ...businessForm, phone })} />
            <Input label="Instagram" value={businessForm.instagram} onChange={(instagram) => setBusinessForm({ ...businessForm, instagram })} />
            <Input label="URL del QR" value={businessForm.qrImageUrl} onChange={(qrImageUrl) => setBusinessForm({ ...businessForm, qrImageUrl })} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Latitud" type="number" step="0.000001" value={businessForm.latitude} onChange={(latitude) => setBusinessForm({ ...businessForm, latitude })} />
              <Input label="Longitud" type="number" step="0.000001" value={businessForm.longitude} onChange={(longitude) => setBusinessForm({ ...businessForm, longitude })} />
            </div>
            <button className="w-full rounded-md bg-acid px-3 py-2 font-black text-ink">Guardar negocio</button>
          </form>
          {business?.address && <p className="mt-3 text-xs text-steel">Visible para clientes en mapa y contacto.</p>}
        </Panel>
        <Panel title="Estado manual" icon={<Clock />}>
          <form onSubmit={saveStatus} className="space-y-3">
            <Select label="Estado" value={statusForm.status} onChange={(status) => setStatusForm({ ...statusForm, status })} options={[
              { value: "AVAILABLE", label: "Disponible" },
              { value: "BUSY", label: "Ocupado" },
              { value: "PAUSED", label: "Pausado" },
              { value: "OUT_OF_HOURS", label: "Fuera de horario" }
            ]} />
            <Input label="Ocupado hasta" type="datetime-local" value={statusForm.busyUntil} onChange={(busyUntil) => setStatusForm({ ...statusForm, busyUntil })} />
            <Input label="Nota" value={statusForm.note} onChange={(note) => setStatusForm({ ...statusForm, note })} />
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-md bg-acid px-3 py-2 font-black text-ink">Guardar</button>
              <button type="button" onClick={clearManualStatus} className="rounded-md bg-white/10 px-3 py-2 font-bold text-white">Automatico</button>
            </div>
          </form>
        </Panel>
        <Panel title="Nuevo servicio" icon={<Plus />}>
          <form onSubmit={saveService} className="space-y-3">
            <Input label="Nombre" value={serviceForm.name} onChange={(name) => setServiceForm({ ...serviceForm, name })} />
            <Input label="Descripcion" value={serviceForm.description} onChange={(description) => setServiceForm({ ...serviceForm, description })} />
            <Input label="Precio en pesos" type="number" value={Math.round(serviceForm.priceCents / 100)} onChange={(price) => setServiceForm({ ...serviceForm, priceCents: Number(price || 0) * 100 })} />
            <Input label="Duracion minutos" type="number" value={serviceForm.durationMinutes} onChange={(durationMinutes) => setServiceForm({ ...serviceForm, durationMinutes })} />
            <button className="w-full rounded-md bg-acid px-3 py-2 font-black text-ink">Crear servicio</button>
          </form>
        </Panel>
        <Panel title="Servicios" icon={<Scissors />}>
          <div className="space-y-2">
            {services.map((service) => <div key={service.id} className="rounded-md bg-white/5 p-3 text-sm"><b>{service.name}</b><br />{formatMoney(service.priceCents)} - {service.durationMinutes} min</div>)}
          </div>
        </Panel>
      </aside>
    </div>
  );
}

function MetricCard({ label, value, detail }) {
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

function PaymentHistory({ appointments }) {
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

function AppointmentList({ appointments, compact = false, onStatus, onPayment, onCancel }) {
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

function StatusCard({ status }) {
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

function statusText(status) {
  return {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmada",
    COMPLETED: "Atendida",
    CANCELLED: "Cancelada",
    NO_SHOW: "No asistio"
  }[status] || status;
}

function paymentText(status = "PENDING") {
  return {
    PENDING: "Pago pendiente",
    PARTIAL: "Abonada",
    PAID: "Pagada"
  }[status] || status;
}

function BusinessMap({ business }) {
  const position = useMemo(() => [business.latitude || 4.711, business.longitude || -74.0721], [business]);
  return (
    <div>
      <div className="h-64 overflow-hidden rounded-md">
        <MapContainer center={position} zoom={15} className="h-full w-full">
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}><Popup>{business.name}<br />{business.address}</Popup></Marker>
        </MapContainer>
      </div>
      <p className="mt-3 text-sm text-steel">{business.address}</p>
    </div>
  );
}

function Panel({ title, icon, children }) {
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

function Input({ label, value, onChange, type = "text", ...props }) {
  return (
    <label className="mb-3 block text-sm font-bold text-steel">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-acid" {...props} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="mb-3 block text-sm font-bold text-steel">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-acid">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
