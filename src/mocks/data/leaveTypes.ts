import type { LeaveType } from '../../types'

export const MOCK_LEAVE_TYPES: LeaveType[] = [
  { id: 'lt-001', name: '年假', totalDays: 18, description: '滿一年後每年享有的特休假' },
  { id: 'lt-002', name: '病假', totalDays: 30, description: '因病就診或休養使用' },
  { id: 'lt-003', name: '事假', totalDays: 14, description: '處理個人重要事務使用' },
]
