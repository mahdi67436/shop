import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, Minus, Plus, ChevronRight } from 'lucide-react'
import { RootState } from '@/store'
import { addToCart } from '@/store/slices/cart-slice'
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlist-slice'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api/axios'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  vendor: { id: string; name: string }
  category: { name: string }
  variants?: { id: string; name: string; options: { id: string; name: string; price: number }[] }[]
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useDispatch()
  const { items: cartItems } = useSelector((state: RootState) => state.cart)
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist)
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  const isInWishlist = product ? wishlistItems.some((item: any) => item.productId === product.id) : false

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/products/${slug}`)
      setProduct(response.data)
    } catch (error) {
      // Demo data
      setProduct({
        id: '1',
        name: 'Smartphone X Pro - 128GB',
        slug: slug || 'smartphone-x-pro',
        description: 'Experience the future with Smartphone X Pro featuring a stunning 6.7-inch AMOLED display, powerful processor, and professional-grade camera system. Perfect for photography enthusiasts and power users alike.',
        price: 45000,
        originalPrice: 50000,
        images: ['https://via.placeholder.com/600', 'https://via.placeholder.com/600', 'https://via.placeholder.com/600'],
        rating: 4.5,
        reviewCount: 120,
        stock: 10,
        vendor: { id: '1', name: 'TechZone' },
        category: { name: 'Smartphones' },
        variants: [
          { id: 'storage', name: 'Storage', options: [
            { id: '128', name: '128GB', price: 45000 },
            { id: '256', name: '256GB', price: 52000 },
          ]},
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

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      price: product.price,
      quantity,
      vendorId: product.vendor.id,
      maxQuantity: product.stock,
    }))
  }

  const handleWishlist = () => {
    if (!product) return
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(addToWishlist({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        price: product.price,
        vendorId: product.vendor.id,
        vendorName: product.vendor.name,
      }))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <Link to="/products" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/products?category=${product.category.name}`}>{product.category.name}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImage] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded border-2 overflow-hidden flex-shrink-0 ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              <Link to={`/products?vendor=${product.vendor.id}`} className="hover:text-blue-600">
                {product.vendor.name}
              </Link>
            </p>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants?.map((variant) => (
              <div key={variant.id} className="mb-4">
                <label className="block text-sm font-medium mb-2">{variant.name}</label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedVariants({ ...selectedVariants, [variant.id]: option.id })}
                      className={`px-4 py-2 border rounded ${
                        selectedVariants[variant.id] === option.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:border-gray-400'
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500 ml-4">
                  {product.stock} items available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                size="lg"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleWishlist}
                variant="outline"
                size="lg"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <p className="text-xs">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-1 text-green-500" />
                <p className="text-xs">Secure Payment</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                <p className="text-xs">Easy Returns</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
