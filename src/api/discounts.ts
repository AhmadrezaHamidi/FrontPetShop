import client, { API_VERSION } from './client'
import type { Discount, PagedResult } from '../types'

const base = `/api/v${API_VERSION}/Discounts`

export const discountsApi = {
  getAll: (p?: { page?: number; pageSize?: number; isActive?: boolean }) =>
    client.get<{ data: PagedResult<Discount> }>(base, { params: p }),

  getById: (id: number) =>
    client.get<{ data: Discount }>(`${base}/${id}`),

  getByCode: (code: string) =>
    client.get<{ data: Discount }>(`${base}/code/${code}`),

  create: (payload: {
    code: string; title: string; type: 0 | 1; value: number
    minOrderAmount?: number; maxUsage?: number; expiresAt?: string
  }) => client.post<{ data: number }>(base, payload),

  activate:   (id: number) => client.put(`${base}/${id}/activate`),
  deactivate: (id: number) => client.put(`${base}/${id}/deactivate`),

  apply: (orderId: number, discountCode: string) =>
    client.post<{ data: number }>(`${base}/apply`, { orderId, discountCode }),
}
