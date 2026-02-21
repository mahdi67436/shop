import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, DollarSign, TrendingUp, Users, Star } from 'lucide-react'
import { api } from '@/services/api/axios'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  averageRating: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customer: string
  total: number
  status: string
  date: string
}

export function VendorDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    averageRating: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/vendor/dashboard')
      setStats(response.data.stats)
      setRecentOrders(response.data.recentOrders)
    } catch (error) {
      // Demo data
      setStats({
        totalOrders: 45,
        totalRevenue: 125000,
        totalProducts: 28,
        averageRating: 4.5,
      })
      setRecentOrders([
        { id: '1', orderNumber: 'ORD-001', customer: 'John Doe', total: 5500, status: 'pending', date: '2024-01-20' },
        { id: '2', orderNumber: 'ORD-002', customer: 'Jane Smith', total: 3200, status: 'shipped', date: '2024-01-19' },
        { id: '3', orderNumber: 'ORD-003', customer: 'Bob Wilson', total: 8900, status: 'delivered', date: '2024-01-18' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount)
  }

  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'blue' },
    { title: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'green' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'purple' },
    { title: 'Average Rating', value: stats.averageRating.toFixed(1), icon: Star, color: 'yellow' },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
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

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link to="/vendor/orders" className="text-sm text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-3 text-sm">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-sm">{order.customer}</td>
                  <td className="px-4 py-3 text-sm">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
