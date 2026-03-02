import { Distrito, Obra } from "@prisma/client";

export function buildStrategicAnalysis(obras: Obra[], distritos: Distrito[]) {
  const investmentByDistrict = distritos.map((distrito) => {
    const totalInversion = obras
      .filter((obra) => obra.distrito === distrito.nombre)
      .reduce((sum, obra) => sum + obra.monto, 0);

    const perCapita = distrito.poblacion > 0 ? totalInversion / distrito.poblacion : 0;
    const perSuperficie = distrito.superficie > 0 ? totalInversion / distrito.superficie : 0;

    return {
      distrito: distrito.nombre,
      totalInversion,
      perCapita,
      perSuperficie,
      poblacion: distrito.poblacion,
      superficie: distrito.superficie
    };
  });

  const rankedByInversion = [...investmentByDistrict].sort((a, b) => b.totalInversion - a.totalInversion);
  const lowPerCapita = [...investmentByDistrict].sort((a, b) => a.perCapita - b.perCapita).slice(0, 3);

  const max = Math.max(...investmentByDistrict.map((item) => item.totalInversion), 1);
  const min = Math.min(...investmentByDistrict.map((item) => item.totalInversion), 0);
  const equilibrioTerritorial = max > 0 ? (min / max) * 100 : 0;

  const recomendaciones = lowPerCapita.map(
    (item) =>
      `Se recomienda priorizar inversión en el distrito ${item.distrito} debido a baja inversión per cápita (${item.perCapita.toFixed(2)}).`
  );

  return {
    rankedByInversion,
    lowPerCapita,
    investmentByDistrict,
    equilibrioTerritorial,
    recomendaciones
  };
}
