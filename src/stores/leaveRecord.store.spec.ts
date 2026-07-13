import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLeaveRecordStore } from './leaveRecord.store'
import * as leaveService from '../services/leaveService'
import { ApiError } from '../types'
import type { LeaveRequest } from '../types'

vi.mock('../services/leaveService')

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
  {
    id: 'lr-005',
    employeeId: 'u-004',
    employeeName: '李小華',
    leaveTypeId: 'lt-002',
    leaveTypeName: '病假',
    status: 'pending',
    startDate: '2026-07-12',
    endDate: '2026-07-12',
    days: 1,
    reason: '身體不適，需回診',
    createdAt: '2026-07-09T11:00:00.000Z',
  },
]

describe('leaveRecord.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches and stores all records on success', async () => {
    vi.mocked(leaveService.getAllLeaveRequests).mockResolvedValue(MOCK_RECORDS)

    const store = useLeaveRecordStore()
    const promise = store.fetchAllRecords()

    expect(store.loading).toBe(true)
    await promise

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.records).toEqual(MOCK_RECORDS)
  })

  it('sets the error state when fetchAllRecords fails', async () => {
    vi.mocked(leaveService.getAllLeaveRequests).mockRejectedValue(new ApiError('請先登入', 401))

    const store = useLeaveRecordStore()
    await store.fetchAllRecords()

    expect(store.loading).toBe(false)
    expect(store.error).toBe('請先登入')
    expect(store.records).toEqual([])
  })

  it('filteredRecords sorts by startDate descending when no filters are set', () => {
    const store = useLeaveRecordStore()
    store.records = [...MOCK_RECORDS]

    expect(store.filteredRecords.map((record) => record.id)).toEqual([
      'lr-004',
      'lr-005',
      'lr-001',
    ])
  })

  it('filteredRecords filters by searchKeyword', () => {
    const store = useLeaveRecordStore()
    store.records = [...MOCK_RECORDS]
    store.searchKeyword = '小華'

    expect(store.filteredRecords.map((record) => record.id)).toEqual(['lr-004', 'lr-005'])
  })

  it('filteredRecords filters by leaveTypeFilter', () => {
    const store = useLeaveRecordStore()
    store.records = [...MOCK_RECORDS]
    store.leaveTypeFilter = 'lt-002'

    expect(store.filteredRecords.map((record) => record.id)).toEqual(['lr-005'])
  })

  it('filteredRecords applies searchKeyword and leaveTypeFilter together', () => {
    const store = useLeaveRecordStore()
    store.records = [...MOCK_RECORDS]
    store.searchKeyword = '小華'
    store.leaveTypeFilter = 'lt-001'

    expect(store.filteredRecords.map((record) => record.id)).toEqual(['lr-004'])
  })

  it('filteredRecords returns everything when searchKeyword and leaveTypeFilter are empty', () => {
    const store = useLeaveRecordStore()
    store.records = [...MOCK_RECORDS]
    store.searchKeyword = ''
    store.leaveTypeFilter = ''

    expect(store.filteredRecords).toHaveLength(3)
  })
})
