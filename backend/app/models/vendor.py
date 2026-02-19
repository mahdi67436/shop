"""
Database Models - Vendor
"""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class VendorStatus(enum.Enum):
    """Vendor status enumeration"""
    PENDING = "pending"
    APPROVED = "approved"
    SUSPENDED = "suspended"
    REJECTED = "rejected"


class SubscriptionTier(enum.Enum):
    """Subscription tier enumeration"""
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"


class Vendor(Base):
    """Vendor model"""
    __tablename__ = "vendors"
    
    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    
    # Business details
    shop_name = Column(String(200), nullable=False)
    shop_slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    logo = Column(String(500), nullable=True)
    banner = Column(String(500), nullable=True)
    
    # Contact
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    address = Column(Text, nullable=True)
    
    # Business info
    trade_license_number = Column(String(100), nullable=True)
    tax_id = Column(String(100), nullable=True)
    bank_account_number = Column(String(50), nullable=True)
    bank_name = Column(String(200), nullable=True)
    bank_routing_number = Column(String(50), nullable=True)
    
    # Status and verification
    status = Column(Enum(VendorStatus), default=VendorStatus.PENDING, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    # Subscription
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE, nullable=False)
    subscription_expires_at = Column(DateTime, nullable=True)
    
    # Commission and ratings
    commission_rate = Column(Numeric(5, 2), default=10.00, nullable=False)  # percentage
    rating = Column(Numeric(3, 2), default=0.00, nullable=False)
    total_sales = Column(Integer, default=0, nullable=False)
    total_products = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", backref="vendor")
    products = relationship("Product", back_populates="vendor", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="vendor")
    payout_requests = relationship("PayoutRequest", back_populates="vendor", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Vendor {self.shop_name}>"


class SubscriptionPlan(Base):
    """Subscription plan model"""
    __tablename__ = "subscription_plans"
    
    id = Column(String(36), primary_key=True, index=True)
    
    # Plan details
    name = Column(String(100), nullable=False)
    tier = Column(Enum(SubscriptionTier), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Pricing
    monthly_price = Column(Numeric(10, 2), default=0.00, nullable=False)
    yearly_price = Column(Numeric(10, 2), default=0.00, nullable=False)
    
    # Features
    max_products = Column(Integer, default=10, nullable=False)
    max_images_per_product = Column(Integer, default=5, nullable=False)
    commission_rate = Column(Numeric(5, 2), default=10.00, nullable=False)
    priority_support = Column(Boolean, default=False, nullable=False)
    analytics_access = Column(Boolean, default=False, nullable=False)
    custom_domain = Column(Boolean, default=False, nullable=False)
    featured_listings = Column(Integer, default=0, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<SubscriptionPlan {self.name}>"


class PayoutRequest(Base):
    """Vendor payout request model"""
    __tablename__ = "payout_requests"
    
    id = Column(String(36), primary_key=True, index=True)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), index=True, nullable=False)
    
    # Amount
    amount = Column(Numeric(10, 2), nullable=False)
    
    # Payment details
    payment_method = Column(String(50), nullable=False)  # bkash, nagad, bank
    payment_number = Column(String(20), nullable=False)
    
    # Status
    status = Column(String(20), default="pending", nullable=False)  # pending, processing, completed, rejected
    notes = Column(Text, nullable=True)
    processed_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    vendor = relationship("Vendor", back_populates="payout_requests")
    
    def __repr__(self):
        return f"<PayoutRequest {self.id} - {self.amount}>"
