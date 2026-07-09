import { http } from './http'
import type { LoginCredentials, LoginResult } from '../types'

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const response = await http.post<LoginResult>('/auth/login', credentials)

  return response.data
}
