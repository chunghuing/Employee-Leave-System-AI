import { computed } from 'vue'
import { useAuth } from './useAuth'
import { USER_ROLES } from '../constants'
import type { UserRole } from '../types'

export function usePermission() {
  const { role } = useAuth()

  const isEmployee = computed(() => role.value === USER_ROLES.EMPLOYEE)
  const isManager = computed(() => role.value === USER_ROLES.MANAGER)
  const isHr = computed(() => role.value === USER_ROLES.HR)

  function hasRole(...allowedRoles: UserRole[]): boolean {
    return role.value !== null && allowedRoles.includes(role.value)
  }

  return {
    role,
    isEmployee,
    isManager,
    isHr,
    hasRole,
  }
}
