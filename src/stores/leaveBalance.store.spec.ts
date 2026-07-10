import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLeaveBalanceStore } from './leaveBalance.store'
import * as leaveService from '../services/leaveService'
import { ApiError } from '../types'
import type { LeaveBalance } from '../types'

vi.mock('../services/leaveService')

const MOCK_BALANCES: LeaveBalance[] = [
  { leaveTypeId: 'lt-001', leaveTypeName: '年假', totalDays: 14, remainingDays: 10 },
  { leaveTypeId: 'lt-002', leaveTypeName: '病假', totalDays: 30, remainingDays: 28 },
  { leaveTypeId: 'lt-003', leaveTypeName: '事假', totalDays: 14, remainingDays: 13 },
]

describe('leaveBalance.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetches and stores the balance on success', async () => {
    vi.mocked(leaveService.getMyBalance).mockResolvedValue(MOCK_BALANCES)

    const store = useLeaveBalanceStore()
    const promise = store.fetchBalance()

    expect(store.loading).toBe(true)
    await promise

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.balances).toEqual(MOCK_BALANCES)
  })

  it('sets the error state when the service throws', async () => {
    vi.mocked(leaveService.getMyBalance).mockRejectedValue(new ApiError('請先登入', 401))

    const store = useLeaveBalanceStore()
    await store.fetchBalance()

    expect(store.loading).toBe(false)
    expect(store.error).toBe('請先登入')
    expect(store.balances).toEqual([])
  })
})
