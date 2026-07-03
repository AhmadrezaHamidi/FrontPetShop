import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { discountsApi } from '../../api/discounts'
import PersianDatePicker from '../../components/PersianDatePicker'

const EMPTY = { code: '', title: '', type: '0' as '0'|'1', value: '', minOrder: '', maxUsage: '', expiresAt: '' }

export default function AdminDiscounts() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [err, setErr] = useState('')
  const inv = () => qc.invalidateQueries({ queryKey: ['discounts'] })

  const { data, isLoading } = useQuery({
    queryKey: ['discounts', page],
    queryFn: () => discountsApi.getAll({ page, pageSize: 20 }),
  })

  const createMut = useMutation({
    mutationFn: () => discountsApi.create({
      code: form.code.toUpperCase(), title: form.title,
      type: Number(form.type) as 0 | 1, value: Number(form.value),
      minOrderAmount: form.minOrder ? Number(form.minOrder) : undefined,
      maxUsage: form.maxUsage ? Number(form.maxUsage) : undefined,
      expiresAt: form.expiresAt || undefined,
    }),
    onSuccess: () => { inv(); setShowAdd(false); setForm(EMPTY); setErr('') },
    onError: () => setErr('خطا در ثبت کد تخفیف.'),
  })
  const activate   = useMutation({ mutationFn: (id: number) => discountsApi.activate(id),   onSuccess: inv })
  const deactivate = useMutation({ mutationFn: (id: number) => discountsApi.deactivate(id), onSuccess: inv })

  const items      = (data?.data as any)?.data?.items ?? (data?.data as any)?.items ?? []
  const totalPages = (data?.data as any)?.data?.totalPages ?? 1
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <>
      <div className="hdr">
        <h2>کدهای تخفیف</h2>
        <button className="btn btn-primary" onClick={() => { setShowAdd(true); setErr('') }}>+ کد جدید</button>
      </div>

      {showAdd && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header"><h3>ایجاد کد تخفیف</h3><button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>✕</button></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label>کد *</label><input value={form.code} onChange={f('code')} placeholder="TEST20" dir="ltr" style={{ width: '100%' }} /></div>
                <div><label>عنوان *</label><input value={form.title} onChange={f('title')} style={{ width: '100%' }} /></div>
                <div><label>نوع</label>
                  <select value={form.type} onChange={f('type')} style={{ width: '100%', padding: '.6rem .8rem', border: '1.5px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '.9rem', background: '#fff' }}>
                    <option value="0">درصدی</option><option value="1">مبلغ ثابت</option>
                  </select></div>
                <div><label>مقدار *</label><input type="number" value={form.value} onChange={f('value')} style={{ width: '100%' }} /></div>
                <div><label>حداقل سفارش</label><input type="number" value={form.minOrder} onChange={f('minOrder')} style={{ width: '100%' }} /></div>
                <div><label>حداکثر استفاده</label><input type="number" value={form.maxUsage} onChange={f('maxUsage')} style={{ width: '100%' }} /></div>
              </div>
              <div><label>تاریخ انقضا</label>
                <PersianDatePicker value={form.expiresAt} onChange={v => setForm(p => ({ ...p, expiresAt: v }))} placeholder="انتخاب تاریخ انقضا" />
              </div>
              {err && <p style={{ color: 'var(--red)', fontSize: 13 }}>{err}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>لغو</button>
              <button className="btn btn-primary" disabled={!form.code || !form.value || createMut.isPending} onClick={() => createMut.mutate()}>
                {createMut.isPending ? 'در حال ثبت...' : 'ثبت'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {isLoading ? <div className="spinner-center"><div className="spinner" /></div> : (
          <table>
            <thead><tr><th>کد</th><th>عنوان</th><th>نوع</th><th>مقدار</th><th>استفاده</th><th>انقضا</th><th>وضعیت</th><th>عملیات</th></tr></thead>
            <tbody>
              {items.map((d: any) => (
                <tr key={d.id}>
                  <td><code style={{ background: 'var(--p-bg)', color: 'var(--p)', padding: '2px 6px', borderRadius: 4 }}>{d.code}</code></td>
                  <td>{d.title}</td>
                  <td>{d.type === 0 ? 'درصدی' : 'ثابت'}</td>
                  <td>{d.value}{d.type === 0 ? '%' : ' ت'}</td>
                  <td>{d.usageCount}{d.maxUsage ? `/${d.maxUsage}` : ''}</td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString('fa-IR') : '—'}</td>
                  <td><span className={`pill ${d.isActive ? 'pill-green' : 'pill-gray'}`}>{d.isActive ? 'فعال' : 'غیرفعال'}</span></td>
                  <td>
                    {d.isActive
                      ? <button className="btn btn-danger btn-sm" onClick={() => deactivate.mutate(d.id)}>غیرفعال</button>
                      : <button className="btn btn-ghost btn-sm"  onClick={() => activate.mutate(d.id)}>فعال</button>}
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={8} className="empty">کد تخفیفی یافت نشد</td></tr>}
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
