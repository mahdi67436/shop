import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { RootState } from '@/store'
import { updateQuantity, removeFromCart, clearCart, CartItem } from '@/store/slices/cart-slice'
import { Button } from '@/components/ui/button'

export function CartPage() {
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.cart)

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount)
  }

  let totalAmount = 0
  items.forEach((item: CartItem) => {
    totalAmount += item.price * item.quantity
  })

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }))
  }

  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart(itemId))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart ({items.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: CartItem) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4">
                <Link to={`/products/${item.productId}`}>
                  <img
                    src={item.productImage || '/placeholder.jpg'}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/products/${item.productId}`} className="font-medium hover:text-blue-600">
                    {item.productName}
                  </Link>
                  {item.variantName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.variantName}</p>
                  )}
                  <p className="font-semibold mt-1">{formatPrice(item.price)}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="p-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={handleClearCart}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block mt-6">
                <Button className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
