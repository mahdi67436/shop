import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid, List, Star, Heart, ShoppingBag, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/services/api/axios'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  vendor: { name: string }
  stock: number
}

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  
  const category = searchParams.get('category') || ''

  useEffect(() => {
    fetchProducts()
  }, [searchParams, sortBy, page])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '20')
      if (search) params.append('search', search)
      if (category) params.append('category_id', category)
      if (sortBy) params.append('sort', sortBy)

      const response = await api.get(`/products?${params}`)
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      // Demo data for now
      setProducts([
        { id: '1', name: 'Smartphone X Pro', slug: 'smartphone-x-pro', price: 45000, originalPrice: 50000, images: ['https://via.placeholder.com/300'], rating: 4.5, reviewCount: 120, vendor: { name: 'TechZone' }, stock: 10 },
        { id: '2', name: 'Wireless Earbuds', slug: 'wireless-earbuds', price: 2500, originalPrice: 3500, images: ['https://via.placeholder.com/300'], rating: 4.2, reviewCount: 85, vendor: { name: 'AudioWorld' }, stock: 25 },
        { id: '3', name: 'Laptop Stand', slug: 'laptop-stand', price: 1200, images: ['https://via.placeholder.com/300'], rating: 4.0, reviewCount: 45, vendor: { name: 'OfficeGear' }, stock: 50 },
        { id: '4', name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', price: 4500, originalPrice: 5500, images: ['https://via.placeholder.com/300'], rating: 4.8, reviewCount: 200, vendor: { name: 'GamingHub' }, stock: 15 },
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search) {
      setSearchParams({ q: search })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>

        {/* Filters & Sort */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="flex border rounded">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-2 dark:bg-gray-800"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative">
                  <img
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.originalPrice && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{product.vendor.name}</p>
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4 hover:shadow-lg transition"
              >
                <img
                  src={product.images[0] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{product.vendor.name}</p>
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2">Page {page}</span>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={products.length < 20}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
