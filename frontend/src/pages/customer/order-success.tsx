import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Package, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your order. Your order #{orderId} has been placed successfully.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 text-left">
              <Package className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium">What's next?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You will receive a confirmation email shortly. You can track your order status anytime.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/order/track/${orderId}`}>
              <Button variant="outline">
                Track Order
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Link to="/products">
              <Button>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
