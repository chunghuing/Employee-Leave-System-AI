import type { UserRole } from '../types'

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  HR: 'hr',
} as const satisfies Record<string, UserRole>
