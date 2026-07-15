import { redirect } from '@tanstack/react-router';
import { AUTH_SESSION_STORAGE_KEY, type AuthUser, type UserRole } from '@/lib/auth-context';

function getStoredSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed || typeof parsed.id !== 'string') return null;
    if (parsed.role !== 'OWNER' && parsed.role !== 'FIELD') return null;
    return { id: parsed.id, role: parsed.role };
  } catch {
    return null;
  }
}

export function getCurrentRole(): UserRole | null {
  return getStoredSession()?.role ?? null;
}

export function requireOwnerAccess(): void {
  const role = getCurrentRole();
  if (!role) {
    throw redirect({ to: '/login' });
  }
  if (role !== 'OWNER') {
    throw redirect({ to: '/field' });
  }
}

