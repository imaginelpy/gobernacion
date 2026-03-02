import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const obraSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  distrito: z.string(),
  tipo: z.string(),
  monto: z.number(),
  anio: z.number().int(),
  estado: z.enum(["PLANIFICADA", "EN_EJECUCION", "FINALIZADA", "PAUSADA"]),
  latitud: z.number(),
  longitud: z.number()
});

export async function GET() {
  const obras = await prisma.obra.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(obras);
}

export async function POST(req: Request) {
  const data = obraSchema.parse(await req.json());
  const obra = await prisma.obra.create({ data });
  return NextResponse.json(obra, { status: 201 });
}
