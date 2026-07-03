import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { authApi } from '../../api/auth'

const links = [
  { to: '/seller', label: 'داشبورد', icon: '🏠', end: true },
  { to: '/seller/products', label: 'محصولات من', icon: '📦' },
  { to: '/seller/inventory', label: 'موجودی', icon: '📊' },
  { to: '/seller/orders', label: 'سفارش‌ها', icon: '🛒' },
]

export default function SellerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    const refresh = localStorage.getItem('refresh_token') ?? ''
    try { await authApi.logout(refresh) } catch { /* ignore */ }
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">🐾 پت‌شاپ — فروشنده</div>
        <nav className="sidebar-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => isActive ? 'active' : ''}>
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>{user?.fullName || user?.phoneNumber}</p>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={handleLogout}>خروج</button>
        </div>
      </aside>
      <main className="main"><Outlet /></main>
    </div>
  )
}
