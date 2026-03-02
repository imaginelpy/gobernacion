"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const colors = ["#1c3f72", "#2f5fa5", "#7fa3d4", "#adc4e6", "#d8e2f0"];

export function ChartsPanel({ byDistrict, byYear }: { byDistrict: { distrito: string; monto: number }[]; byYear: { anio: string; total: number }[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card h-80">
        <h3 className="font-semibold mb-3">Inversión por distrito</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={byDistrict}>
            <XAxis dataKey="distrito" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="monto" fill="#1c3f72" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card h-80">
        <h3 className="font-semibold mb-3">Obras por año</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={byYear} dataKey="total" nameKey="anio" outerRadius={100}>
              {byYear.map((entry, index) => (
                <Cell key={entry.anio} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
