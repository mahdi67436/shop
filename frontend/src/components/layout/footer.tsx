import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background border-t">
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Subscribe to our newsletter</h3>
              <p className="text-primary-foreground/80">Get the latest updates and offers on your email</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full md:w-64 rounded-md px-3 py-2 text-sm bg-primary-foreground text-foreground"
              />
              <button
                type="submit"
                className="h-10 px-6 rounded-md bg-foreground text-primary font-medium hover:bg-foreground/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">ShopMax</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Bangladesh's premier multi-vendor eCommerce platform. Shop from thousands of vendors with confidence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary"><Youtube className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link to="/press" className="hover:text-primary">Press</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link to="/returns" className="hover:text-primary">Returns</Link></li>
              <li><Link to="/shipping" className="hover:text-primary">Shipping Info</Link></li>
              <li><Link to="/track-order" className="hover:text-primary">Track Order</Link></li>
              <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="font-semibold mb-4">Sell on ShopMax</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/vendor/register" className="hover:text-primary">Become a Seller</Link></li>
              <li><Link to="/vendor/login" className="hover:text-primary">Seller Login</Link></li>
              <li><Link to="/vendor/learn" className="hover:text-primary">Learn to Sell</Link></li>
              <li><Link to="/vendor/success" className="hover:text-primary">Success Stories</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>123 Commerce Street, Dhaka 1000, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@shopmax.com.bd</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2024 ShopMax. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-primary">Cookie Policy</Link>
            </div>
            <div className="flex items-center gap-2">
              <span>Powered by:</span>
              <span className="font-medium">ShopMax Technologies</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
