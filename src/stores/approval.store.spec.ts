import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useApprovalStore } from './approval.store'
import * as approvalService from '../services/approvalService'
import { ApiError } from '../types'
import type { LeaveRequest } from '../types'

vi.mock('../services/approvalService')

const MOCK_PENDING: LeaveRequest[] = [
  {
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
  },
  {
    id: 'lr-004',
    employeeId: 'u-004',
    employeeName: '李小華',
    leaveTypeId: 'lt-001',
    leaveTypeName: '年假',
    status: 'pending',
    startDate: '2026-07-20',
    endDate: '2026-07-21',
    days: 2,
    reason: '返鄉探親',
    createdAt: '2026-07-09T09:00:00.000Z',
  },
]

describe('approval.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches and stores the pending list on success', async () => {
    vi.mocked(approvalService.getPendingApprovals).mockResolvedValue(MOCK_PENDING)

    const store = useApprovalStore()
    const promise = store.fetchPendingApprovals()

    expect(store.loading).toBe(true)
    await promise

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.pendingRequests).toEqual(MOCK_PENDING)
  })

  it('sets the error state when fetchPendingApprovals fails', async () => {
    vi.mocked(approvalService.getPendingApprovals).mockRejectedValue(new ApiError('請先登入', 401))

    const store = useApprovalStore()
    await store.fetchPendingApprovals()

    expect(store.loading).toBe(false)
    expect(store.error).toBe('請先登入')
    expect(store.pendingRequests).toEqual([])
  })

  it('removes the request from pendingRequests on approve success', async () => {
    const approved: LeaveRequest = { ...MOCK_PENDING[0], status: 'approved' }
    vi.mocked(approvalService.approveLeaveRequest).mockResolvedValue(approved)

    const store = useApprovalStore()
    store.pendingRequests = [...MOCK_PENDING]
    const promise = store.approve('lr-003')

    expect(store.processingId).toBe('lr-003')
    await promise

    expect(store.processingId).toBeNull()
    expect(store.error).toBeNull()
    expect(store.pendingRequests.map((request) => request.id)).toEqual(['lr-004'])
  })

  it('keeps the request and sets the error state when approve fails', async () => {
    vi.mocked(approvalService.approveLeaveRequest).mockRejectedValue(
      new ApiError('此申請已處理，無法重複審核', 400),
    )

    const store = useApprovalStore()
    store.pendingRequests = [...MOCK_PENDING]

    await expect(store.approve('lr-003')).rejects.toThrow('此申請已處理，無法重複審核')

    expect(store.processingId).toBeNull()
    expect(store.error).toBe('此申請已處理，無法重複審核')
    expect(store.pendingRequests.map((request) => request.id)).toEqual(['lr-003', 'lr-004'])
  })

  it('removes the request from pendingRequests on reject success', async () => {
    const rejected: LeaveRequest = { ...MOCK_PENDING[1], status: 'rejected' }
    vi.mocked(approvalService.rejectLeaveRequest).mockResolvedValue(rejected)

    const store = useApprovalStore()
    store.pendingRequests = [...MOCK_PENDING]
    const promise = store.reject('lr-004')

    expect(store.processingId).toBe('lr-004')
    await promise

    expect(store.processingId).toBeNull()
    expect(store.error).toBeNull()
    expect(store.pendingRequests.map((request) => request.id)).toEqual(['lr-003'])
  })

  it('keeps the request and sets the error state when reject fails', async () => {
    vi.mocked(approvalService.rejectLeaveRequest).mockRejectedValue(
      new ApiError('找不到對應的請假申請', 404),
    )

    const store = useApprovalStore()
    store.pendingRequests = [...MOCK_PENDING]

    await expect(store.reject('lr-999')).rejects.toThrow('找不到對應的請假申請')

    expect(store.processingId).toBeNull()
    expect(store.error).toBe('找不到對應的請假申請')
    expect(store.pendingRequests.map((request) => request.id)).toEqual(['lr-003', 'lr-004'])
  })
})
