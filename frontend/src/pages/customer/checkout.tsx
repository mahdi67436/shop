import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, CreditCard, Wallet, Banknote } from 'lucide-react'
import { RootState } from '@/store'
import { clearCart, CartItem } from '@/store/slices/cart-slice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/services/api/axios'

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  postalCode: string
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.cart)
  
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('bkash')
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
  })

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount)
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 60 // Free shipping over 500 BDT
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address,
        paymentMethod,
        totalAmount: total,
      }

      const response = await api.post('/orders', orderData)
      
      if (paymentMethod !== 'cod') {
        // Handle payment gateway redirect
        const { paymentUrl } = response.data
        if (paymentUrl) {
          window.location.href = paymentUrl
          return
        }
      }
      
      dispatch(clearCart())
      navigate(`/order/success/${response.data.orderId}`)
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+8801XXXXXXXXX"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <Input
                      value={address.address}
                      onChange={(e) => setAddress({ ...address, address: e.target.value })}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Dhaka"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">District</label>
                    <Input
                      value={address.district}
                      onChange={(e) => setAddress({ ...address, district: e.target.value })}
                      placeholder="Dhaka"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <Input
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="1200"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'bkash' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Wallet className="w-5 h-5 mr-3" />
                    <span>bKash</span>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'nagad' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="nagad"
                      checked={paymentMethod === 'nagad'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Wallet className="w-5 h-5 mr-3" />
                    <span>Nagad</span>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'rocket' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="rocket"
                      checked={paymentMethod === 'rocket'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Banknote className="w-5 h-5 mr-3" />
                    <span>Rocket/DBBL</span>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.productName} x {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${formatPrice(total)}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
