import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, USER_ROLES } from '../../constants'

export const hrRoutes: RouteRecordRaw[] = [
  {
    path: '/hr/leave-records',
    name: ROUTE_NAMES.HR_LEAVE_RECORDS,
    component: () => import('../../features/hr/leave-records/LeaveRecordsView.vue'),
    meta: {
      requiresAuth: true,
      roles: [USER_ROLES.HR],
      layout: 'default',
    },
  },
  {
    path: '/hr/leave-types',
    name: ROUTE_NAMES.HR_LEAVE_TYPES,
    component: () => import('../../features/hr/leave-types/LeaveTypesView.vue'),
    meta: {
      requiresAuth: true,
      roles: [USER_ROLES.HR],
      layout: 'default',
    },
  },
]
