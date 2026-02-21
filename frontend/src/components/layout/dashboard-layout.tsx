import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  CreditCard,
  Bell,
  Tag,
  RotateCcw,
  FileText,
  Store,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  type: 'vendor' | 'admin'
}

const vendorSidebarLinks = [
  { name: 'Dashboard', href: '/vendor', icon: LayoutDashboard },
  { name: 'Products', href: '/vendor/products', icon: Package },
  { name: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  { name: 'Payouts', href: '/vendor/payouts', icon: CreditCard },
  { name: 'Subscription', href: '/vendor/subscription', icon: Store },
  { name: 'Settings', href: '/vendor/settings', icon: Settings },
]

const adminSidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Vendors', href: '/admin/vendors', icon: Store },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Coupons', href: '/admin/coupons', icon: FileText },
  { name: 'Returns', href: '/admin/returns', icon: RotateCcw },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function DashboardLayout({ type }: DashboardLayoutProps) {
  const location = useLocation()
  const { user } = useAppSelector((state) => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const links = type === 'vendor' ? vendorSidebarLinks : adminSidebarLinks

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-background border-r transform transition-transform duration-200
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">ShopMax</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href || 
              (link.href !== `/${type}` && location.pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 border-b bg-background px-4 lg:px-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 lg:flex-none" />

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
