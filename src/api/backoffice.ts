import client, { API_VERSION } from './client'
import type { AdminUser, PagedResult } from '../types'

const base = `/api/v${API_VERSION}/BackOffice`

export const backofficeApi = {
  getAdmins: (p?: { page?: number; pageSize?: number }) =>
    client.get<{ data: PagedResult<AdminUser> }>(`${base}/Admins`, { params: p }),

  getAdmin: (id: number) =>
    client.get<{ data: AdminUser }>(`${base}/Admins/${id}`),

  createAdmin: (payload: { fullName: string; email: string; role: number }) =>
    client.post<{ data: number }>(`${base}/Admins`, payload),

  activateAdmin:   (id: number) => client.patch(`${base}/Admins/${id}/Activate`),
  deactivateAdmin: (id: number) => client.patch(`${base}/Admins/${id}/Deactivate`),
  suspendAdmin:    (id: number) => client.patch(`${base}/Admins/${id}/Suspend`),

  changeAdminRole: (id: number, newRole: number) =>
    client.patch(`${base}/Admins/${id}/Role`, { newRole }),

  getAuditLogs: (id: number, p?: { page?: number; pageSize?: number }) =>
    client.get(`${base}/Admins/${id}/AuditLogs`, { params: p }),

  getReports: (p?: { adminId?: number; page?: number; pageSize?: number }) =>
    client.get(`${base}/Reports`, { params: p }),

  requestReport: (reportType: number) =>
    client.post<{ data: number }>(`${base}/Reports`, { reportType }),
}

export const marketingApi = {
  sendBulkSms: (message: string) =>
    client.post<{ data: number }>(`/api/v${API_VERSION}/Marketing/sms/broadcast`, { message }),
}
