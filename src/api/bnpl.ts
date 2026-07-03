import client, { API_VERSION } from './client'
import type { BnplContract, CreditInfo, Installment, PagedResult } from '../types'

const base = `/api/v${API_VERSION}/bnpl`

export const bnplApi = {
  getCredit: (userId: number) =>
    client.get<{ data: CreditInfo }>(`${base}/users/${userId}/credit`),

  increaseCredit: (userId: number, newLimit: number) =>
    client.put(`${base}/users/${userId}/credit/increase`, { newLimit }),

  blockCredit: (userId: number, amount: number) =>
    client.patch(`${base}/users/${userId}/credit/block`, { amount }),

  releaseCredit: (userId: number, amount: number) =>
    client.patch(`${base}/users/${userId}/credit/release`, { amount }),

  createContract: (orderId: number, installmentCount: number) =>
    client.post<{ data: number }>(`${base}/contracts`, { orderId, installmentCount }),

  getContract: (id: number) =>
    client.get<{ data: BnplContract }>(`${base}/contracts/${id}`),

  getUserContracts: (userId: number, p?: { page?: number; pageSize?: number }) =>
    client.get<{ data: PagedResult<BnplContract> }>(`${base}/users/${userId}/contracts`, { params: p }),

  getInstallments: (contractId: number) =>
    client.get<{ data: Installment[] }>(`${base}/contracts/${contractId}/installments`),

  payInstallment: (contractId: number, installmentId: number) =>
    client.post(`${base}/contracts/${contractId}/installments/${installmentId}/pay`),

  defaultContract: (id: number) =>
    client.patch(`${base}/contracts/${id}/default`),

  cancelContract: (id: number) =>
    client.patch(`${base}/contracts/${id}/cancel`),
}
