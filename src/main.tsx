import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY;
registerSW({ immediate: true });
const root = createRoot(document.getElementById('root')!);

if (!PUBLISHABLE_KEY) {
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY. Rendering setup helper screen.');
  root.render(
    <StrictMode>
      <main className="min-h-screen w-full bg-[#FDFBF2] flex items-center justify-center p-6">
        <section className="max-w-xl w-full bg-white border-4 border-yellow-100 rounded-3xl shadow-xl p-6 text-center">
          <h1 className="font-display text-3xl font-black text-blue-700 mb-3">Setup Needed</h1>
          <p className="text-gray-700 font-semibold mb-3">
            Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your environment.
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Note: <code>VITE_STRIPE_PUBLISHABLE_KEY</code> is not a Clerk key and cannot be used for auth.
          </p>
          <p className="text-sm text-gray-600">
            Add it to <code>.env</code>, restart <code>npm run dev</code>, and the game will load normally.
          </p>
        </section>
      </main>
    </StrictMode>,
  );
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </StrictMode>,
  );
}
