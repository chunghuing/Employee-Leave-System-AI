import type { Router } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { ROUTE_NAMES } from '../constants'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: ROUTE_NAMES.LOGIN }
    }

    if (to.meta.roles && (!authStore.role || !to.meta.roles.includes(authStore.role))) {
      return { name: ROUTE_NAMES.LOGIN }
    }

    return true
  })
}
