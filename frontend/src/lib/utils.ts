import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'BDT'): string {
  if (currency === 'BDT') {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(price)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validateBangladeshPhone(phone: string): boolean {
  const bangladeshiPhoneRegex = /^(\+8801|8801|01)[3-9]\d{8}$/
  return bangladeshiPhoneRegex.test(phone.replace(/\s/g, ''))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export const BANGladesh_DIVISIONS = [
  { id: 'dhaka', name: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'chattogram', name: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'khulna', name: 'Khulna', nameBn: 'খুলনা' },
  { id: 'rajshahi', name: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'sylhet', name: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'barishal', name: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'rangpur', name: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
] as const

export const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', nameBn: 'বিকাশ', logo: '/payments/bkash.svg' },
  { id: 'nagad', name: 'Nagad', nameBn: 'নগদ', logo: '/payments/nagad.svg' },
  { id: 'rocket', name: 'Rocket', nameBn: 'রকেট', logo: '/payments/rocket.svg' },
  { id: 'stripe', name: 'Card Payment', nameBn: 'কার্ড পেমেন্ট', logo: '/payments/stripe.svg' },
  { id: 'cod', name: 'Cash on Delivery', nameBn: 'ক্যাশ অন ডেলিভারি', logo: '/payments/cod.svg' },
] as const
