import { http, HttpResponse } from 'msw'

const API = 'http://localhost'

const fakeJwt = () => {
  const payload = btoa(JSON.stringify({ sub: '1', role_id: '1', name: 'Admin Test', phone: '09000000000', exp: 9999999999 }))
  return `header.${payload}.sig`
}

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────────────
  http.post(`${API}/api/v1/Identity/Auth/RequestOtp`, () =>
    HttpResponse.json({ success: true })),

  http.post(`${API}/api/v1/Identity/Auth/VerifyOtp`, () =>
    HttpResponse.json({
      data: { accessToken: fakeJwt(), refreshToken: 'refresh-token', expiresIn: 3600 }
    })),

  http.post(`${API}/api/v1/Identity/Auth/Logout`, () =>
    HttpResponse.json({ success: true })),

  // ── Products ───────────────────────────────────────────────────────────
  http.get(`${API}/api/v1/Product`, () =>
    HttpResponse.json({
      items: [
        { id: 1, name: 'غذای سگ', description: 'توضیح', price: 150000, categoryId: 1, status: 0 },
        { id: 2, name: 'اسباب‌بازی', description: 'توضیح', price: 80000, categoryId: 2, status: 1 },
      ],
      totalCount: 2, page: 1, pageSize: 15, totalPages: 1,
      hasNextPage: false, hasPreviousPage: false,
    })),

  http.post(`${API}/api/v1/Product`, () =>
    HttpResponse.json({ data: 3 }, { status: 200 })),

  http.patch(`${API}/api/v1/Product/:id/Activate`, () =>
    HttpResponse.json({ data: 1 })),

  http.patch(`${API}/api/v1/Product/:id/Deactivate`, () =>
    HttpResponse.json({ data: 1 })),

  http.patch(`${API}/api/v1/Product/:id/Archive`, () =>
    HttpResponse.json({ data: 1 })),

  http.get(`${API}/api/v1/Product/Categories`, () =>
    HttpResponse.json({ data: [{ id: 1, name: 'غذا' }, { id: 2, name: 'اسباب‌بازی' }] })),

  // ── Orders ────────────────────────────────────────────────────────────
  http.get(`${API}/api/v1/Order`, () =>
    HttpResponse.json({
      data: {
        items: [
          { id: 1, userId: 1, status: 1, totalAmount: 250000, items: [], placedAt: '2024-01-01T10:00:00' },
          { id: 2, userId: 2, status: 4, totalAmount: 500000, items: [], placedAt: '2024-01-02T10:00:00' },
        ],
        totalCount: 2, page: 1, pageSize: 12, totalPages: 1,
      }
    })),

  http.post(`${API}/api/v1/Order/:id/Confirm`, () =>
    HttpResponse.json({ data: 1 })),

  http.post(`${API}/api/v1/Order/:id/Cancel`, () =>
    HttpResponse.json({ data: 1 })),

  // ── BNPL ──────────────────────────────────────────────────────────────
  http.get(`${API}/api/v1/bnpl/users/:userId/credit`, () =>
    HttpResponse.json({ data: { userId: 1, totalLimit: 5000000, usedLimit: 1000000, availableLimit: 4000000 } })),

  http.put(`${API}/api/v1/bnpl/users/:userId/credit/increase`, () =>
    HttpResponse.json({ data: 1 })),

  // ── Discounts ─────────────────────────────────────────────────────────
  http.get(`${API}/api/v1/Discounts`, () =>
    HttpResponse.json({
      data: {
        items: [{ id: 1, code: 'TEST20', title: 'تخفیف تست', type: 0, value: 20, usageCount: 5, isActive: true, createdAt: '2024-01-01' }],
        totalCount: 1, page: 1, pageSize: 20, totalPages: 1,
      }
    })),

  http.post(`${API}/api/v1/Discounts`, () =>
    HttpResponse.json({ data: 1 })),

  // ── BackOffice ────────────────────────────────────────────────────────
  http.get(`${API}/api/v1/BackOffice/Admins`, () =>
    HttpResponse.json({
      data: {
        items: [{ id: 1, fullName: 'مدیر اصلی', email: 'admin@test.com', role: 0, status: 0, createdAt: '2024-01-01' }],
        totalCount: 1, page: 1, pageSize: 20, totalPages: 1,
      }
    })),

  // ── Marketing ─────────────────────────────────────────────────────────
  http.post(`${API}/api/v1/Marketing/sms/broadcast`, () =>
    HttpResponse.json({ data: 150 })),
]
