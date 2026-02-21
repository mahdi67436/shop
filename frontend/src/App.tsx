import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from '@/components/ui/toaster'
import { useTheme } from '@/hooks/use-theme'
import { RootState } from '@/store'
import { ErrorBoundary } from '@/components/common/error-boundary'

// Layouts
import { MainLayout } from '@/components/layout/main-layout'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Customer Pages
import { HomePage } from '@/pages/customer/home'
import { ProductListPage } from '@/pages/customer/products'
import { ProductDetailPage } from '@/pages/customer/product-detail'
import { CartPage } from '@/pages/customer/cart'
import { CheckoutPage } from '@/pages/customer/checkout'
import { OrderSuccessPage } from '@/pages/customer/order-success'
import { OrderTrackingPage } from '@/pages/customer/order-tracking'
import { WishlistPage } from '@/pages/customer/wishlist'
import { ProfilePage } from '@/pages/customer/profile'
import { AddressBookPage } from '@/pages/customer/addresses'
import { ComparePage } from '@/pages/customer/compare'

// Auth Pages
import { LoginPage } from '@/pages/auth/login'
import { RegisterPage } from '@/pages/auth/register'
import { VerifyOTPPage } from '@/pages/auth/verify-otp'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password'
import { ResetPasswordPage } from '@/pages/auth/reset-password'

// Vendor Pages
import { VendorDashboardPage } from '@/pages/vendor/dashboard'
import { VendorProductsPage } from '@/pages/vendor/products'
import { VendorProductFormPage } from '@/pages/vendor/product-form'
import { VendorOrdersPage } from '@/pages/vendor/orders'
import { VendorOrderDetailPage } from '@/pages/vendor/order-detail'
import { VendorAnalyticsPage } from '@/pages/vendor/analytics'
import { VendorPayoutsPage } from '@/pages/vendor/payouts'
import { VendorSettingsPage } from '@/pages/vendor/settings'
import { VendorSubscriptionPage } from '@/pages/vendor/subscription'

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/dashboard'
import { AdminVendorsPage } from '@/pages/admin/vendors'
import { AdminProductsPage } from '@/pages/admin/products'
import { AdminOrdersPage } from '@/pages/admin/orders'
import { AdminUsersPage } from '@/pages/admin/users'
import { AdminCategoriesPage } from '@/pages/admin/categories'
import { AdminCouponsPage } from '@/pages/admin/coupons'
import { AdminReturnsPage } from '@/pages/admin/returns'
import { AdminPaymentsPage } from '@/pages/admin/payments'
import { AdminSettingsPage } from '@/pages/admin/settings'
import { AdminReportsPage } from '@/pages/admin/reports'

// Protected Route Component
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode
  allowedRoles?: string[] 
}) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

function App() {
  useTheme()

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/search" element={<ProductListPage />} />
          
          {/* Checkout Flow */}
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/order/success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/order/track/:orderId" element={<OrderTrackingPage />} />
          
          {/* User Profile */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <AddressBookPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Vendor Dashboard Routes */}
        <Route path="/vendor" element={
          <ProtectedRoute allowedRoles={['vendor', 'admin']}>
            <DashboardLayout type="vendor" />
          </ProtectedRoute>
        }>
          <Route index element={<VendorDashboardPage />} />
          <Route path="products" element={<VendorProductsPage />} />
          <Route path="products/new" element={<VendorProductFormPage />} />
          <Route path="products/:id/edit" element={<VendorProductFormPage />} />
          <Route path="orders" element={<VendorOrdersPage />} />
          <Route path="orders/:id" element={<VendorOrderDetailPage />} />
          <Route path="analytics" element={<VendorAnalyticsPage />} />
          <Route path="payouts" element={<VendorPayoutsPage />} />
          <Route path="subscription" element={<VendorSubscriptionPage />} />
          <Route path="settings" element={<VendorSettingsPage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout type="admin" />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="vendors" element={<AdminVendorsPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="returns" element={<AdminReturnsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
      <Toaster />
    </ErrorBoundary>
  )
}

export default App
