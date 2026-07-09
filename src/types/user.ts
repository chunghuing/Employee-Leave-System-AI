export type UserRole = 'employee' | 'manager' | 'hr'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}
