import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http } from './http'
import { approveLeaveRequest, getPendingApprovals, rejectLeaveRequest } from './approvalService'
import { ApiError } from '../types'
import type { LeaveRequest } from '../types'

const MOCK_REQUEST: LeaveRequest = {
  id: 'lr-003',
  employeeId: 'u-001',
  employeeName: '王小明',
  leaveTypeId: 'lt-003',
  leaveTypeName: '事假',
  status: 'pending',
  startDate: '2026-07-15',
  endDate: '2026-07-15',
  days: 1,
  reason: '個人事務',
  createdAt: '2026-07-08T10:00:00.000Z',
}

describe('approvalService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('getPendingApprovals fetches the pending list', async () => {
    const getSpy = vi.spyOn(http, 'get').mockResolvedValue({ data: [MOCK_REQUEST] })

    const result = await getPendingApprovals()

    expect(getSpy).toHaveBeenCalledWith('/approvals/pending')
    expect(result).toEqual([MOCK_REQUEST])
  })

  it('getPendingApprovals propagates errors', async () => {
    vi.spyOn(http, 'get').mockRejectedValue(new ApiError('請先登入', 401))

    await expect(getPendingApprovals()).rejects.toThrow('請先登入')
  })

  it('approveLeaveRequest posts to the approve endpoint', async () => {
    const approved: LeaveRequest = { ...MOCK_REQUEST, status: 'approved' }
    const postSpy = vi.spyOn(http, 'post').mockResolvedValue({ data: approved })

    const result = await approveLeaveRequest('lr-003')

    expect(postSpy).toHaveBeenCalledWith('/approvals/lr-003/approve')
    expect(result).toEqual(approved)
  })

  it('approveLeaveRequest propagates errors', async () => {
    vi.spyOn(http, 'post').mockRejectedValue(new ApiError('此申請已處理，無法重複審核', 400))

    await expect(approveLeaveRequest('lr-003')).rejects.toThrow('此申請已處理，無法重複審核')
  })

  it('rejectLeaveRequest posts to the reject endpoint', async () => {
    const rejected: LeaveRequest = { ...MOCK_REQUEST, status: 'rejected' }
    const postSpy = vi.spyOn(http, 'post').mockResolvedValue({ data: rejected })

    const result = await rejectLeaveRequest('lr-003')

    expect(postSpy).toHaveBeenCalledWith('/approvals/lr-003/reject')
    expect(result).toEqual(rejected)
  })

  it('rejectLeaveRequest propagates errors', async () => {
    vi.spyOn(http, 'post').mockRejectedValue(new ApiError('找不到對應的請假申請', 404))

    await expect(rejectLeaveRequest('lr-999')).rejects.toThrow('找不到對應的請假申請')
  })
})
