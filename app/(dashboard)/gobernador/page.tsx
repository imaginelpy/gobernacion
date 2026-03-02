import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildStrategicAnalysis } from "@/lib/strategic";
import { formatCurrency } from "@/lib/utils";

export default async function GobernadorPage() {
  const session = await auth();

  if (session?.user.role !== "GOBERNADOR") {
    redirect("/dashboard");
  }

  const [obras, distritos] = await Promise.all([prisma.obra.findMany(), prisma.distrito.findMany()]);
  const analysis = buildStrategicAnalysis(obras, distritos);

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold text-institution-dark">Panel Estratégico del Gobernador</h1>

      <div className="card">
        <h2 className="font-semibold">Ranking de distritos por inversión</h2>
        <ol className="mt-3 space-y-2 text-sm">
          {analysis.rankedByInversion.map((item, idx) => (
            <li key={item.distrito}>{idx + 1}. {item.distrito} — {formatCurrency(item.totalInversion)}</li>
          ))}
        </ol>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold">Distritos con menor inversión per cápita</h2>
          <ul className="mt-3 text-sm space-y-2">
            {analysis.lowPerCapita.map((item) => (
              <li key={item.distrito}>{item.distrito}: {item.perCapita.toFixed(2)} PYG/habitante</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-semibold">Indicador de equilibrio territorial</h2>
          <p className="text-3xl font-bold text-institution-primary mt-4">{analysis.equilibrioTerritorial.toFixed(2)}%</p>
          <p className="text-sm text-slate-500 mt-2">Relación entre distrito con menor y mayor inversión.</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold">Relaciones estratégicas por distrito</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-3">Distrito</th>
                <th className="py-2 pr-3">Inversión</th>
                <th className="py-2 pr-3">Inversión / población</th>
                <th className="py-2 pr-3">Inversión / superficie</th>
              </tr>
            </thead>
            <tbody>
              {analysis.investmentByDistrict.map((item) => (
                <tr key={item.distrito} className="border-b last:border-0">
                  <td className="py-2 pr-3">{item.distrito}</td>
                  <td className="py-2 pr-3">{formatCurrency(item.totalInversion)}</td>
                  <td className="py-2 pr-3">{item.perCapita.toFixed(2)} PYG/hab</td>
                  <td className="py-2 pr-3">{item.perSuperficie.toFixed(2)} PYG/km²</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold">Motor de sugerencias inteligentes</h2>
        <ul className="list-disc ml-5 mt-3 text-sm space-y-2">
          {analysis.recomendaciones.map((recomendacion) => (
            <li key={recomendacion}>{recomendacion}</li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-4">Arquitectura preparada para integración futura con OpenAI API.</p>
      </div>
    </section>
  );
}
