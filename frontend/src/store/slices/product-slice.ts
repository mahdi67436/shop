import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  categoryId: string
  categoryName: string
  subcategoryId?: string
  brandId?: string
  brandName?: string
  vendorId: string
  vendorName: string
  stock: number
  rating: number
  reviewCount: number
  isFeatured: boolean
  isActive: boolean
  variants?: ProductVariant[]
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  attributes: Record<string, string>
  images: string[]
}

export interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  recentProducts: Product[]
  currentProduct: Product | null
  searchResults: Product[]
  isLoading: boolean
  error: string | null
  filters: ProductFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProductFilters {
  categoryId?: string
  subcategoryId?: string
  brandId?: string
  vendorId?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular'
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  recentProducts: [],
  currentProduct: null,
  searchResults: [],
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<{ products: Product[]; pagination: ProductState['pagination'] }>) => {
      state.products = action.payload.products
      state.pagination = action.payload.pagination
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload
    },
    setRecentProducts: (state, action: PayloadAction<Product[]>) => {
      state.recentProducts = action.payload
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload
    },
    setSearchResults: (state, action: PayloadAction<Product[]>) => {
      state.searchResults = action.payload
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const {
  setProducts,
  setFeaturedProducts,
  setRecentProducts,
  setCurrentProduct,
  setSearchResults,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = productSlice.actions

export default productSlice.reducer
