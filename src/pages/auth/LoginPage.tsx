import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function sendOtp() {
    if (!phone) return
    setLoading(true); setErr('')
    try {
      await authApi.requestOtp(phone)
      setStep('otp')
    } catch { setErr('ارسال کد ناموفق بود.') }
    finally { setLoading(false) }
  }

  async function verify() {
    if (!otp) return
    setLoading(true); setErr('')
    try {
      const res = await authApi.verifyOtp(phone, otp)
      const { accessToken, refreshToken } = res.data
      login(accessToken, refreshToken)
      navigate('/')
    } catch { setErr('کد اشتباه است یا منقضی شده.') }
    finally { setLoading(false) }
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1 style={{ marginBottom: 6 }}>ورود به پنل</h1>
        <p style={{ color: 'var(--text2)', fontSize: '.9rem', marginBottom: 24 }}>فروشگاه آنلاین پت‌شاپ</p>

        {step === 'phone' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label>شماره موبایل</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xxxxxxxxx"
                dir="ltr" style={{ width: '100%' }}
                onKeyDown={e => e.key === 'Enter' && sendOtp()} />
            </div>
            {err && <p style={{ color: 'var(--red)', fontSize: 13 }}>{err}</p>}
            <button className="btn btn-primary" style={{ width: '100%' }}
              onClick={sendOtp} disabled={!phone || loading}>
              {loading ? 'در حال ارسال...' : 'دریافت کد'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>کد ۶ رقمی به <strong>{phone}</strong> ارسال شد.</p>
            <div>
              <label>کد تأیید</label>
              <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000"
                dir="ltr" maxLength={6} style={{ width: '100%', letterSpacing: '.3em', fontSize: '1.2rem', textAlign: 'center' }}
                onKeyDown={e => e.key === 'Enter' && verify()} />
            </div>
            {err && <p style={{ color: 'var(--red)', fontSize: 13 }}>{err}</p>}
            <button className="btn btn-primary" style={{ width: '100%' }}
              onClick={verify} disabled={otp.length < 4 || loading}>
              {loading ? 'در حال بررسی...' : 'ورود'}
            </button>
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => { setStep('phone'); setErr('') }}>
              ویرایش شماره
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
