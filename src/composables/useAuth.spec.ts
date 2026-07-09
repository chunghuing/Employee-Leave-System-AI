import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuth } from './useAuth'
import { useAuthStore } from '../stores/auth.store'
import { USER_ROLES } from '../constants'
import type { User } from '../types'

const MOCK_EMPLOYEE: User = {
  id: 'u-001',
  name: '王小明',
  email: 'employee@example.com',
  role: USER_ROLES.EMPLOYEE,
}

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('reports unauthenticated state before login', () => {
    const { currentUser, role, isAuthenticated } = useAuth()

    expect(isAuthenticated.value).toBe(false)
    expect(currentUser.value).toBeNull()
    expect(role.value).toBeNull()
  })

  it('reflects the store state once a user is signed in', () => {
    const authStore = useAuthStore()
    authStore.currentUser = MOCK_EMPLOYEE
    authStore.token = 'mock-token'

    const { currentUser, role, isAuthenticated } = useAuth()

    expect(isAuthenticated.value).toBe(true)
    expect(currentUser.value).toEqual(MOCK_EMPLOYEE)
    expect(role.value).toBe(USER_ROLES.EMPLOYEE)
  })

  it('clears the session when logout is called', () => {
    const authStore = useAuthStore()
    authStore.currentUser = MOCK_EMPLOYEE
    authStore.token = 'mock-token'

    const { logout, currentUser, isAuthenticated } = useAuth()
    logout()

    expect(currentUser.value).toBeNull()
    expect(isAuthenticated.value).toBe(false)
  })
})
