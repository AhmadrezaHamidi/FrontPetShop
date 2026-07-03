import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '../../api/products'

export default function SellerInventory() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [replenishId, setReplenishId] = useState<number | null>(null)
  const [qty, setQty] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['inv-products', page],
    queryFn: () => productsApi.getAll({ page, pageSize: 15, status: 0 }),
  })

  const replenishMut = useMutation({
    mutationFn: () => productsApi.replenish(replenishId!, Number(qty)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['inv-products'] }); setReplenishId(null); setQty('') },
  })

  const products   = data?.data?.items ?? []
  const totalPages = data?.data?.totalPages ?? 1

  return (
    <>
      <div className="hdr"><h2>مدیریت موجودی</h2></div>

      {replenishId && (
        <div className="modal-overlay">
          <div className="modal" style={{ width: 340 }}>
            <div className="modal-header"><h3>افزودن موجودی</h3><button className="btn btn-ghost btn-sm" onClick={() => setReplenishId(null)}>✕</button></div>
            <div style={{ marginBottom: 12 }}>
              <label>تعداد</label>
              <input type="number" value={qty} onChange={e => setQty(e.target.value)} style={{ width: '100%' }} min={1} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setReplenishId(null)}>لغو</button>
              <button className="btn btn-primary" disabled={!qty || replenishMut.isPending} onClick={() => replenishMut.mutate()}>
                {replenishMut.isPending ? '...' : 'افزودن'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {isLoading ? <div className="spinner-center"><div className="spinner" /></div> : (
          <table>
            <thead><tr><th>#</th><th>نام محصول</th><th>موجودی</th><th>رزرو</th><th>در دسترس</th><th>عملیات</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--p)', fontWeight: 700 }}>#{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.inventory?.quantity ?? '—'}</td>
                  <td>{p.inventory?.reservedQuantity ?? '—'}</td>
                  <td>
                    <span className={`pill ${p.inventory?.isOutOfStock ? 'pill-red' : p.inventory?.availableQuantity && p.inventory.availableQuantity < 5 ? 'pill-amber' : 'pill-green'}`}>
                      {p.inventory?.availableQuantity ?? '—'}
                    </span>
                  </td>
                  <td><button className="btn btn-primary btn-sm" onClick={() => setReplenishId(p.id)}>+ موجودی</button></td>
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
