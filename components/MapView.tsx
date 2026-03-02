"use client";

import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapObra = {
  id: number;
  nombre: string;
  distrito: string;
  monto: number;
  latitud: number;
  longitud: number;
};

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng], 11);
  return null;
}

export function MapView({ obras, canEdit }: { obras: MapObra[]; canEdit: boolean }) {
  const first = obras[0] ?? { latitud: -26.2, longitud: -56.36 };
  const [selected, setSelected] = useState<{ lat: number; lng: number }>({ lat: first.latitud, lng: first.longitud });

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Mapa interactivo de obras</h3>
      <div className="h-[420px] rounded-lg overflow-hidden">
        <MapContainer center={[first.latitud, first.longitud]} zoom={9} className="h-full w-full">
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FlyToMarker lat={selected.lat} lng={selected.lng} />
          {obras.map((obra) => (
            <Marker
              key={obra.id}
              position={[obra.latitud, obra.longitud]}
              icon={icon}
              eventHandlers={{ click: () => setSelected({ lat: obra.latitud, lng: obra.longitud }) }}
            >
              <Popup>
                <p className="font-semibold">{obra.nombre}</p>
                <p>{obra.distrito}</p>
                <p>Monto: {obra.monto.toLocaleString("es-PY")}</p>
                <p>Coordenadas: {obra.latitud}, {obra.longitud}</p>
                {canEdit ? <p className="text-xs text-blue-700 mt-2">Puede editar esta obra desde el panel.</p> : null}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
