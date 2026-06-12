import { CalendarDays, Clock, CreditCard, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api, formatMoney } from "../api.js";
import { Input, Select } from "../components/forms.jsx";
import { Panel } from "../components/Panel.jsx";
import { StatusCard } from "../components/StatusCard.jsx";
import { AppointmentList } from "../features/appointments/AppointmentList.jsx";
import { BusinessMap } from "../features/business/BusinessMap.jsx";
import { today } from "../lib/display.js";

export function ClientDashboard() {
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
