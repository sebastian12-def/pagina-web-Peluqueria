import L from "leaflet";
import React, { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href
});

export function BusinessMap({ business }) {
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
