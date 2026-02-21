import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { api } from '@/services/api/axios'

interface Order {
  id: string
  orderNumber: string
  customer: string
  total: number
  status: string
  date: string
  items: { name: string; quantity: number }[]
}

export function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/vendor/orders')
      setOrders(response.data)
    } catch (error) {
      setOrders([
        { id: '1', orderNumber: 'ORD-001', customer: 'John Doe', total: 5500, status: 'pending', date: '2024-01-20', items: [{ name: 'Smartphone X Pro', quantity: 1 }] },
        { id: '2', orderNumber: 'ORD-002', customer: 'Jane Smith', total: 3200, status: 'processing', date: '2024-01-19', items: [{ name: 'Earbuds', quantity: 2 }] },
        { id: '3', orderNumber: 'ORD-003', customer: 'Bob Wilson', total: 8900, status: 'shipped', date: '2024-01-18', items: [{ name: 'Laptop', quantity: 1 }] },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (amount: number) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Items</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t dark:border-gray-700">
                <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3 text-sm">{order.customer}</td>
                <td className="px-4 py-3 text-sm">{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
                <td className="px-4 py-3 text-sm">{formatPrice(order.total)}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>{order.status}</span>
                </td>
                <td className="px-4 py-3 text-sm">{order.date}</td>
                <td className="px-4 py-3 text-sm">
                  <Link to={`/vendor/orders/${order.id}`}>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function VendorOrderDetailPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Order Details</h1></div> }
export function VendorAnalyticsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1></div> }
export function VendorPayoutsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Payouts</h1></div> }
export function VendorSettingsPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div> }
export function VendorSubscriptionPage() { return <div className="p-6"><h1 className="text-2xl font-bold">Subscription</h1></div> }
