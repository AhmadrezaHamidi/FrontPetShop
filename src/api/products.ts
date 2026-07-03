import client, { API_VERSION } from './client'
import type { Product, Category, PagedResult, ProductStatus } from '../types'

const base = `/api/v${API_VERSION}/Product`

export const productsApi = {
  getAll: (p?: { page?: number; pageSize?: number; search?: string; categoryId?: number; status?: ProductStatus }) =>
    client.get<PagedResult<Product>>(base, { params: p }),

  getById: (id: number) =>
    client.get<{ data: Product }>(`${base}/${id}`),

  getCategories: () =>
    client.get<{ data: Category[] }>(`${base}/Categories`),

  create: (payload: { name: string; description: string; price: number; categoryId: number }) =>
    client.post<{ data: number }>(base, payload),

  update: (id: number, payload: Partial<Product>) =>
    client.put(`${base}/${id}`, payload),

  changePrice: (id: number, newPrice: number) =>
    client.patch(`${base}/${id}/Price`, { newPrice }),

  activate:   (id: number) => client.patch(`${base}/${id}/Activate`),
  deactivate: (id: number) => client.patch(`${base}/${id}/Deactivate`),
  archive:    (id: number) => client.patch(`${base}/${id}/Archive`),

  getImages: (id: number) =>
    client.get(`${base}/${id}/Images`),

  addImage: (id: number, url: string, type = 0) =>
    client.post(`${base}/${id}/Images`, { url, bucketKey: '', type }),

  deleteImage: (id: number, imageId: string) =>
    client.delete(`${base}/${id}/Images/${imageId}`),

  setPrimaryImage: (id: number, imageId: string) =>
    client.patch(`${base}/${id}/Images/${imageId}/Primary`),

  getInventory: (id: number) =>
    client.get(`${base}/${id}/Inventory`),

  replenish: (id: number, quantity: number) =>
    client.patch(`${base}/${id}/Inventory/Replenish`, { quantity }),

  reserve: (id: number, quantity: number) =>
    client.patch(`${base}/${id}/Inventory/Reserve`, { quantity }),

  release: (id: number, quantity: number) =>
    client.patch(`${base}/${id}/Inventory/Release`, { quantity }),

  createCategory: (name: string, parentId?: number) =>
    client.post(`${base}/Categories`, { name, parentId }),
}
