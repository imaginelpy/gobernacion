import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildStrategicAnalysis } from "@/lib/strategic";

export async function GET() {
  const [obras, distritos] = await Promise.all([prisma.obra.findMany(), prisma.distrito.findMany()]);
  const analysis = buildStrategicAnalysis(obras, distritos);

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    provider: "local-rule-engine",
    notes: "Preparado para reemplazar por OpenAI API en futuras versiones.",
    recomendaciones: analysis.recomendaciones
  });
}
