import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store'
import { setSearchOpen, setCartDrawerOpen } from '@/store/slices/ui-slice'
import { ShoppingCart, Search, Menu, User, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function Header() {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((state) => state.cart)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="hidden md:flex h-10 items-center justify-between px-4 bg-primary text-primary-foreground text-sm">
        <div className="flex items-center gap-4">
          <span>Welcome to ShopMax - Bangladesh's #1 Marketplace</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/help" className="hover:underline">Help Center</Link>
          <Link to="/become-seller" className="hover:underline">Become a Seller</Link>
          <Link to="/track-order" className="hover:underline">Track Order</Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold hidden sm:block">ShopMax</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
            <div className="flex">
              <Input
                type="search"
                placeholder="Search for products, brands and more..."
                className="rounded-r-none border-r-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none" variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => dispatch(setSearchOpen(true))}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => dispatch(setCartDrawerOpen(true))}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-background rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-muted">
                    My Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-muted">
                    My Orders
                  </Link>
                  {user?.role === 'vendor' && (
                    <Link to="/vendor" className="block px-4 py-2 hover:bg-muted">
                      Vendor Dashboard
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-muted">
                      Admin Panel
                    </Link>
                  )}
                  <button className="w-full text-left px-4 py-2 hover:bg-muted text-destructive">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="hidden md:block border-t">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-6 py-2 text-sm">
            <Link to="/products" className="hover:text-primary flex items-center gap-1">
              <Menu className="h-4 w-4" />
              All Categories
            </Link>
            <Link to="/products?category=electronics" className="hover:text-primary">
              Electronics
            </Link>
            <Link to="/products?category=fashion" className="hover:text-primary">
              Fashion
            </Link>
            <Link to="/products?category=home" className="hover:text-primary">
              Home & Living
            </Link>
            <Link to="/products?category=beauty" className="hover:text-primary">
              Beauty & Health
            </Link>
            <Link to="/products?category=sports" className="hover:text-primary">
              Sports & Outdoors
            </Link>
            <Link to="/products?category=toys" className="hover:text-primary">
              Toys & Games
            </Link>
            <Link to="/products?category=grocery" className="hover:text-primary">
              Grocery
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
