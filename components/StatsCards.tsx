import { formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
  totalObras: number;
  totalInvertido: number;
  distritosActivos: number;
  promedioPorObra: number;
}

export function StatsCards({ totalObras, totalInvertido, distritosActivos, promedioPorObra }: StatsCardsProps) {
  const cards = [
    { title: "Total de obras", value: totalObras.toString() },
    { title: "Total invertido", value: formatCurrency(totalInvertido) },
    { title: "Distritos activos", value: distritosActivos.toString() },
    { title: "Promedio por obra", value: formatCurrency(promedioPorObra) }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="card">
          <p className="text-sm text-slate-500">{card.title}</p>
          <p className="text-2xl font-bold text-institution-primary mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
