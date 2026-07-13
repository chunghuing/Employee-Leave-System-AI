import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLeaveTypeStore } from './leaveType.store'
import * as leaveTypeService from '../services/leaveTypeService'
import { ApiError } from '../types'
import type { CreateLeaveTypePayload, LeaveType, UpdateLeaveTypePayload } from '../types'

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

  it('appends the new leave type to leaveTypes on createLeaveType success', async () => {
    const payload: CreateLeaveTypePayload = {
      name: '喪假',
      totalDays: 8,
      description: '至親過世使用',
    }
    const created: LeaveType = { id: 'lt-004', ...payload }
    vi.mocked(leaveTypeService.createLeaveType).mockResolvedValue(created)

    const store = useLeaveTypeStore()
    store.leaveTypes = [...MOCK_LEAVE_TYPES]
    const promise = store.createLeaveType(payload)

    expect(store.submitting).toBe(true)
    await promise

    expect(store.submitting).toBe(false)
    expect(store.error).toBeNull()
    expect(store.leaveTypes.map((leaveType) => leaveType.id)).toEqual([
      'lt-001',
      'lt-002',
      'lt-003',
      'lt-004',
    ])
  })

  it('keeps leaveTypes unchanged and sets the error state when createLeaveType fails', async () => {
    vi.mocked(leaveTypeService.createLeaveType).mockRejectedValue(
      new ApiError('請填寫完整的假別資訊', 400),
    )

    const store = useLeaveTypeStore()
    store.leaveTypes = [...MOCK_LEAVE_TYPES]

    await expect(
      store.createLeaveType({ name: '', totalDays: 0, description: '' }),
    ).rejects.toThrow('請填寫完整的假別資訊')

    expect(store.submitting).toBe(false)
    expect(store.error).toBe('請填寫完整的假別資訊')
    expect(store.leaveTypes).toEqual(MOCK_LEAVE_TYPES)
  })

  it('updates the matching leave type in leaveTypes on updateLeaveType success', async () => {
    const payload: UpdateLeaveTypePayload = {
      name: '年假(更新)',
      totalDays: 20,
      description: '更新後說明',
    }
    const updated: LeaveType = { id: 'lt-001', ...payload }
    vi.mocked(leaveTypeService.updateLeaveType).mockResolvedValue(updated)

    const store = useLeaveTypeStore()
    store.leaveTypes = [...MOCK_LEAVE_TYPES]
    const promise = store.updateLeaveType('lt-001', payload)

    expect(store.processingId).toBe('lt-001')
    await promise

    expect(store.processingId).toBeNull()
    expect(store.error).toBeNull()
    expect(store.leaveTypes.find((leaveType) => leaveType.id === 'lt-001')).toEqual(updated)
  })

  it('keeps leaveTypes unchanged and sets the error state when updateLeaveType fails', async () => {
    vi.mocked(leaveTypeService.updateLeaveType).mockRejectedValue(
      new ApiError('找不到對應的假別', 404),
    )

    const store = useLeaveTypeStore()
    store.leaveTypes = [...MOCK_LEAVE_TYPES]

    await expect(
      store.updateLeaveType('lt-999', { name: 'x', totalDays: 1, description: 'y' }),
    ).rejects.toThrow('找不到對應的假別')

    expect(store.processingId).toBeNull()
    expect(store.error).toBe('找不到對應的假別')
    expect(store.leaveTypes).toEqual(MOCK_LEAVE_TYPES)
  })

  it('removes the leave type from leaveTypes on deleteLeaveType success', async () => {
    vi.mocked(leaveTypeService.deleteLeaveType).mockResolvedValue(MOCK_LEAVE_TYPES[0])

    const store = useLeaveTypeStore()
    store.leaveTypes = [...MOCK_LEAVE_TYPES]
    const promise = store.deleteLeaveType('lt-001')

    expect(store.processingId).toBe('lt-001')
    await promise

    expect(store.processingId).toBeNull()
    expect(store.error).toBeNull()
    expect(store.leaveTypes.map((leaveType) => leaveType.id)).toEqual(['lt-002', 'lt-003'])
  })

  it('keeps leaveTypes unchanged and sets the error state when deleteLeaveType fails', async () => {
    vi.mocked(leaveTypeService.deleteLeaveType).mockRejectedValue(
      new ApiError('找不到對應的假別', 404),
    )

    const store = useLeaveTypeStore()
    store.leaveTypes = [...MOCK_LEAVE_TYPES]

    await expect(store.deleteLeaveType('lt-999')).rejects.toThrow('找不到對應的假別')

    expect(store.processingId).toBeNull()
    expect(store.error).toBe('找不到對應的假別')
    expect(store.leaveTypes).toEqual(MOCK_LEAVE_TYPES)
  })
})
