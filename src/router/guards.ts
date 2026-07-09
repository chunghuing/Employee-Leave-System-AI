import type { Router } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { ROLE_HOME_ROUTES, ROUTE_NAMES } from '../constants'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: ROUTE_NAMES.LOGIN }
    }

    if (to.name === ROUTE_NAMES.LOGIN && authStore.isAuthenticated && authStore.role) {
      return { name: ROLE_HOME_ROUTES[authStore.role] }
    }

    if (to.meta.roles && (!authStore.role || !to.meta.roles.includes(authStore.role))) {
      return { name: authStore.role ? ROLE_HOME_ROUTES[authStore.role] : ROUTE_NAMES.LOGIN }
    }

    return true
  })
}
