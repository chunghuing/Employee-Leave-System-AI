import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLeaveRequestStore } from './leaveRequest.store'
import * as leaveService from '../services/leaveService'
import { ApiError } from '../types'
import type { CreateLeaveRequestPayload, LeaveRequest } from '../types'

vi.mock('../services/leaveService')

const MOCK_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr-001',
    employeeId: 'u-001',
    employeeName: '王小明',
    leaveTypeId: 'lt-001',
    leaveTypeName: '年假',
    status: 'pending',
    startDate: '2026-06-01',
    endDate: '2026-06-02',
    days: 2,
    reason: '出遊',
    createdAt: '2026-05-01T00:00:00.000Z',
  },
  {
    id: 'lr-002',
    employeeId: 'u-001',
    employeeName: '王小明',
    leaveTypeId: 'lt-002',
    leaveTypeName: '病假',
    status: 'approved',
    startDate: '2026-07-10',
    endDate: '2026-07-10',
    days: 1,
    reason: '感冒',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
]

const MOCK_PAYLOAD: CreateLeaveRequestPayload = {
  leaveTypeId: 'lt-001',
  startDate: '2026-08-01',
  endDate: '2026-08-03',
  reason: '旅遊',
}

describe('leaveRequest.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches and stores the leave requests on success', async () => {
    vi.mocked(leaveService.getMyLeaveRequests).mockResolvedValue(MOCK_REQUESTS)

    const store = useLeaveRequestStore()
    const promise = store.fetchMyRequests()

    expect(store.loading).toBe(true)
    await promise

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.requests).toEqual(MOCK_REQUESTS)
  })

  it('sets the error state when fetchMyRequests fails', async () => {
    vi.mocked(leaveService.getMyLeaveRequests).mockRejectedValue(new ApiError('請先登入', 401))

    const store = useLeaveRequestStore()
    await store.fetchMyRequests()

    expect(store.loading).toBe(false)
    expect(store.error).toBe('請先登入')
    expect(store.requests).toEqual([])
  })

  it('appends the new request on submitRequest success', async () => {
    const newRequest: LeaveRequest = {
      id: 'lr-003',
      employeeId: 'u-001',
      employeeName: '王小明',
      leaveTypeId: 'lt-001',
      leaveTypeName: '年假',
      status: 'pending',
      startDate: MOCK_PAYLOAD.startDate,
      endDate: MOCK_PAYLOAD.endDate,
      days: 3,
      reason: MOCK_PAYLOAD.reason,
      createdAt: '2026-07-10T00:00:00.000Z',
    }
    vi.mocked(leaveService.createLeaveRequest).mockResolvedValue(newRequest)

    const store = useLeaveRequestStore()
    store.requests = [...MOCK_REQUESTS]
    const promise = store.submitRequest(MOCK_PAYLOAD)

    expect(store.submitting).toBe(true)
    await promise

    expect(store.submitting).toBe(false)
    expect(store.error).toBeNull()
    expect(store.requests).toEqual([...MOCK_REQUESTS, newRequest])
  })

  it('sets the error state and rethrows when submitRequest fails', async () => {
    vi.mocked(leaveService.createLeaveRequest).mockRejectedValue(
      new ApiError('結束日期不得早於開始日期', 400),
    )

    const store = useLeaveRequestStore()

    await expect(store.submitRequest(MOCK_PAYLOAD)).rejects.toThrow('結束日期不得早於開始日期')

    expect(store.submitting).toBe(false)
    expect(store.error).toBe('結束日期不得早於開始日期')
    expect(store.requests).toEqual([])
  })

  it('sorts requests by start date descending via the sortedRequests getter', () => {
    const store = useLeaveRequestStore()
    store.requests = [...MOCK_REQUESTS]

    expect(store.sortedRequests.map((request) => request.id)).toEqual(['lr-002', 'lr-001'])
  })
})
