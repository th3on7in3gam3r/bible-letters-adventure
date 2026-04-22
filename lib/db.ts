import { createClient } from "@libsql/client";

export function getTursoClient() {
  const url = import.meta.env.VITE_TURSO_URL;
  const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;
  if (!url || !authToken) return null;
  return createClient({ url, authToken });
}
