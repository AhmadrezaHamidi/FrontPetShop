import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../../api/orders'
import { ORDER_STATUS_LABEL, ORDER_STATUS_PILL } from '../../types'

const STATUS_OPTS = [
  { v: '', l: 'همه' }, { v: '0', l: 'منتظر پرداخت' }, { v: '1', l: 'تأیید شده' },
  { v: '2', l: 'در حال آماده‌سازی' }, { v: '3', l: 'ارسال شده' },
  { v: '4', l: 'تحویل شده' }, { v: '5', l: 'لغو شده' }, { v: '6', l: 'مسترد' },
]

export default function AdminOrders() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [sf, setSf] = useState('')
  const inv = () => qc.invalidateQueries({ queryKey: ['admin-orders'] })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, sf],
    queryFn: () => ordersApi.getAll({ page, pageSize: 12, status: sf ? Number(sf) as any : undefined }),
  })

  const confirm  = useMutation({ mutationFn: (id: number) => ordersApi.confirm(id),  onSuccess: inv })
  const ship     = useMutation({ mutationFn: (id: number) => ordersApi.ship(id),     onSuccess: inv })
  const deliver  = useMutation({ mutationFn: (id: number) => ordersApi.deliver(id),  onSuccess: inv })
  const cancel   = useMutation({ mutationFn: (id: number) => ordersApi.cancel(id),   onSuccess: inv })

  const orders     = data?.data?.data?.items ?? data?.data?.items ?? []
  const total      = data?.data?.data?.totalCount ?? data?.data?.totalCount ?? 0
  const totalPages = data?.data?.data?.totalPages ?? data?.data?.totalPages ?? 1

  return (
    <>
      <div className="hdr">
        <div>
          <h2>سفارش‌ها</h2>
          <p style={{ color: 'var(--text2)', fontSize: '.85rem' }}>مجموع: {total.toLocaleString('fa-IR')} سفارش</p>
        </div>
        <select value={sf} onChange={e => { setSf(e.target.value); setPage(1) }}
          style={{ padding: '.5rem .8rem', border: '1.5px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '.9rem', background: '#fff' }}>
          {STATUS_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>
      <div className="card">
        {isLoading ? <div className="spinner-center"><div className="spinner" /></div> : (
          <table>
            <thead><tr><th>#</th><th>مبلغ</th><th>آیتم</th><th>وضعیت</th><th>تاریخ</th><th>عملیات</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: 'var(--p)' }}>#{o.id}</td>
                  <td>{o.totalAmount.toLocaleString('fa-IR')}</td>
                  <td>{o.items?.length ?? '—'}</td>
                  <td><span className={`pill ${ORDER_STATUS_PILL[o.status] ?? 'pill-gray'}`}>{ORDER_STATUS_LABEL[o.status]}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{o.placedAt ? new Date(o.placedAt).toLocaleDateString('fa-IR') : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {o.status === 1 && <button className="btn btn-primary btn-sm" onClick={() => ship.mutate(o.id)}>ارسال</button>}
                      {o.status === 3 && <button className="btn btn-ghost btn-sm"   onClick={() => deliver.mutate(o.id)}>تحویل</button>}
                      {![4,5,6].includes(o.status) && <button className="btn btn-danger btn-sm" onClick={() => cancel.mutate(o.id)}>لغو</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="empty">سفارشی یافت نشد</td></tr>}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>›</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
              <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>‹</button>
          </div>
        )}
      </div>
    </>
  )
}
