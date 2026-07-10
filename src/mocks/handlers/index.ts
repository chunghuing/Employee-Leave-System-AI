import type { HttpHandler } from 'msw'
import { authHandlers } from './auth.handlers'
import { leaveHandlers } from './leave.handlers'
import { leaveTypeHandlers } from './leaveType.handlers'

export const handlers: HttpHandler[] = [...authHandlers, ...leaveHandlers, ...leaveTypeHandlers]
