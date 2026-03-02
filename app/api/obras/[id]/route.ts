import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const obraSchema = z.object({
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  distrito: z.string().optional(),
  tipo: z.string().optional(),
  monto: z.number().optional(),
  anio: z.number().int().optional(),
  estado: z.enum(["PLANIFICADA", "EN_EJECUCION", "FINALIZADA", "PAUSADA"]).optional(),
  latitud: z.number().optional(),
  longitud: z.number().optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const obra = await prisma.obra.findUnique({ where: { id: Number(params.id) } });
  return obra ? NextResponse.json(obra) : NextResponse.json({ error: "No encontrada" }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = obraSchema.parse(await req.json());
  const obra = await prisma.obra.update({ where: { id: Number(params.id) }, data });
  return NextResponse.json(obra);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.obra.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
