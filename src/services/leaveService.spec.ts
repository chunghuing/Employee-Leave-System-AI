import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http } from './http'
import { getAllLeaveRequests } from './leaveService'
import { ApiError } from '../types'
import type { LeaveRequest } from '../types'

const MOCK_RECORDS: LeaveRequest[] = [
  {
    id: 'lr-001',
    employeeId: 'u-001',
    employeeName: '王小明',
    leaveTypeId: 'lt-001',
    leaveTypeName: '年假',
    status: 'approved',
    startDate: '2026-06-01',
    endDate: '2026-06-02',
    days: 2,
    reason: '家庭旅遊',
    createdAt: '2026-05-20T09:00:00.000Z',
  },
]

describe('leaveService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('getAllLeaveRequests fetches all HR leave records', async () => {
    const getSpy = vi.spyOn(http, 'get').mockResolvedValue({ data: MOCK_RECORDS })

    const result = await getAllLeaveRequests()

    expect(getSpy).toHaveBeenCalledWith('/hr/leave-records')
    expect(result).toEqual(MOCK_RECORDS)
  })

  it('getAllLeaveRequests propagates errors', async () => {
    vi.spyOn(http, 'get').mockRejectedValue(new ApiError('請先登入', 401))

    await expect(getAllLeaveRequests()).rejects.toThrow('請先登入')
  })
})
