import { CalendarDays, Clock, MapPin, Plus, ReceiptText, Scissors } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api, formatMoney } from "../api.js";
import { Input, Select } from "../components/forms.jsx";
import { MetricCard } from "../components/MetricCard.jsx";
import { Panel } from "../components/Panel.jsx";
import { StatusCard } from "../components/StatusCard.jsx";
import { PaymentHistory } from "../features/admin/PaymentHistory.jsx";
import { AppointmentList } from "../features/appointments/AppointmentList.jsx";

export function AdminDashboard({ user }) {
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
            <Select label="Estado" value={statusForm.status} onChange={(nextStatus) => setStatusForm({ ...statusForm, status: nextStatus })} options={[
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
