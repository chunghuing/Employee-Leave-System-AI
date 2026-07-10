import { http, HttpResponse } from 'msw'
import { LEAVE_STATUS } from '../../constants'
import type { CreateLeaveRequestPayload, LeaveRequest } from '../../types'
import { MOCK_LEAVE_BALANCES } from '../data/leaveBalances'
import { MOCK_LEAVE_REQUESTS } from '../data/leaveRequests'
import { MOCK_LEAVE_TYPES } from '../data/leaveTypes'
import { MOCK_USERS } from '../data/users'

const MS_PER_DAY = 24 * 60 * 60 * 1000

function resolveCurrentUser(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return undefined
  }

  return MOCK_USERS.find((user) => token.startsWith(`mock-token-${user.id}-`))
}

function isValidCreatePayload(
  payload: Partial<CreateLeaveRequestPayload>,
): payload is CreateLeaveRequestPayload {
  return Boolean(payload.leaveTypeId && payload.startDate && payload.endDate && payload.reason)
}

export const leaveHandlers = [
  http.get('/api/leave-balances', ({ request }) => {
    const user = resolveCurrentUser(request)

    if (!user) {
      return HttpResponse.json({ message: '請先登入' }, { status: 401 })
    }

    return HttpResponse.json(MOCK_LEAVE_BALANCES[user.id])
  }),

  http.get('/api/leave-requests', ({ request }) => {
    const user = resolveCurrentUser(request)

    if (!user) {
      return HttpResponse.json({ message: '請先登入' }, { status: 401 })
    }

    const myRequests = MOCK_LEAVE_REQUESTS.filter(
      (leaveRequest) => leaveRequest.employeeId === user.id,
    )

    return HttpResponse.json(myRequests)
  }),

  http.post<never, Partial<CreateLeaveRequestPayload>>(
    '/api/leave-requests',
    async ({ request }) => {
      const user = resolveCurrentUser(request)

      if (!user) {
        return HttpResponse.json({ message: '請先登入' }, { status: 401 })
      }

      const payload = await request.json()

      if (!isValidCreatePayload(payload)) {
        return HttpResponse.json({ message: '請填寫完整的請假資訊' }, { status: 400 })
      }

      if (payload.endDate < payload.startDate) {
        return HttpResponse.json({ message: '結束日期不得早於開始日期' }, { status: 400 })
      }

      const leaveType = MOCK_LEAVE_TYPES.find((type) => type.id === payload.leaveTypeId)

      if (!leaveType) {
        return HttpResponse.json({ message: '找不到對應的假別' }, { status: 400 })
      }

      const days = (Date.parse(payload.endDate) - Date.parse(payload.startDate)) / MS_PER_DAY + 1

      const newRequest: LeaveRequest = {
        id: `lr-${String(MOCK_LEAVE_REQUESTS.length + 1).padStart(3, '0')}`,
        employeeId: user.id,
        employeeName: user.name,
        leaveTypeId: leaveType.id,
        leaveTypeName: leaveType.name,
        status: LEAVE_STATUS.PENDING,
        startDate: payload.startDate,
        endDate: payload.endDate,
        days,
        reason: payload.reason,
        createdAt: new Date().toISOString(),
      }

      MOCK_LEAVE_REQUESTS.push(newRequest)

      return HttpResponse.json(newRequest, { status: 201 })
    },
  ),
]
