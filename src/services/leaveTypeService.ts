import { http } from './http'
import type { CreateLeaveTypePayload, LeaveType, UpdateLeaveTypePayload } from '../types'

export async function getLeaveTypes(): Promise<LeaveType[]> {
  const response = await http.get<LeaveType[]>('/leave-types')

  return response.data
}

export async function createLeaveType(payload: CreateLeaveTypePayload): Promise<LeaveType> {
  const response = await http.post<LeaveType>('/leave-types', payload)

  return response.data
}

export async function updateLeaveType(
  id: string,
  payload: UpdateLeaveTypePayload,
): Promise<LeaveType> {
  const response = await http.put<LeaveType>(`/leave-types/${id}`, payload)

  return response.data
}

export async function deleteLeaveType(id: string): Promise<LeaveType> {
  const response = await http.delete<LeaveType>(`/leave-types/${id}`)

  return response.data
}
