import dynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/StatsCards";
import { ChartsPanel } from "@/components/ChartsPanel";
import { auth } from "@/auth";

const MapView = dynamic(() => import("@/components/MapView").then((mod) => mod.MapView), { ssr: false });

export default async function DashboardPage({ searchParams }: { searchParams: { anio?: string } }) {
  const session = await auth();
  const selectedYear = searchParams.anio ? Number(searchParams.anio) : undefined;

  const obras = await prisma.obra.findMany({
    where: selectedYear ? { anio: selectedYear } : undefined,
    orderBy: { createdAt: "desc" }
  });

  const [allObras, distritos] = await Promise.all([prisma.obra.findMany(), prisma.distrito.findMany()]);

  const totalInvertido = obras.reduce((sum, obra) => sum + obra.monto, 0);
  const byDistrict = Object.values(
    obras.reduce<Record<string, { distrito: string; monto: number }>>((acc, obra) => {
      acc[obra.distrito] ??= { distrito: obra.distrito, monto: 0 };
      acc[obra.distrito].monto += obra.monto;
      return acc;
    }, {})
  );

  const byYear = Object.values(
    allObras.reduce<Record<string, { anio: string; total: number }>>((acc, obra) => {
      const key = String(obra.anio);
      acc[key] ??= { anio: key, total: 0 };
      acc[key].total += 1;
      return acc;
    }, {})
  );

  const strategicIndicator = byDistrict.length
    ? (Math.min(...byDistrict.map((entry) => entry.monto)) / Math.max(...byDistrict.map((entry) => entry.monto))) * 100
    : 0;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institution-dark">Panel Principal</h1>
        <form>
          <select name="anio" defaultValue={selectedYear ?? ""} className="rounded-md border p-2 text-sm">
            <option value="">Todos los años</option>
            {[...new Set(allObras.map((obra) => obra.anio))].sort().map((anio) => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
          <button className="ml-2 rounded-md bg-institution-primary text-white px-3 py-2 text-sm">Filtrar</button>
        </form>
      </div>

      <StatsCards
        totalObras={obras.length}
        totalInvertido={totalInvertido}
        distritosActivos={new Set(obras.map((obra) => obra.distrito)).size}
        promedioPorObra={obras.length ? totalInvertido / obras.length : 0}
      />

      <ChartsPanel byDistrict={byDistrict} byYear={byYear} />

      <div className="card">
        <h3 className="font-semibold">Indicador estratégico territorial</h3>
        <p className="text-sm text-slate-600 mt-2">
          Equilibrio territorial actual: <strong>{strategicIndicator.toFixed(2)}%</strong>
        </p>
      </div>

      <MapView obras={obras} canEdit={["GOBERNADOR", "SECRETARIO"].includes(session?.user.role ?? "")} />

      <div className="card">
        <h3 className="font-semibold mb-3">Distritos registrados</h3>
        <ul className="grid md:grid-cols-2 gap-2 text-sm">
          {distritos.map((distrito) => (
            <li key={distrito.id} className="rounded border p-2">
              <strong>{distrito.nombre}</strong> · Población {distrito.poblacion.toLocaleString("es-PY")}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
