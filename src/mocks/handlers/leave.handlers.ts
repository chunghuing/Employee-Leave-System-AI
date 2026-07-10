import { http, HttpResponse } from 'msw'
import { MOCK_LEAVE_BALANCES } from '../data/leaveBalances'
import { MOCK_USERS } from '../data/users'

function resolveCurrentUserId(request: Request): string | undefined {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return undefined
  }

  return MOCK_USERS.find((user) => token.startsWith(`mock-token-${user.id}-`))?.id
}

export const leaveHandlers = [
  http.get('/api/leave-balances', ({ request }) => {
    const userId = resolveCurrentUserId(request)

    if (!userId) {
      return HttpResponse.json({ message: '請先登入' }, { status: 401 })
    }

    return HttpResponse.json(MOCK_LEAVE_BALANCES[userId])
  }),
]
