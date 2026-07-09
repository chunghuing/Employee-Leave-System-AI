import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const { currentUser, role, isAuthenticated } = storeToRefs(authStore)

  return {
    currentUser,
    role,
    isAuthenticated,
    login: authStore.login,
    logout: authStore.logout,
    restoreSession: authStore.restoreSession,
  }
}
