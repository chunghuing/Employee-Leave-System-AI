import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePermission } from './usePermission'
import { useAuthStore } from '../stores/auth.store'
import { USER_ROLES } from '../constants'
import type { User } from '../types'

function signInAs(role: (typeof USER_ROLES)[keyof typeof USER_ROLES]) {
  const authStore = useAuthStore()
  const user: User = {
    id: 'u-001',
    name: '測試使用者',
    email: 'test@example.com',
    role,
  }
  authStore.currentUser = user
  authStore.token = 'mock-token'
}

describe('usePermission', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('denies every role check when logged out', () => {
    const { isEmployee, isManager, isHr, hasRole } = usePermission()

    expect(isEmployee.value).toBe(false)
    expect(isManager.value).toBe(false)
    expect(isHr.value).toBe(false)
    expect(hasRole(USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER, USER_ROLES.HR)).toBe(false)
  })

  it('identifies an employee', () => {
    signInAs(USER_ROLES.EMPLOYEE)

    const { isEmployee, isManager, isHr, hasRole } = usePermission()

    expect(isEmployee.value).toBe(true)
    expect(isManager.value).toBe(false)
    expect(isHr.value).toBe(false)
    expect(hasRole(USER_ROLES.EMPLOYEE)).toBe(true)
    expect(hasRole(USER_ROLES.MANAGER)).toBe(false)
  })

  it('identifies a manager', () => {
    signInAs(USER_ROLES.MANAGER)

    const { isEmployee, isManager, isHr, hasRole } = usePermission()

    expect(isManager.value).toBe(true)
    expect(isEmployee.value).toBe(false)
    expect(isHr.value).toBe(false)
    expect(hasRole(USER_ROLES.MANAGER, USER_ROLES.HR)).toBe(true)
  })

  it('identifies an hr user', () => {
    signInAs(USER_ROLES.HR)

    const { isEmployee, isManager, isHr, hasRole } = usePermission()

    expect(isHr.value).toBe(true)
    expect(isEmployee.value).toBe(false)
    expect(isManager.value).toBe(false)
    expect(hasRole(USER_ROLES.HR)).toBe(true)
  })
})
