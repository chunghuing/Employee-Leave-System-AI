export interface LeaveType {
  id: string
  name: string
  totalDays: number
  description: string
}

export interface CreateLeaveTypePayload {
  name: string
  totalDays: number
  description: string
}

export interface UpdateLeaveTypePayload {
  name: string
  totalDays: number
  description: string
}
