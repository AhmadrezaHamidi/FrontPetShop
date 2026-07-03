// ── Auth ─────────────────────────────────────────────────────────────────
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userId: number
  fullName: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}
export interface User {
  id: number
  phoneNumber: string
  fullName: string
  role: 'Customer' | 'Seller' | 'Admin'
}

// ── Common ────────────────────────────────────────────────────────────────
export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// ── Product ───────────────────────────────────────────────────────────────
export type ProductStatus = 0 | 1 | 2
export const PRODUCT_STATUS_LABEL: Record<number, string> = { 0: 'فعال', 1: 'غیرفعال', 2: 'آرشیو' }
export const PRODUCT_STATUS_PILL:  Record<number, string> = { 0: 'pill-green', 1: 'pill-amber', 2: 'pill-gray' }

export interface ProductImage { id: string; url: string; type: number; sortOrder?: number }
export interface ProductInventory {
  availableQuantity: number; quantity: number
  reservedQuantity: number; isOutOfStock: boolean; isLowStock?: boolean
}
export interface Product {
  id: number; name: string; description: string
  price: number; categoryId: number; categoryName?: string
  status: ProductStatus; sellerId?: number; createdAt?: string
  images?: ProductImage[]; inventory?: ProductInventory
}
export interface Category { id: number; name: string; parentId?: number }

// ── Order ─────────────────────────────────────────────────────────────────
// Backend enum: 0=Pending, 1=Confirmed, 2=Processing, 3=Shipped, 4=Delivered, 5=Cancelled, 6=Refunded
export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6
export const ORDER_STATUS_LABEL: Record<number, string> = {
  0: 'منتظر پرداخت', 1: 'تأیید شده', 2: 'در حال آماده‌سازی',
  3: 'ارسال شده', 4: 'تحویل شده', 5: 'لغو شده', 6: 'مسترد شده',
}
export const ORDER_STATUS_PILL: Record<number, string> = {
  0: 'pill-amber', 1: 'pill-teal', 2: 'pill-purple',
  3: 'pill-purple', 4: 'pill-green', 5: 'pill-red', 6: 'pill-gray',
}
export interface OrderItem {
  id: number; productId: number; productName?: string
  quantity: number; unitPrice: number; totalPrice: number
}
export interface Order {
  id: number; userId: number; status: OrderStatus
  totalAmount: number; items: OrderItem[]
  placedAt?: string; paymentMethod?: number
}

// ── BNPL ──────────────────────────────────────────────────────────────────
export interface CreditInfo {
  userId: number; totalLimit: number; usedLimit: number
  availableLimit: number; updatedAt?: string
}
export interface Installment {
  id: number; contractId: number; installmentNo: number
  amount: number; dueDate: string; paidAt?: string
  status: 0 | 1 | 2 | 3; isOverdue: boolean
}
export const INSTALLMENT_STATUS_LABEL: Record<number, string> = {
  0: 'در انتظار', 1: 'پرداخت‌شده', 2: 'معوق', 3: 'بخشیده'
}
export interface BnplContract {
  id: number; orderId: number; userId: number
  totalAmount: number; installmentCount: number
  status: 0 | 1 | 2 | 3
  createdAt: string; paidCount?: number; isCompleted?: boolean
  installments?: Installment[]
}
export const CONTRACT_STATUS_LABEL: Record<number, string> = {
  0: 'فعال', 1: 'تکمیل‌شده', 2: 'نکول', 3: 'لغو'
}

// ── Discount ──────────────────────────────────────────────────────────────
export interface Discount {
  id: number; code: string; title: string
  type: 0 | 1; value: number
  minOrderAmount?: number; maxUsage?: number
  usageCount: number; expiresAt?: string
  isActive: boolean; createdAt: string
}

// ── Admin / BackOffice ────────────────────────────────────────────────────
export interface AdminUser {
  id: number; fullName: string; email: string
  role: number; status: number; createdAt: string
}
export const ADMIN_ROLE_LABEL: Record<number, string> = {
  0: 'SuperAdmin', 1: 'مدیر محصول', 2: 'مدیر سفارش',
  3: 'مدیر مالی', 4: 'پشتیبانی'
}
