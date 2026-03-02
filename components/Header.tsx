import { auth, signOut } from "@/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-lg">Sistema Inteligente de Gestión y Decisión Departamental</h2>
        <p className="text-sm text-slate-500">Espacio para logotipos oficiales</p>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button className="rounded-md bg-institution-primary px-4 py-2 text-white text-sm">
          {session?.user?.name ?? "Usuario"} · Cerrar sesión
        </button>
      </form>
    </header>
  );
}
