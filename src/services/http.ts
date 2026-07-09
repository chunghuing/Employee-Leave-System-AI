import axios, { type AxiosError } from 'axios'
import { STORAGE_KEYS } from '../constants'
import { ApiError } from '../types'

const REQUEST_TIMEOUT_MS = 10000

export const http = axios.create({
  baseURL: '/api',
  timeout: REQUEST_TIMEOUT_MS,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message ?? error.message

    return Promise.reject(new ApiError(message, error.response?.status))
  },
)
