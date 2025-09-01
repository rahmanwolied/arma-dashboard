import type { Role } from '@/permissions';

// biome-ignore lint/complexity/noUselessEmptyExport: <explanation>
export {};

declare global {
  interface CustomJwtSessionClaims {
    role: Role;
  }
}
