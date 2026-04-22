/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  readonly VITE_TURSO_URL: string;
  readonly VITE_TURSO_AUTH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
