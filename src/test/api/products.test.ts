import { describe, it, expect } from 'vitest'
import { productsApi } from '../../api/products'

describe('productsApi', () => {
  it('getAll — returns items array', async () => {
    const res = await productsApi.getAll({ page: 1, pageSize: 15 })
    expect(res.data.items).toBeInstanceOf(Array)
    expect(res.data.totalCount).toBeGreaterThanOrEqual(0)
  })

  it('getAll — each product has required fields', async () => {
    const res = await productsApi.getAll()
    for (const p of res.data.items) {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('price')
      expect(p).toHaveProperty('status')
    }
  })

  it('getAll — status is numeric (0/1/2)', async () => {
    const res = await productsApi.getAll()
    for (const p of res.data.items)
      expect([0, 1, 2]).toContain(p.status)
  })

  it('create — returns numeric id', async () => {
    const res = await productsApi.create({ name: 'تست', description: 'توضیح', price: 10000, categoryId: 1 })
    expect(typeof res.data.data).toBe('number')
    expect(res.data.data).toBeGreaterThan(0)
  })

  it('activate/deactivate/archive — return 200', async () => {
    const a = await productsApi.activate(1)
    const d = await productsApi.deactivate(1)
    const ar = await productsApi.archive(1)
    expect(a.status).toBe(200)
    expect(d.status).toBe(200)
    expect(ar.status).toBe(200)
  })

  it('getCategories — returns array', async () => {
    const res = await productsApi.getCategories()
    const cats = (res.data as any).data ?? res.data
    expect(cats).toBeInstanceOf(Array)
  })

  // edge cases
  it('getAll with search — returns filtered result without error', async () => {
    const res = await productsApi.getAll({ search: 'غذا' })
    expect(res.status).toBe(200)
  })

  it('create with empty name — request still sent (validation is server-side)', async () => {
    const res = await productsApi.create({ name: '', description: '', price: 0, categoryId: 0 })
    expect(res.status).toBe(200)
  })
})
