import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, MapPin, Phone } from 'lucide-react'
import { api } from '@/services/api/axios'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
  items: { name: string; quantity: number; price: number; image: string }[]
  totalAmount: number
  shippingAddress: { address: string; city: string; phone: string }
  timeline: { status: string; date: string; completed: boolean }[]
}

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/orders/${orderId}`)
      setOrder(response.data)
    } catch (error) {
      // Demo data
      setOrder({
        id: orderId || '1',
        orderNumber: 'ORD-2024-001234',
        status: 'shipped',
        items: [
          { name: 'Smartphone X Pro', quantity: 1, price: 45000, image: 'https://via.placeholder.com/100' },
        ],
        totalAmount: 45000,
        shippingAddress: {
          address: '123 Main Street',
          city: 'Dhaka',
          phone: '+8801XXXXXXXXX',
        },
        timeline: [
          { status: 'Order Placed', date: '2024-01-15 10:30 AM', completed: true },
          { status: 'Order Confirmed', date: '2024-01-15 11:00 AM', completed: true },
          { status: 'Processing', date: '2024-01-16 09:00 AM', completed: true },
          { status: 'Shipped', date: '2024-01-17 02:00 PM', completed: true },
          { status: 'Out for Delivery', date: '', completed: false },
          { status: 'Delivered', date: '', completed: false },
        ],
      })
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Order Placed':
      case 'Order Confirmed':
        return <CheckCircle className="w-5 h-5" />
      case 'Processing':
        return <Package className="w-5 h-5" />
      case 'Shipped':
      case 'Out for Delivery':
        return <Truck className="w-5 h-5" />
      case 'Delivered':
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold">Order not found</h2>
          <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Order #{order.orderNumber}
        </p>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
              <p className="text-xl font-semibold capitalize">{order.status}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="text-xl font-semibold">{formatPrice(order.totalAmount)}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8">
            {order.timeline.map((step, index) => (
              <div key={index} className="flex items-start mb-6 last:mb-0">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  {getStatusIcon(step.status)}
                </div>
                <div className="ml-4 flex-1">
                  <p className={`font-medium ${step.completed ? '' : 'text-gray-400'}`}>
                    {step.status}
                  </p>
                  {step.date && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{step.date}</p>
                  )}
                </div>
                {index < order.timeline.length - 1 && (
                  <div className={`absolute left-5 top-10 w-0.5 h-6 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} style={{ marginLeft: '20px', marginTop: '30px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Shipping Address</h2>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p>{order.shippingAddress.address}</p>
              <p className="text-gray-500 dark:text-gray-400">{order.shippingAddress.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
