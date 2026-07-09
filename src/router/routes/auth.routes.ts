import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '../../constants'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('../../features/auth/views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      layout: 'auth',
    },
  },
]
