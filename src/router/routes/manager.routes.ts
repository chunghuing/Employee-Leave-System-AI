import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, USER_ROLES } from '../../constants'

export const managerRoutes: RouteRecordRaw[] = [
  {
    path: '/manager/approval',
    name: ROUTE_NAMES.MANAGER_APPROVAL,
    component: () => import('../../features/manager/approval/ApprovalListView.vue'),
    meta: {
      requiresAuth: true,
      roles: [USER_ROLES.MANAGER],
      layout: 'default',
    },
  },
]
