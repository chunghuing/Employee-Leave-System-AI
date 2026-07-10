import { http } from './http'
import type { LeaveBalance } from '../types'

export async function getMyBalance(): Promise<LeaveBalance[]> {
  const response = await http.get<LeaveBalance[]>('/leave-balances')

  return response.data
}
