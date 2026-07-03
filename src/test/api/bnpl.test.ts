import { describe, it, expect } from 'vitest'
import { bnplApi } from '../../api/bnpl'

describe('bnplApi', () => {
  it('getCredit — returns credit info with limits', async () => {
    const res = await bnplApi.getCredit(1)
    const c = res.data.data
    expect(c).toHaveProperty('totalLimit')
    expect(c).toHaveProperty('usedLimit')
    expect(c).toHaveProperty('availableLimit')
    expect(c.availableLimit).toBeLessThanOrEqual(c.totalLimit)
  })

  it('increaseCredit — returns 200', async () => {
    const res = await bnplApi.increaseCredit(1, 10000000)
    expect(res.status).toBe(200)
  })
})
