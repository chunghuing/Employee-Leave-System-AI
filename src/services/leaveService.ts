import { http } from './http'
import type { CreateLeaveRequestPayload, LeaveBalance, LeaveRequest } from '../types'

export async function getMyBalance(): Promise<LeaveBalance[]> {
  const response = await http.get<LeaveBalance[]>('/leave-balances')

  return response.data
}

export async function getMyLeaveRequests(): Promise<LeaveRequest[]> {
  const response = await http.get<LeaveRequest[]>('/leave-requests')

  return response.data
}

export async function createLeaveRequest(
  payload: CreateLeaveRequestPayload,
): Promise<LeaveRequest> {
  const response = await http.post<LeaveRequest>('/leave-requests', payload)

  return response.data
}

export async function getAllLeaveRequests(): Promise<LeaveRequest[]> {
  const response = await http.get<LeaveRequest[]>('/hr/leave-records')

  return response.data
}
