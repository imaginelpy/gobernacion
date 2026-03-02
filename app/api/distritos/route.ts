import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const distritoSchema = z.object({
  nombre: z.string(),
  poblacion: z.number().int(),
  superficie: z.number(),
  densidad: z.number(),
  porcentajeJovenes: z.number(),
  porcentajeAdultos: z.number(),
  porcentajeAdultosMayores: z.number()
});

export async function GET() {
  const distritos = await prisma.distrito.findMany({ orderBy: { nombre: "asc" } });
  return NextResponse.json(distritos);
}

export async function POST(req: Request) {
  const data = distritoSchema.parse(await req.json());
  const distrito = await prisma.distrito.create({ data });
  return NextResponse.json(distrito, { status: 201 });
}
