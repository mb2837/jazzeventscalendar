import { Navigate, useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';

/** Gate key for /admin?key=… — override with VITE_ADMIN_GATE_KEY */
export const ADMIN_GATE_KEY = import.meta.env.VITE_ADMIN_GATE_KEY || 'jazz';

export function AdminGate({ children }: { children: ReactNode }) {
  const [params] = useSearchParams();
  const key = params.get('key');
  if (key !== ADMIN_GATE_KEY) {
    return <Navigate to="/" replace />;
  }
  return children;
}
