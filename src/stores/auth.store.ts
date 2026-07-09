import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authService from '../services/authService'
import { STORAGE_KEYS } from '../constants'
import type { LoginCredentials, User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)

  const role = computed(() => currentUser.value?.role ?? null)
  const isAuthenticated = computed(() => currentUser.value !== null && token.value !== null)

  async function login(credentials: LoginCredentials) {
    const result = await authService.login(credentials)

    currentUser.value = result.user
    token.value = result.token

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.token)
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(result.user))
  }

  function logout() {
    currentUser.value = null
    token.value = null

    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
  }

  function restoreSession() {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER)

    if (!storedToken || !storedUser) {
      return
    }

    token.value = storedToken
    currentUser.value = JSON.parse(storedUser) as User
  }

  return {
    currentUser,
    token,
    role,
    isAuthenticated,
    login,
    logout,
    restoreSession,
  }
})
