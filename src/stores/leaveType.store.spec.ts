import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLeaveTypeStore } from './leaveType.store'
import * as leaveTypeService from '../services/leaveTypeService'
import { ApiError } from '../types'
import type { LeaveType } from '../types'

vi.mock('../services/leaveTypeService')

const MOCK_LEAVE_TYPES: LeaveType[] = [
  { id: 'lt-001', name: '年假', totalDays: 18, description: '滿一年後每年享有的特休假' },
  { id: 'lt-002', name: '病假', totalDays: 30, description: '因病就診或休養使用' },
  { id: 'lt-003', name: '事假', totalDays: 14, description: '處理個人重要事務使用' },
]

describe('leaveType.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches and stores the leave types on success', async () => {
    vi.mocked(leaveTypeService.getLeaveTypes).mockResolvedValue(MOCK_LEAVE_TYPES)

    const store = useLeaveTypeStore()
    const promise = store.fetchLeaveTypes()

    expect(store.loading).toBe(true)
    await promise

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.leaveTypes).toEqual(MOCK_LEAVE_TYPES)
  })

  it('sets the error state when the service throws', async () => {
    vi.mocked(leaveTypeService.getLeaveTypes).mockRejectedValue(new ApiError('取得假別失敗', 500))

    const store = useLeaveTypeStore()
    await store.fetchLeaveTypes()

    expect(store.loading).toBe(false)
    expect(store.error).toBe('取得假別失敗')
    expect(store.leaveTypes).toEqual([])
  })
})
