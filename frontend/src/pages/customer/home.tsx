import { Link } from 'react-router-dom'
import { ArrowRight, Star, Truck, Shield, Headphones, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api/axios'
import { formatPrice } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

// Featured Products Skeleton
function ProductSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4 mt-4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
      <Skeleton className="h-6 w-1/3 mt-2" />
    </div>
  )
}

export function HomePage() {
  // Featured Products Query
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await api.get('/products', { params: { featured: true, limit: 8 } })
      return response.data
    },
  })

  // Categories Query
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories', { params: { limit: 10 } })
      return response.data
    },
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                Bangladesh's #1
                <span className="text-primary"> Marketplace</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Shop from thousands of trusted vendors with bKash, Nagad, and Rocket payment support.
                Fast delivery across Bangladesh.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild>
                  <Link to="/products">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/vendor/register">Become a Seller</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img 
                src="/hero-image.png" 
                alt="ShopMax Marketplace" 
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Free Shipping</p>
                <p className="text-sm text-muted-foreground">On orders over ৳500</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Secure Payment</p>
                <p className="text-sm text-muted-foreground">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">24/7 Support</p>
                <p className="text-sm text-muted-foreground">Dedicated Support</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Easy Returns</p>
                <p className="text-sm text-muted-foreground">7 Day Returns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Button variant="ghost" asChild>
              <Link to="/products">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories?.data?.map((category: { id: string; name: string; image: string }) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group p-4 rounded-lg border hover:border-primary hover:shadow-lg transition-all text-center"
              >
                <div className="h-16 w-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                </div>
                <p className="font-medium group-hover:text-primary transition-colors">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="ghost" asChild>
              <Link to="/products?featured=true">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredLoading ? (
              Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              featuredProducts?.data?.map((product: { id: string; name: string; price: number; originalPrice?: number; images: string[]; rating: number; reviewCount: number }) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group rounded-lg border bg-background hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.images?.[0] || '/placeholder-product.png'}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Why Choose ShopMax?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Vendors</h3>
              <p className="text-muted-foreground">
                All vendors are verified and trusted. Shop with confidence knowing you're dealing with legitimate sellers.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Get your products delivered quickly anywhere in Bangladesh with our extensive delivery network.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
              <p className="text-muted-foreground">
                Our customer support team is available 24/7 to help you with any questions or issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4">Download ShopMax App</h2>
              <p className="text-lg mb-6 opacity-90">
                Shop on the go, get exclusive app-only deals, and track your orders easily.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <Button variant="secondary" size="lg">
                  <img src="/app-store.svg" alt="App Store" className="h-6 mr-2" />
                  App Store
                </Button>
                <Button variant="secondary" size="lg">
                  <img src="/play-store.svg" alt="Play Store" className="h-6 mr-2" />
                  Google Play
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img src="/app-preview.png" alt="ShopMax App" className="w-full max-w-sm mx-auto" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
