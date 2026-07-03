import { describe, it, expect } from 'vitest'
import { authApi } from '../../api/auth'

describe('authApi', () => {
  it('requestOtp — returns success', async () => {
    const res = await authApi.requestOtp('09000000000')
    expect(res.status).toBe(200)
  })

  it('verifyOtp — returns accessToken and refreshToken', async () => {
    const res = await authApi.verifyOtp('09000000000', '000000')
    const { accessToken, refreshToken } = res.data.data
    expect(accessToken).toBeTruthy()
    expect(refreshToken).toBeTruthy()
  })

  it('verifyOtp — accessToken is valid JWT (3 parts)', async () => {
    const res = await authApi.verifyOtp('09000000000', '000000')
    const parts = res.data.data.accessToken.split('.')
    expect(parts).toHaveLength(3)
  })

  it('logout — returns success', async () => {
    const res = await authApi.logout('refresh-token')
    expect(res.status).toBe(200)
  })
})
