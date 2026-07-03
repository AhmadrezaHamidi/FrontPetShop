import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../../api/orders'
import { productsApi } from '../../api/products'
import { ORDER_STATUS_LABEL, ORDER_STATUS_PILL } from '../../types'

export default function AdminDashboard() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['dash-orders'],
    queryFn: () => ordersApi.getAll({ page: 1, pageSize: 8 }),
  })
  const { data: productsData } = useQuery({
    queryKey: ['dash-products'],
    queryFn: () => productsApi.getAll({ page: 1, pageSize: 1 }),
  })

  const orders = ordersData?.data?.data?.items ?? ordersData?.data?.items ?? []
  const totalOrders   = ordersData?.data?.data?.totalCount ?? ordersData?.data?.totalCount ?? 0
  const totalProducts = productsData?.data?.totalCount ?? 0

  return (
    <>
      <div className="hdr">
        <div>
          <h2 style={{ margin: 0 }}>داشبورد ادمین</h2>
          <p style={{ color: 'var(--text2)', fontSize: '.85rem', marginTop: 4 }}>
            {new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {[
          { icon: '🛒', bg: '#EDE9FF', color: '#5C35D4', val: totalOrders, lbl: 'کل سفارش‌ها' },
          { icon: '📦', bg: '#CFFAFE', color: '#0891B2', val: totalProducts, lbl: 'کل محصولات' },
          { icon: '✅', bg: '#D1FAE5', color: '#059669', val: orders.filter(o => o.status === 2).length, lbl: 'تأیید شده' },
          { icon: '🚚', bg: '#FEF3C7', color: '#D97706', val: orders.filter(o => o.status === 3).length, lbl: 'ارسال شده' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div className="icon-wrap" style={{ background: s.bg }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div className="val">{s.val.toLocaleString('fa-IR')}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>آخرین سفارش‌ها</h3>
        {isLoading ? <div className="spinner-center"><div className="spinner" /></div> : (
          <table>
            <thead><tr><th>#</th><th>مبلغ (ت)</th><th>وضعیت</th><th>تاریخ</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: 'var(--p)' }}>#{o.id}</td>
                  <td>{o.totalAmount.toLocaleString('fa-IR')}</td>
                  <td><span className={`pill ${ORDER_STATUS_PILL[o.status] ?? 'pill-gray'}`}>{ORDER_STATUS_LABEL[o.status] ?? o.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{o.placedAt ? new Date(o.placedAt).toLocaleDateString('fa-IR') : '—'}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={4} className="empty">سفارشی یافت نشد</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
