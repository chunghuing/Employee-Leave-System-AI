import type { LeaveStatus } from '../types'

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const satisfies Record<string, LeaveStatus>

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  pending: '待審核',
  approved: '已核准',
  rejected: '已駁回',
}
