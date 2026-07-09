import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, USER_ROLES } from '../../constants'

export const employeeRoutes: RouteRecordRaw[] = [
  {
    path: '/employee/leave-balance',
    name: ROUTE_NAMES.EMPLOYEE_LEAVE_BALANCE,
    component: () => import('../../features/employee/leave-balance/LeaveBalanceView.vue'),
    meta: {
      requiresAuth: true,
      roles: [USER_ROLES.EMPLOYEE],
      layout: 'default',
    },
  },
  {
    path: '/employee/leave-request',
    name: ROUTE_NAMES.EMPLOYEE_LEAVE_REQUEST,
    component: () => import('../../features/employee/leave-request/LeaveRequestView.vue'),
    meta: {
      requiresAuth: true,
      roles: [USER_ROLES.EMPLOYEE],
      layout: 'default',
    },
  },
  {
    path: '/employee/leave-history',
    name: ROUTE_NAMES.EMPLOYEE_LEAVE_HISTORY,
    component: () => import('../../features/employee/leave-history/LeaveHistoryView.vue'),
    meta: {
      requiresAuth: true,
      roles: [USER_ROLES.EMPLOYEE],
      layout: 'default',
    },
  },
]
