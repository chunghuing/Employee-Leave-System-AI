import { http } from './http'
import type { LeaveType } from '../types'

export async function getLeaveTypes(): Promise<LeaveType[]> {
  const response = await http.get<LeaveType[]>('/leave-types')

  return response.data
}
