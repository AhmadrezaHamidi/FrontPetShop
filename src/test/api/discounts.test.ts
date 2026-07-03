import { describe, it, expect } from 'vitest'
import { discountsApi } from '../../api/discounts'

describe('discountsApi', () => {
  it('getAll — returns items array', async () => {
    const res = await discountsApi.getAll()
    const items = (res.data as any).data?.items ?? []
    expect(items).toBeInstanceOf(Array)
  })

  it('getAll — each discount has code, type, value', async () => {
    const res = await discountsApi.getAll()
    const items = (res.data as any).data?.items ?? []
    for (const d of items) {
      expect(d).toHaveProperty('code')
      expect(d).toHaveProperty('type')
      expect(d).toHaveProperty('value')
      expect([0, 1]).toContain(d.type)
    }
  })

  it('create — returns numeric id', async () => {
    const res = await discountsApi.create({ code: 'TEST50', title: 'تخفیف ۵۰٪', type: 0, value: 50 })
    expect(typeof res.data.data).toBe('number')
  })
})
