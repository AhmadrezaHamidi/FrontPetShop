import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { marketingApi } from '../../api/backoffice'

export default function AdminMarketing() {
  const [msg, setMsg] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const send = useMutation({
    mutationFn: () => marketingApi.sendBulkSms(msg),
    onSuccess: (res) => {
      const count = (res.data as any)?.data ?? 0
      setResult(`پیامک با موفقیت به ${count.toLocaleString('fa-IR')} نفر ارسال شد.`)
      setMsg('')
    },
    onError: () => setResult('خطا در ارسال پیامک.'),
  })

  return (
    <>
      <div className="hdr"><h2>بازاریابی پیامکی</h2></div>
      <div className="card" style={{ maxWidth: 600 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>ارسال پیامک انبوه</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label>متن پیامک</label>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={5}
              placeholder="پیام خود را اینجا بنویسید..."
              style={{ width: '100%', resize: 'vertical', padding: '.7rem', border: '1.5px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '.9rem' }} />
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{msg.length} کاراکتر</p>
          </div>
          {result && (
            <div style={{ background: send.isError ? '#FEE2E2' : '#D1FAE5', borderRadius: 8, padding: 12, fontSize: 13, color: send.isError ? 'var(--red)' : '#065F46' }}>
              {result}
            </div>
          )}
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}
            disabled={!msg.trim() || send.isPending}
            onClick={() => { setResult(null); send.mutate() }}>
            {send.isPending ? 'در حال ارسال...' : '📤 ارسال به همه کاربران'}
          </button>
        </div>
      </div>
    </>
  )
}
