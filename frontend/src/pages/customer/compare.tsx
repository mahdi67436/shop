import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingCart, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  specs: {
    display: string
    processor: string
    storage: string
    battery: string
    camera: string
  }
}

export function ComparePage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Smartphone X Pro',
      price: 45000,
      originalPrice: 50000,
      image: 'https://via.placeholder.com/200',
      rating: 4.5,
      reviewCount: 120,
      specs: {
        display: '6.7" AMOLED',
        processor: 'Snapdragon 8 Gen 2',
        storage: '128GB',
        battery: '5000mAh',
        camera: '50MP + 12MP',
      },
    },
    {
      id: '2',
      name: 'Galaxy S24 Ultra',
      price: 55000,
      image: 'https://via.placeholder.com/200',
      rating: 4.8,
      reviewCount: 200,
      specs: {
        display: '6.8" Dynamic AMOLED',
        processor: 'Snapdragon 8 Gen 3',
        storage: '256GB',
        battery: '5000mAh',
        camera: '200MP + 50MP',
      },
    },
  ])

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
    }).format(amount)
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">No products to compare</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add products to compare by clicking the compare button on product pages.
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
        <h1 className="text-2xl font-bold mb-6">Compare Products</h1>

        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr>
                <th className="p-4 text-left w-40">Product</th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 w-64 relative">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mx-auto mb-2 rounded" />
                    <Link to={`/products/${product.id}`} className="font-medium hover:text-blue-600 line-clamp-2">
                      {product.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-4 font-medium">Price</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-4 font-medium">Rating</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                      <span className="text-gray-500">({product.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-4 font-medium">Display</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">{product.specs.display}</td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-4 font-medium">Processor</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">{product.specs.processor}</td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-4 font-medium">Storage</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">{product.specs.storage}</td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-4 font-medium">Battery</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">{product.specs.battery}</td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-4 font-medium">Camera</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">{product.specs.camera}</td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-4"></td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    <div className="flex flex-col gap-2">
                      <Button size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4 mr-2" />
                        Add to Wishlist
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
