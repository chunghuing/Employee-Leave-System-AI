import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '../types'

/**
 * 目前僅提供狀態骨架供 router guard／layout 使用。
 * login / restoreSession 將於 Issue 4（Authentication）串接 authService 後補上。
 */
export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  const role = computed(() => currentUser.value?.role ?? null)
  const isAuthenticated = computed(() => currentUser.value !== null)

  function logout() {
    currentUser.value = null
  }

  return {
    currentUser,
    role,
    isAuthenticated,
    logout,
  }
})
