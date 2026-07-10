import { http } from './http'
import type { LeaveRequest } from '../types'

export async function getPendingApprovals(): Promise<LeaveRequest[]> {
  const response = await http.get<LeaveRequest[]>('/approvals/pending')

  return response.data
}

export async function approveLeaveRequest(id: string): Promise<LeaveRequest> {
  const response = await http.post<LeaveRequest>(`/approvals/${id}/approve`)

  return response.data
}

export async function rejectLeaveRequest(id: string): Promise<LeaveRequest> {
  const response = await http.post<LeaveRequest>(`/approvals/${id}/reject`)

  return response.data
}
