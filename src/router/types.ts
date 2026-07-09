import 'vue-router'
import type { UserRole } from '../types'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
    roles?: UserRole[]
    layout: 'auth' | 'default'
  }
}
