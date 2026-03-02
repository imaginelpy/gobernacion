import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-institution-light flex items-center justify-center p-4">
      <form
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm space-y-4"
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/dashboard"
          });
        }}
      >
        <h1 className="text-2xl font-bold text-institution-dark">Ingreso institucional</h1>
        <p className="text-sm text-slate-500">SIGDEP Caazapá</p>
        <input name="email" type="email" placeholder="correo@sigdep.gov.py" required className="w-full rounded-md border p-2" />
        <input name="password" type="password" placeholder="Contraseña" required className="w-full rounded-md border p-2" />
        <button className="w-full rounded-md bg-institution-primary p-2 text-white font-medium">Iniciar sesión</button>
      </form>
    </div>
  );
}
