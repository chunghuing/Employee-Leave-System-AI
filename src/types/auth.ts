import type { User } from './user'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResult {
  user: User
  token: string
}
