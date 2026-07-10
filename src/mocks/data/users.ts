import type { User } from '../../types'
import { USER_ROLES } from '../../constants'

interface MockUserRecord extends User {
  password: string
}

export const MOCK_USERS: MockUserRecord[] = [
  {
    id: 'u-001',
    name: '王小明',
    email: 'employee@example.com',
    role: USER_ROLES.EMPLOYEE,
    password: 'password123',
  },
  {
    id: 'u-002',
    name: '陳經理',
    email: 'manager@example.com',
    role: USER_ROLES.MANAGER,
    password: 'password123',
  },
  {
    id: 'u-003',
    name: '林人資',
    email: 'hr@example.com',
    role: USER_ROLES.HR,
    password: 'password123',
  },
  {
    id: 'u-004',
    name: '李小華',
    email: 'employee2@example.com',
    role: USER_ROLES.EMPLOYEE,
    password: 'password123',
  },
]
