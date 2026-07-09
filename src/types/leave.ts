export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveTypeId: string
  leaveTypeName: string
  status: LeaveStatus
  startDate: string
  endDate: string
  days: number
  reason: string
  createdAt: string
}
