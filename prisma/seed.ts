import { PrismaClient, Rol, EstadoObra } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.obra.deleteMany();
  await prisma.distrito.deleteMany();
  await prisma.usuario.deleteMany();

  await prisma.distrito.createMany({
    data: [
      { nombre: "Caazapá", poblacion: 26000, superficie: 900.5, densidad: 28.9, porcentajeJovenes: 35, porcentajeAdultos: 55, porcentajeAdultosMayores: 10 },
      { nombre: "San Juan Nepomuceno", poblacion: 36000, superficie: 1100.3, densidad: 32.7, porcentajeJovenes: 34, porcentajeAdultos: 56, porcentajeAdultosMayores: 10 },
      { nombre: "Yuty", poblacion: 42000, superficie: 1350.1, densidad: 31.1, porcentajeJovenes: 33, porcentajeAdultos: 57, porcentajeAdultosMayores: 10 },
      { nombre: "Abaí", poblacion: 29000, superficie: 780.2, densidad: 37.2, porcentajeJovenes: 36, porcentajeAdultos: 54, porcentajeAdultosMayores: 10 }
    ]
  });

  await prisma.obra.createMany({
    data: [
      { nombre: "Pavimentación Ruta Norte", descripcion: "Mejoramiento vial interurbano", distrito: "Caazapá", tipo: "Infraestructura", monto: 5200000, anio: 2024, estado: EstadoObra.EN_EJECUCION, latitud: -26.1956, longitud: -56.3689 },
      { nombre: "Centro de Salud Comunitario", descripcion: "Construcción y equipamiento", distrito: "San Juan Nepomuceno", tipo: "Salud", monto: 2900000, anio: 2023, estado: EstadoObra.FINALIZADA, latitud: -26.1121, longitud: -55.9388 },
      { nombre: "Rehabilitación de Escuelas", descripcion: "Remodelación de 5 instituciones", distrito: "Yuty", tipo: "Educación", monto: 1800000, anio: 2024, estado: EstadoObra.EN_EJECUCION, latitud: -26.6142, longitud: -56.2464 },
      { nombre: "Sistema de Agua Potable", descripcion: "Extensión de red y reservorio", distrito: "Abaí", tipo: "Saneamiento", monto: 1400000, anio: 2022, estado: EstadoObra.FINALIZADA, latitud: -26.0351, longitud: -55.9312 }
    ]
  });

  const password = await bcrypt.hash("admin123", 10);

  await prisma.usuario.createMany({
    data: [
      { nombre: "Gobernador Demo", email: "gobernador@sigdep.gov.py", password, rol: Rol.GOBERNADOR },
      { nombre: "Secretario Demo", email: "secretario@sigdep.gov.py", password, rol: Rol.SECRETARIO },
      { nombre: "Visitante Demo", email: "visitante@sigdep.gov.py", password, rol: Rol.VISITANTE }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
