import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { backofficeApi } from '../../api/backoffice'
import { ADMIN_ROLE_LABEL } from '../../types'

const STATUS = { 0: { l: 'فعال', c: 'pill-green' }, 1: { l: 'غیرفعال', c: 'pill-gray' }, 2: { l: 'معلق', c: 'pill-amber' } } as Record<number,{l:string;c:string}>
const EMPTY = { fullName: '', email: '', role: '0' }

export default function AdminUsers() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const inv = () => qc.invalidateQueries({ queryKey: ['admins'] })

  const { data, isLoading } = useQuery({
    queryKey: ['admins', page],
    queryFn: () => backofficeApi.getAdmins({ page, pageSize: 20 }),
  })

  const createMut = useMutation({
    mutationFn: () => backofficeApi.createAdmin({ fullName: form.fullName, email: form.email, role: Number(form.role) }),
    onSuccess: () => { inv(); setShowAdd(false); setForm(EMPTY) },
  })
  const activate   = useMutation({ mutationFn: (id: number) => backofficeApi.activateAdmin(id),   onSuccess: inv })
  const deactivate = useMutation({ mutationFn: (id: number) => backofficeApi.deactivateAdmin(id), onSuccess: inv })

  const admins     = (data?.data as any)?.data?.items ?? []
  const totalPages = (data?.data as any)?.data?.totalPages ?? 1
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <>
      <div className="hdr">
        <h2>مدیران سیستم</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ مدیر جدید</button>
      </div>

      {showAdd && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header"><h3>افزودن مدیر</h3><button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>✕</button></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label>نام کامل *</label><input value={form.fullName} onChange={f('fullName')} style={{ width: '100%' }} /></div>
              <div><label>ایمیل *</label><input type="email" value={form.email} onChange={f('email')} dir="ltr" style={{ width: '100%' }} /></div>
              <div><label>نقش</label>
                <select value={form.role} onChange={f('role')} style={{ width: '100%', padding: '.6rem .8rem', border: '1.5px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '.9rem', background: '#fff' }}>
                  {Object.entries(ADMIN_ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>لغو</button>
              <button className="btn btn-primary" disabled={!form.fullName || !form.email || createMut.isPending} onClick={() => createMut.mutate()}>
                {createMut.isPending ? '...' : 'ثبت'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {isLoading ? <div className="spinner-center"><div className="spinner" /></div> : (
          <table>
            <thead><tr><th>#</th><th>نام</th><th>ایمیل</th><th>نقش</th><th>وضعیت</th><th>عملیات</th></tr></thead>
            <tbody>
              {admins.map((a: any) => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--p)', fontWeight: 700 }}>#{a.id}</td>
                  <td style={{ fontWeight: 600 }}>{a.fullName}</td>
                  <td dir="ltr" style={{ color: 'var(--text2)', fontSize: 13 }}>{a.email}</td>
                  <td>{ADMIN_ROLE_LABEL[a.role] ?? a.role}</td>
                  <td><span className={`pill ${STATUS[a.status]?.c ?? 'pill-gray'}`}>{STATUS[a.status]?.l ?? a.status}</span></td>
                  <td>
                    {a.status !== 0
                      ? <button className="btn btn-ghost btn-sm" onClick={() => activate.mutate(a.id)}>فعال‌سازی</button>
                      : <button className="btn btn-danger btn-sm" onClick={() => deactivate.mutate(a.id)}>غیرفعال</button>}
                  </td>
                </tr>
              ))}
              {admins.length === 0 && <tr><td colSpan={6} className="empty">مدیری یافت نشد</td></tr>}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
              <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
