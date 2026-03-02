"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Obra = {
  id: number;
  nombre: string;
  descripcion: string;
  distrito: string;
  tipo: string;
  monto: number;
  anio: number;
  estado: "PLANIFICADA" | "EN_EJECUCION" | "FINALIZADA" | "PAUSADA";
  latitud: number;
  longitud: number;
};

type Distrito = {
  id: number;
  nombre: string;
  poblacion: number;
  superficie: number;
  densidad: number;
  porcentajeJovenes: number;
  porcentajeAdultos: number;
  porcentajeAdultosMayores: number;
};

type Notice = { type: "success" | "error"; message: string } | null;

function buildDefaultObra(distritos: Distrito[]): Omit<Obra, "id"> {
  return {
    nombre: "",
    descripcion: "",
    distrito: distritos[0]?.nombre ?? "",
    tipo: "Infraestructura",
    monto: 0,
    anio: new Date().getFullYear(),
    estado: "PLANIFICADA",
    latitud: -26.2,
    longitud: -56.36
  };
}

function buildDefaultDistrito(): Omit<Distrito, "id"> {
  return {
    nombre: "",
    poblacion: 0,
    superficie: 0,
    densidad: 0,
    porcentajeJovenes: 0,
    porcentajeAdultos: 0,
    porcentajeAdultosMayores: 0
  };
}

export function DataManagementPanel({
  obras,
  distritos,
  canWrite
}: {
  obras: Obra[];
  distritos: Distrito[];
  canWrite: boolean;
}) {
  const router = useRouter();

  const [obraForm, setObraForm] = useState<Omit<Obra, "id">>(() => buildDefaultObra(distritos));
  const [distritoForm, setDistritoForm] = useState<Omit<Distrito, "id">>(() => buildDefaultDistrito());
  const [editingObraId, setEditingObraId] = useState<number | null>(null);
  const [editingDistritoId, setEditingDistritoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const hasDistritos = distritos.length > 0;

  const obraSubmitDisabled = useMemo(
    () =>
      !canWrite ||
      isSubmitting ||
      !obraForm.nombre.trim() ||
      !obraForm.descripcion.trim() ||
      !obraForm.distrito.trim() ||
      obraForm.anio < 1990,
    [canWrite, isSubmitting, obraForm]
  );

  const distritoSubmitDisabled = useMemo(
    () => !canWrite || isSubmitting || !distritoForm.nombre.trim(),
    [canWrite, isSubmitting, distritoForm.nombre]
  );

  async function safeRequest(input: RequestInfo | URL, init: RequestInit, successMessage: string) {
    setIsSubmitting(true);
    setNotice(null);

    try {
      const response = await fetch(input, init);
      if (!response.ok) {
        throw new Error(await response.text());
      }
      setNotice({ type: "success", message: successMessage });
      router.refresh();
      return true;
    } catch {
      setNotice({ type: "error", message: "No se pudo completar la operación. Verifique los datos e intente nuevamente." });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitObra() {
    if (obraSubmitDisabled) return;

    const endpoint = editingObraId ? `/api/obras/${editingObraId}` : "/api/obras";
    const method = editingObraId ? "PUT" : "POST";

    const ok = await safeRequest(
      endpoint,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...obraForm, monto: Number(obraForm.monto), anio: Number(obraForm.anio) })
      },
      editingObraId ? "Obra actualizada correctamente." : "Obra registrada correctamente."
    );

    if (ok) {
      setEditingObraId(null);
      setObraForm(buildDefaultObra(distritos));
    }
  }

  async function submitDistrito() {
    if (distritoSubmitDisabled) return;

    const endpoint = editingDistritoId ? `/api/distritos/${editingDistritoId}` : "/api/distritos";
    const method = editingDistritoId ? "PUT" : "POST";

    const ok = await safeRequest(
      endpoint,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(distritoForm)
      },
      editingDistritoId ? "Distrito actualizado correctamente." : "Distrito agregado correctamente."
    );

    if (ok) {
      setEditingDistritoId(null);
      setDistritoForm(buildDefaultDistrito());
    }
  }

  return (
    <section className="space-y-4">
      {notice ? (
        <div className={`rounded-md px-3 py-2 text-sm ${notice.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {notice.message}
        </div>
      ) : null}

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h3 className="font-semibold">Gestión de obras</h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <input className="rounded border p-2" placeholder="Nombre" value={obraForm.nombre} onChange={(e) => setObraForm({ ...obraForm, nombre: e.target.value })} />
            <input className="rounded border p-2" placeholder="Tipo" value={obraForm.tipo} onChange={(e) => setObraForm({ ...obraForm, tipo: e.target.value })} />
            <input className="rounded border p-2 md:col-span-2" placeholder="Descripción" value={obraForm.descripcion} onChange={(e) => setObraForm({ ...obraForm, descripcion: e.target.value })} />
            <select className="rounded border p-2" value={obraForm.distrito} onChange={(e) => setObraForm({ ...obraForm, distrito: e.target.value })} disabled={!hasDistritos}>
              {hasDistritos ? distritos.map((d) => <option key={d.id} value={d.nombre}>{d.nombre}</option>) : <option value="">Sin distritos</option>}
            </select>
            <select className="rounded border p-2" value={obraForm.estado} onChange={(e) => setObraForm({ ...obraForm, estado: e.target.value as Obra["estado"] })}>
              <option value="PLANIFICADA">Planificada</option>
              <option value="EN_EJECUCION">En ejecución</option>
              <option value="FINALIZADA">Finalizada</option>
              <option value="PAUSADA">Pausada</option>
            </select>
            <input type="number" className="rounded border p-2" placeholder="Monto" value={obraForm.monto} onChange={(e) => setObraForm({ ...obraForm, monto: Number(e.target.value) })} />
            <input type="number" className="rounded border p-2" placeholder="Año" value={obraForm.anio} onChange={(e) => setObraForm({ ...obraForm, anio: Number(e.target.value) })} />
            <input type="number" step="0.0001" className="rounded border p-2" placeholder="Latitud" value={obraForm.latitud} onChange={(e) => setObraForm({ ...obraForm, latitud: Number(e.target.value) })} />
            <input type="number" step="0.0001" className="rounded border p-2" placeholder="Longitud" value={obraForm.longitud} onChange={(e) => setObraForm({ ...obraForm, longitud: Number(e.target.value) })} />
          </div>

          <div className="flex gap-2">
            <button disabled={obraSubmitDisabled} onClick={submitObra} className="rounded bg-institution-primary text-white px-4 py-2 text-sm disabled:opacity-40">
              {editingObraId ? "Actualizar obra" : "Agregar obra"}
            </button>
            {editingObraId ? (
              <button
                disabled={isSubmitting}
                onClick={() => {
                  setEditingObraId(null);
                  setObraForm(buildDefaultObra(distritos));
                }}
                className="rounded border px-4 py-2 text-sm"
              >
                Cancelar
              </button>
            ) : null}
          </div>

          <ul className="text-sm space-y-1 max-h-56 overflow-auto">
            {obras.map((obra) => (
              <li key={obra.id} className="flex items-center justify-between rounded border p-2">
                <span>{obra.nombre} · {obra.distrito}</span>
                <div className="space-x-2">
                  <button
                    disabled={!canWrite || isSubmitting}
                    className="text-blue-700 disabled:opacity-40"
                    onClick={() => {
                      setEditingObraId(obra.id);
                      const { id: _id, ...rest } = obra;
                      setObraForm(rest);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    disabled={!canWrite || isSubmitting}
                    className="text-red-700 disabled:opacity-40"
                    onClick={async () => {
                      const ok = await safeRequest(`/api/obras/${obra.id}`, { method: "DELETE" }, "Obra eliminada correctamente.");
                      if (ok && editingObraId === obra.id) {
                        setEditingObraId(null);
                        setObraForm(buildDefaultObra(distritos));
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold">Gestión de distritos</h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <input className="rounded border p-2 md:col-span-2" placeholder="Nombre" value={distritoForm.nombre} onChange={(e) => setDistritoForm({ ...distritoForm, nombre: e.target.value })} />
            <input type="number" className="rounded border p-2" placeholder="Población" value={distritoForm.poblacion} onChange={(e) => setDistritoForm({ ...distritoForm, poblacion: Number(e.target.value) })} />
            <input type="number" className="rounded border p-2" placeholder="Superficie" value={distritoForm.superficie} onChange={(e) => setDistritoForm({ ...distritoForm, superficie: Number(e.target.value) })} />
            <input type="number" className="rounded border p-2" placeholder="Densidad" value={distritoForm.densidad} onChange={(e) => setDistritoForm({ ...distritoForm, densidad: Number(e.target.value) })} />
            <input type="number" className="rounded border p-2" placeholder="% Jóvenes" value={distritoForm.porcentajeJovenes} onChange={(e) => setDistritoForm({ ...distritoForm, porcentajeJovenes: Number(e.target.value) })} />
            <input type="number" className="rounded border p-2" placeholder="% Adultos" value={distritoForm.porcentajeAdultos} onChange={(e) => setDistritoForm({ ...distritoForm, porcentajeAdultos: Number(e.target.value) })} />
            <input type="number" className="rounded border p-2" placeholder="% Adultos Mayores" value={distritoForm.porcentajeAdultosMayores} onChange={(e) => setDistritoForm({ ...distritoForm, porcentajeAdultosMayores: Number(e.target.value) })} />
          </div>

          <div className="flex gap-2">
            <button disabled={distritoSubmitDisabled} onClick={submitDistrito} className="rounded bg-institution-primary text-white px-4 py-2 text-sm disabled:opacity-40">
              {editingDistritoId ? "Actualizar distrito" : "Agregar distrito"}
            </button>
            {editingDistritoId ? (
              <button
                disabled={isSubmitting}
                onClick={() => {
                  setEditingDistritoId(null);
                  setDistritoForm(buildDefaultDistrito());
                }}
                className="rounded border px-4 py-2 text-sm"
              >
                Cancelar
              </button>
            ) : null}
          </div>

          <ul className="text-sm space-y-1 max-h-56 overflow-auto">
            {distritos.map((distrito) => (
              <li key={distrito.id} className="flex items-center justify-between rounded border p-2">
                <span>{distrito.nombre} · {distrito.poblacion.toLocaleString("es-PY")}</span>
                <div className="space-x-2">
                  <button
                    disabled={!canWrite || isSubmitting}
                    className="text-blue-700 disabled:opacity-40"
                    onClick={() => {
                      setEditingDistritoId(distrito.id);
                      const { id: _id, ...rest } = distrito;
                      setDistritoForm(rest);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    disabled={!canWrite || isSubmitting}
                    className="text-red-700 disabled:opacity-40"
                    onClick={async () => {
                      const ok = await safeRequest(`/api/distritos/${distrito.id}`, { method: "DELETE" }, "Distrito eliminado correctamente.");
                      if (ok && editingDistritoId === distrito.id) {
                        setEditingDistritoId(null);
                        setDistritoForm(buildDefaultDistrito());
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
