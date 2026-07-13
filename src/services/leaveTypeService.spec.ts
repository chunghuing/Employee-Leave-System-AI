import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http } from './http'
import {
  createLeaveType,
  deleteLeaveType,
  getLeaveTypes,
  updateLeaveType,
} from './leaveTypeService'
import { ApiError } from '../types'
import type { CreateLeaveTypePayload, LeaveType, UpdateLeaveTypePayload } from '../types'

const MOCK_LEAVE_TYPES: LeaveType[] = [
  { id: 'lt-001', name: '年假', totalDays: 18, description: '滿一年後每年享有的特休假' },
  { id: 'lt-002', name: '病假', totalDays: 30, description: '因病就診或休養使用' },
]

describe('leaveTypeService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('getLeaveTypes fetches the leave type list', async () => {
    const getSpy = vi.spyOn(http, 'get').mockResolvedValue({ data: MOCK_LEAVE_TYPES })

    const result = await getLeaveTypes()

    expect(getSpy).toHaveBeenCalledWith('/leave-types')
    expect(result).toEqual(MOCK_LEAVE_TYPES)
  })

  it('getLeaveTypes propagates errors', async () => {
    vi.spyOn(http, 'get').mockRejectedValue(new ApiError('取得假別失敗', 500))

    await expect(getLeaveTypes()).rejects.toThrow('取得假別失敗')
  })

  it('createLeaveType posts the new leave type', async () => {
    const payload: CreateLeaveTypePayload = {
      name: '喪假',
      totalDays: 8,
      description: '至親過世使用',
    }
    const created: LeaveType = { id: 'lt-004', ...payload }
    const postSpy = vi.spyOn(http, 'post').mockResolvedValue({ data: created })

    const result = await createLeaveType(payload)

    expect(postSpy).toHaveBeenCalledWith('/leave-types', payload)
    expect(result).toEqual(created)
  })

  it('createLeaveType propagates errors', async () => {
    vi.spyOn(http, 'post').mockRejectedValue(new ApiError('請填寫完整的假別資訊', 400))

    await expect(
      createLeaveType({ name: '', totalDays: 0, description: '' }),
    ).rejects.toThrow('請填寫完整的假別資訊')
  })

  it('updateLeaveType puts the updated leave type', async () => {
    const payload: UpdateLeaveTypePayload = {
      name: '年假(更新)',
      totalDays: 20,
      description: '更新後說明',
    }
    const updated: LeaveType = { id: 'lt-001', ...payload }
    const putSpy = vi.spyOn(http, 'put').mockResolvedValue({ data: updated })

    const result = await updateLeaveType('lt-001', payload)

    expect(putSpy).toHaveBeenCalledWith('/leave-types/lt-001', payload)
    expect(result).toEqual(updated)
  })

  it('updateLeaveType propagates errors', async () => {
    vi.spyOn(http, 'put').mockRejectedValue(new ApiError('找不到對應的假別', 404))

    await expect(
      updateLeaveType('lt-999', { name: 'x', totalDays: 1, description: 'y' }),
    ).rejects.toThrow('找不到對應的假別')
  })

  it('deleteLeaveType deletes the leave type', async () => {
    const deleted = MOCK_LEAVE_TYPES[0]
    const deleteSpy = vi.spyOn(http, 'delete').mockResolvedValue({ data: deleted })

    const result = await deleteLeaveType('lt-001')

    expect(deleteSpy).toHaveBeenCalledWith('/leave-types/lt-001')
    expect(result).toEqual(deleted)
  })

  it('deleteLeaveType propagates errors', async () => {
    vi.spyOn(http, 'delete').mockRejectedValue(new ApiError('找不到對應的假別', 404))

    await expect(deleteLeaveType('lt-999')).rejects.toThrow('找不到對應的假別')
  })
})
