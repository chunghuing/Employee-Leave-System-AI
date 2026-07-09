import type { LeaveBalance } from '../../types'

export const MOCK_LEAVE_BALANCES: Record<string, LeaveBalance[]> = {
  'u-001': [
    { leaveTypeId: 'lt-001', leaveTypeName: '年假', totalDays: 14, remainingDays: 10 },
    { leaveTypeId: 'lt-002', leaveTypeName: '病假', totalDays: 30, remainingDays: 28 },
    { leaveTypeId: 'lt-003', leaveTypeName: '事假', totalDays: 14, remainingDays: 13 },
  ],
  'u-002': [
    { leaveTypeId: 'lt-001', leaveTypeName: '年假', totalDays: 21, remainingDays: 18 },
    { leaveTypeId: 'lt-002', leaveTypeName: '病假', totalDays: 30, remainingDays: 30 },
    { leaveTypeId: 'lt-003', leaveTypeName: '事假', totalDays: 14, remainingDays: 14 },
  ],
  'u-003': [
    { leaveTypeId: 'lt-001', leaveTypeName: '年假', totalDays: 21, remainingDays: 21 },
    { leaveTypeId: 'lt-002', leaveTypeName: '病假', totalDays: 30, remainingDays: 30 },
    { leaveTypeId: 'lt-003', leaveTypeName: '事假', totalDays: 14, remainingDays: 14 },
  ],
}
