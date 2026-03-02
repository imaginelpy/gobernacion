import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildStrategicAnalysis } from "@/lib/strategic";

export async function GET() {
  const [obras, distritos] = await Promise.all([prisma.obra.findMany(), prisma.distrito.findMany()]);
  return NextResponse.json(buildStrategicAnalysis(obras, distritos));
}
