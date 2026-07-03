import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './hooks/useAuth'
import './index.css'

import LoginPage from './pages/auth/LoginPage'
import AdminLayout from './components/Layout/AdminLayout'
import SellerLayout from './components/Layout/SellerLayout'

import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminProducts   from './pages/admin/AdminProducts'
import AdminOrders     from './pages/admin/AdminOrders'
import AdminBnpl       from './pages/admin/AdminBnpl'
import AdminDiscounts  from './pages/admin/AdminDiscounts'
import AdminUsers      from './pages/admin/AdminUsers'
import AdminMarketing  from './pages/admin/AdminMarketing'

import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts  from './pages/seller/SellerProducts'
import SellerInventory from './pages/seller/SellerInventory'
import SellerOrders    from './pages/seller/SellerOrders'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } })

function ProtectedRoute({ role, children }: { role?: string; children: JSX.Element }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

function DefaultRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'Admin')  return <Navigate to="/admin" replace />
  if (user.role === 'Seller') return <Navigate to="/seller" replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<DefaultRedirect />} />

            <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products"  element={<AdminProducts />} />
              <Route path="orders"    element={<AdminOrders />} />
              <Route path="bnpl"      element={<AdminBnpl />} />
              <Route path="discounts" element={<AdminDiscounts />} />
              <Route path="users"     element={<AdminUsers />} />
              <Route path="marketing" element={<AdminMarketing />} />
            </Route>

            <Route path="/seller" element={<ProtectedRoute role="Seller"><SellerLayout /></ProtectedRoute>}>
              <Route index element={<SellerDashboard />} />
              <Route path="products"  element={<SellerProducts />} />
              <Route path="inventory" element={<SellerInventory />} />
              <Route path="orders"    element={<SellerOrders />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
