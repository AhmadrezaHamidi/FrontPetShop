import axios from 'axios'

export const API_VERSION = 1
export const BASE_URL = import.meta.env.VITE_API_URL ?? ''

const client = axios.create({ baseURL: BASE_URL })

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

client.interceptors.response.use(
  r => r,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const res = await axios.post(
            `${BASE_URL}/api/v${API_VERSION}/Identity/Auth/RefreshToken`,
            { refreshToken: refresh }
          )
          const { accessToken, refreshToken } = res.data?.data ?? res.data
          localStorage.setItem('access_token', accessToken)
          localStorage.setItem('refresh_token', refreshToken)
          original.headers.Authorization = `Bearer ${accessToken}`
          return client(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default client
