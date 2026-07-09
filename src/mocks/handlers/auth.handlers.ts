import { http, HttpResponse } from 'msw'
import { MOCK_USERS } from '../data/users'
import type { LoginCredentials, LoginResult, User } from '../../types'

function createMockToken(userId: string): string {
  return `mock-token-${userId}-${Date.now()}`
}

export const authHandlers = [
  http.post<never, LoginCredentials>('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()
    const matchedUser = MOCK_USERS.find(
      (user) => user.email === email && user.password === password,
    )

    if (!matchedUser) {
      return HttpResponse.json({ message: '帳號或密碼錯誤' }, { status: 401 })
    }

    const user: User = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    }

    const result: LoginResult = {
      user,
      token: createMockToken(user.id),
    }

    return HttpResponse.json(result)
  }),
]
