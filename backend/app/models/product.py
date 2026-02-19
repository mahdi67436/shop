"""
Database Models - Products
"""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, Text, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base
import enum


class ProductStatus(enum.Enum):
    """Product status enumeration"""
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    DELETED = "deleted"


class Category(Base):
    """Category model"""
    __tablename__ = "categories"
    
    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    name_bn = Column(String(200), nullable=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    
    # Hierarchy
    parent_id = Column(String(36), ForeignKey("categories.id"), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    parent = relationship("Category", remote_side=[id], backref="subcategories")
    products = relationship("Product", back_populates="category")
    
    def __repr__(self):
        return f"<Category {self.name}>"


class Brand(Base):
    """Brand model"""
    __tablename__ = "brands"
    
    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    logo = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    products = relationship("Product", back_populates="brand")
    
    def __repr__(self):
        return f"<Brand {self.name}>"


class Product(Base):
    """Product model"""
    __tablename__ = "products"
    
    id = Column(String(36), primary_key=True, index=True)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), index=True, nullable=False)
    category_id = Column(String(36), ForeignKey("categories.id"), index=True, nullable=False)
    brand_id = Column(String(36), ForeignKey("brands.id"), nullable=True)
    
    # Product details
    name = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    description_bn = Column(Text, nullable=True)
    
    # Pricing
    price = Column(Numeric(10, 2), nullable=False)
    original_price = Column(Numeric(10, 2), nullable=True)
    
    # Inventory
    stock = Column(Integer, default=0, nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=True)
    track_inventory = Column(Boolean, default=True, nullable=False)
    low_stock_threshold = Column(Integer, default=5, nullable=False)
    
    # Images
    images = Column(JSON, default=list, nullable=False)
    thumbnail = Column(String(500), nullable=True)
    
    # Attributes
    attributes = Column(JSON, default=dict, nullable=False)
    tags = Column(JSON, default=list, nullable=False)
    
    # Status
    status = Column(Enum(ProductStatus), default=ProductStatus.PENDING, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # SEO
    meta_title = Column(String(200), nullable=True)
    meta_description = Column(String(500), nullable=True)
    
    # Rating
    rating = Column(Numeric(3, 2), default=0.00, nullable=False)
    review_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    vendor = relationship("Vendor", back_populates="products")
    category = relationship("Category", back_populates="products")
    brand = relationship("Brand", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Product {self.name}>"


class ProductVariant(Base):
    """Product variant model"""
    __tablename__ = "product_variants"
    
    id = Column(String(36), primary_key=True, index=True)
    product_id = Column(String(36), ForeignKey("products.id"), index=True, nullable=False)
    
    # Variant details
    name = Column(String(200), nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=True)
    
    # Pricing
    price = Column(Numeric(10, 2), nullable=False)
    original_price = Column(Numeric(10, 2), nullable=True)
    
    # Inventory
    stock = Column(Integer, default=0, nullable=False)
    
    # Attributes
    attributes = Column(JSON, default=dict, nullable=False)
    images = Column(JSON, default=list, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    product = relationship("Product", back_populates="variants")
    
    def __repr__(self):
        return f"<ProductVariant {self.name}>"


class Review(Base):
    """Product review model"""
    __tablename__ = "reviews"
    
    id = Column(String(36), primary_key=True, index=True)
    product_id = Column(String(36), ForeignKey("products.id"), index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=True)
    
    # Review details
    rating = Column(Integer, nullable=False)  # 1-5
    title = Column(String(200), nullable=True)
    comment = Column(Text, nullable=True)
    
    # Media
    images = Column(JSON, default=list, nullable=False)
    
    # Status
    is_verified = Column(Boolean, default=False, nullable=False)
    is_approved = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
    
    def __repr__(self):
        return f"<Review {self.product_id} - {self.rating}>"
