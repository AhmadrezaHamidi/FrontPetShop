import { describe, it, expect } from 'vitest'
import { ordersApi } from '../../api/orders'

describe('ordersApi', () => {
  it('getAll — returns items array', async () => {
    const res = await ordersApi.getAll({ page: 1, pageSize: 12 })
    const data = (res.data as any).data ?? res.data
    expect(data.items).toBeInstanceOf(Array)
  })

  it('getAll — each order has id, status, totalAmount', async () => {
    const res = await ordersApi.getAll()
    const items = (res.data as any).data?.items ?? (res.data as any).items ?? []
    for (const o of items) {
      expect(o).toHaveProperty('id')
      expect(o).toHaveProperty('status')
      expect(o).toHaveProperty('totalAmount')
    }
  })

  it('getAll — order status is numeric', async () => {
    const res = await ordersApi.getAll()
    const items = (res.data as any).data?.items ?? []
    for (const o of items)
      expect([0, 1, 2, 3, 4, 5]).toContain(o.status)
  })

  it('confirm — returns 200', async () => {
    const res = await ordersApi.confirm(1)
    expect(res.status).toBe(200)
  })

  it('cancel — returns 200', async () => {
    const res = await ordersApi.cancel(1, 'تست لغو')
    expect(res.status).toBe(200)
  })

  // edge cases
  it('getAll with status filter — returns 200', async () => {
    const res = await ordersApi.getAll({ status: 1 })
    expect(res.status).toBe(200)
  })
})
