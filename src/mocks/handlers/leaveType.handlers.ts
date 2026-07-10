import { http, HttpResponse } from 'msw'
import { MOCK_LEAVE_TYPES } from '../data/leaveTypes'

export const leaveTypeHandlers = [
  http.get('/api/leave-types', () => {
    return HttpResponse.json(MOCK_LEAVE_TYPES)
  }),
]
