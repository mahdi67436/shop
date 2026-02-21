import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import { RootState } from '@/store'
import { removeFromWishlist } from '@/store/slices/wishlist-slice'
import { addToCart } from '@/store/slices/cart-slice'
import { Button } from '@/components/ui/button'

export function WishlistPage() {
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.wishlist)

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount)
  }

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId))
  }

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      productId: item.id,
      productName: item.name,
      productImage: item.images?.[0] || '',
      price: item.price,
      quantity: 1,
      vendorId: item.vendorId,
      maxQuantity: item.stock || 10,
    }))
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Save items you love by clicking the heart icon
          </p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Wishlist ({items.length} items)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <Link to={`/products/${item.slug || item.id}`}>
                <img
                  src={item.images?.[0] || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/products/${item.slug || item.id}`} className="font-medium hover:text-blue-600 line-clamp-2">
                  {item.name}
                </Link>
                <p className="font-semibold mt-2">{formatPrice(item.price)}</p>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
