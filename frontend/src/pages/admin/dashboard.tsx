import { Users, ShoppingCart, DollarSign, Package } from 'lucide-react'

export function AdminDashboardPage() {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
    { title: 'Total Orders', value: '567', icon: ShoppingCart, color: 'green' },
    { title: 'Total Revenue', value: '৳2.5M', icon: DollarSign, color: 'purple' },
    { title: 'Total Products', value: '890', icon: Package, color: 'orange' },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminVendorsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Vendors</h1></div> }
export function AdminProductsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Products</h1></div> }
export function AdminOrdersPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Orders</h1></div> }
export function AdminUsersPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Users</h1></div> }
export function AdminCategoriesPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Categories</h1></div> }
export function AdminCouponsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Coupons</h1></div> }
export function AdminReturnsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Returns</h1></div> }
export function AdminPaymentsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Payments</h1></div> }
export function AdminSettingsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div> }
export function AdminReportsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Reports</h1></div> }
