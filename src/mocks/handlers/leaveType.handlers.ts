import { http, HttpResponse } from 'msw'
import type { CreateLeaveTypePayload, LeaveType, UpdateLeaveTypePayload } from '../../types'
import { MOCK_LEAVE_TYPES } from '../data/leaveTypes'

function isValidPayload(
  payload: Partial<CreateLeaveTypePayload>,
): payload is CreateLeaveTypePayload {
  return Boolean(payload.name && payload.totalDays !== undefined && payload.description)
}

export const leaveTypeHandlers = [
  http.get('/api/leave-types', () => {
    return HttpResponse.json(MOCK_LEAVE_TYPES)
  }),

  http.post<never, Partial<CreateLeaveTypePayload>>('/api/leave-types', async ({ request }) => {
    const payload = await request.json()

    if (!isValidPayload(payload)) {
      return HttpResponse.json({ message: '請填寫完整的假別資訊' }, { status: 400 })
    }

    const newLeaveType: LeaveType = {
      id: `lt-${String(MOCK_LEAVE_TYPES.length + 1).padStart(3, '0')}`,
      name: payload.name,
      totalDays: payload.totalDays,
      description: payload.description,
    }

    MOCK_LEAVE_TYPES.push(newLeaveType)

    return HttpResponse.json(newLeaveType, { status: 201 })
  }),

  http.put<{ id: string }, Partial<UpdateLeaveTypePayload>>(
    '/api/leave-types/:id',
    async ({ request, params }) => {
      const target = MOCK_LEAVE_TYPES.find((leaveType) => leaveType.id === params.id)

      if (!target) {
        return HttpResponse.json({ message: '找不到對應的假別' }, { status: 404 })
      }

      const payload = await request.json()

      if (!isValidPayload(payload)) {
        return HttpResponse.json({ message: '請填寫完整的假別資訊' }, { status: 400 })
      }

      target.name = payload.name
      target.totalDays = payload.totalDays
      target.description = payload.description

      return HttpResponse.json(target)
    },
  ),

  http.delete<{ id: string }>('/api/leave-types/:id', ({ params }) => {
    const index = MOCK_LEAVE_TYPES.findIndex((leaveType) => leaveType.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ message: '找不到對應的假別' }, { status: 404 })
    }

    const [deleted] = MOCK_LEAVE_TYPES.splice(index, 1)

    return HttpResponse.json(deleted)
  }),
]
