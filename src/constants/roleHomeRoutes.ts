import { USER_ROLES } from './roles'
import { ROUTE_NAMES } from './routeNames'
import type { UserRole } from '../types'

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  [USER_ROLES.EMPLOYEE]: ROUTE_NAMES.EMPLOYEE_LEAVE_BALANCE,
  [USER_ROLES.MANAGER]: ROUTE_NAMES.MANAGER_APPROVAL,
  [USER_ROLES.HR]: ROUTE_NAMES.HR_LEAVE_RECORDS,
}
