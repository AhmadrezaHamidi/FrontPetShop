import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '../../api/products'
import { PRODUCT_STATUS_LABEL, PRODUCT_STATUS_PILL } from '../../types'

const EMPTY = { name: '', description: '', price: '', categoryId: '', imageUrl: '' }

export default function AdminProducts() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [formErr, setFormErr] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search],
    queryFn: () => productsApi.getAll({ page, pageSize: 15, search: search || undefined }),
  })
  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: productsApi.getCategories })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['products'] })
  const activate   = useMutation({ mutationFn: (id: number) => productsApi.activate(id),   onSuccess: invalidate })
  const deactivate = useMutation({ mutationFn: (id: number) => productsApi.deactivate(id), onSuccess: invalidate })
  const archive    = useMutation({ mutationFn: (id: number) => productsApi.archive(id),    onSuccess: invalidate })

  const createMut = useMutation({
    mutationFn: async () => {
      const res = await productsApi.create({
        name: form.name, description: form.description,
        price: Number(form.price), categoryId: Number(form.categoryId),
      })
      const newId = (res.data as any)?.data ?? res.data
      if (form.imageUrl && newId) await productsApi.addImage(Number(newId), form.imageUrl)
    },
    onSuccess: () => { invalidate(); setShowAdd(false); setForm(EMPTY); setFormErr('') },
    onError: () => setFormErr('خطا در ثبت. دوباره تلاش کنید.'),
  })

  const products   = data?.data?.items ?? []
  const total      = data?.data?.totalCount ?? 0
  const totalPages = data?.data?.totalPages ?? 1
  const cats       = (catData?.data as any)?.data ?? catData?.data ?? []

  return (
    <>
      <div className="hdr">
        <h2>محصولات</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="جستجو..." value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setSearch(q); setPage(1) } }} style={{ width: 200 }} />
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(q); setPage(1) }}>🔍</button>
          <button className="btn btn-primary" onClick={() => { setShowAdd(true); setFormErr('') }}>+ محصول جدید</button>
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>افزودن محصول</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label>نام محصول *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%' }} /></div>
              <div><label>توضیحات</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} style={{ width: '100%', resize: 'vertical', padding: '.6rem .8rem', border: '1.5px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '.9rem' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label>قیمت (تومان) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={{ width: '100%' }} /></div>
                <div><label>دسته‌بندی *</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    style={{ width: '100%', padding: '.6rem .8rem', border: '1.5px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '.9rem', background: '#fff' }}>
                    <option value="">انتخاب کنید</option>
                    {cats.map((c: { id: number; name: string }) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select></div>
              </div>
              <div><label>آدرس تصویر (URL)</label>
                <input value={form.imageUrl} dir="ltr" onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..." style={{ width: '100%' }} />
                {form.imageUrl && <img src={form.imageUrl} alt="" style={{ marginTop: 8, height: 80, objectFit: 'contain', borderRadius: 8 }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
              </div>
              {formErr && <p style={{ color: 'var(--red)', fontSize: 13 }}>{formErr}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>لغو</button>
              <button className="btn btn-primary"
                disabled={!form.name || !form.price || !form.categoryId || createMut.isPending}
                onClick={() => createMut.mutate()}>
                {createMut.isPending ? 'در حال ثبت...' : 'ثبت محصول'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14 }}>مجموع: <strong>{total.toLocaleString('fa-IR')}</strong> محصول</p>
        {isLoading ? <div className="spinner-center"><div className="spinner" /></div> : (
          <table>
            <thead><tr><th>#</th><th>نام</th><th>دسته</th><th>قیمت</th><th>وضعیت</th><th>عملیات</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--p)', fontWeight: 700 }}>#{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ color: 'var(--text2)' }}>{p.categoryName}</td>
                  <td>{p.price.toLocaleString('fa-IR')}</td>
                  <td><span className={`pill ${PRODUCT_STATUS_PILL[p.status] ?? 'pill-gray'}`}>{PRODUCT_STATUS_LABEL[p.status]}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {p.status !== 0 && <button className="btn btn-ghost btn-sm" onClick={() => activate.mutate(p.id)}>فعال</button>}
                      {p.status === 0 && <button className="btn btn-danger btn-sm" onClick={() => deactivate.mutate(p.id)}>غیرفعال</button>}
                      {p.status !== 2 && <button className="btn btn-sm" style={{ background: '#f1f5f9', color: 'var(--text2)' }} onClick={() => archive.mutate(p.id)}>آرشیو</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={6} className="empty">محصولی یافت نشد</td></tr>}
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
