export type Role =
  | 'admin'
  | 'director'
  | 'manager'
  | 'accountant'
  | 'shareholder';
export type Permission = 'read' | 'write' | 'update' | 'delete';
export type Resource = 'cattle' | 'customer' | 'transaction';
export type PermissionKey = `${Permission}:${Resource}`;

const userPermissions: Record<Role, PermissionKey[]> = {
  admin: [
    'read:cattle',
    'write:cattle',
    'update:cattle',
    'delete:cattle',

    'read:customer',
    'write:customer',
    'update:customer',
    'delete:customer',

    'read:transaction',
    'write:transaction',
    'update:transaction',
    'delete:transaction'
  ],
  director: [
    'read:cattle',
    'write:cattle',
    'update:cattle',
    'delete:cattle',

    'read:customer',
    'write:customer',
    'update:customer',
    'delete:customer',

    'read:transaction',
    'write:transaction',
    'update:transaction',
    'delete:transaction'
  ],
  manager: [
    'read:cattle',
    'update:cattle',

    'read:transaction',
    'update:transaction',

    'read:customer',
    'update:customer'
  ],
  accountant: ['read:cattle', 'read:transaction', 'read:customer'],
  shareholder: ['read:cattle', 'read:customer', 'read:transaction']
};

export const hasPermission = (
  role: Role | undefined | null,
  permission: PermissionKey
) => {
  if (!role) return false;
  const permissionsForRole = userPermissions[role];
  if (!permissionsForRole) return false;
  return permissionsForRole.includes(permission);
};

export default hasPermission;
