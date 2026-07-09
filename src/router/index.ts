import { createRouter, createWebHistory } from 'vue-router'
import './types'
import { ROUTE_NAMES } from '../constants'
import { authRoutes } from './routes/auth.routes'
import { employeeRoutes } from './routes/employee.routes'
import { managerRoutes } from './routes/manager.routes'
import { hrRoutes } from './routes/hr.routes'
import { setupRouterGuards } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: { name: ROUTE_NAMES.LOGIN } },
    ...authRoutes,
    ...employeeRoutes,
    ...managerRoutes,
    ...hrRoutes,
  ],
})

setupRouterGuards(router)

export default router
