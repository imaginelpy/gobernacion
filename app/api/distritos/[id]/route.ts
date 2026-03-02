import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const distritoSchema = z.object({
  nombre: z.string().optional(),
  poblacion: z.number().int().optional(),
  superficie: z.number().optional(),
  densidad: z.number().optional(),
  porcentajeJovenes: z.number().optional(),
  porcentajeAdultos: z.number().optional(),
  porcentajeAdultosMayores: z.number().optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const distrito = await prisma.distrito.findUnique({ where: { id: Number(params.id) } });
  return distrito ? NextResponse.json(distrito) : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = distritoSchema.parse(await req.json());
  const distrito = await prisma.distrito.update({ where: { id: Number(params.id) }, data });
  return NextResponse.json(distrito);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.distrito.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
