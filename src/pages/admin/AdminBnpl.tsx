import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bnplApi } from '../../api/bnpl'

export default function AdminBnpl() {
  const qc = useQueryClient()
  const [userId, setUserId] = useState('')
  const [newLimit, setNewLimit] = useState('')
  const [msg, setMsg] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['credit', userId],
    queryFn: () => bnplApi.getCredit(Number(userId)),
    enabled: !!userId && !isNaN(Number(userId)),
  })

  const increase = useMutation({
    mutationFn: () => bnplApi.increaseCredit(Number(userId), Number(newLimit)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['credit'] }); refetch(); setMsg('سقف اعتبار افزایش یافت.') },
    onError: () => setMsg('خطا در افزایش اعتبار.'),
  })

  const credit = data?.data?.data

  return (
    <>
      <div className="hdr"><h2>مدیریت BNPL</h2></div>

      <div className="card" style={{ maxWidth: 500, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>جستجوی اعتبار کاربر</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input value={userId} onChange={e => { setUserId(e.target.value); setMsg('') }}
            placeholder="شناسه کاربر" dir="ltr" style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={() => refetch()} disabled={!userId}>جستجو</button>
        </div>

        {isLoading && <div className="spinner-center"><div className="spinner" /></div>}

        {credit && (
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { l: 'سقف کل', v: credit.totalLimit },
                { l: 'استفاده‌شده', v: credit.usedLimit },
                { l: 'در دسترس', v: credit.availableLimit },
              ].map(s => (
                <div key={s.l} style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.v.toLocaleString('fa-IR')}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)' }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input value={newLimit} onChange={e => setNewLimit(e.target.value)}
                placeholder="سقف جدید (تومان)" type="number" dir="ltr" style={{ flex: 1 }} />
              <button className="btn btn-primary" disabled={!newLimit || increase.isPending}
                onClick={() => increase.mutate()}>افزایش</button>
            </div>

            {msg && <p style={{ color: 'var(--p)', fontSize: 13, marginTop: 4 }}>{msg}</p>}
          </div>
        )}
      </div>
    </>
  )
}
