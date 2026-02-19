"""
Database Models - Cart, Wishlist, and Other
"""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship


from app.core.database import Base


class CartItem(Base):
    """Cart item model"""
    __tablename__ = "cart_items"
    
    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=True)
    
    # Quantity
    quantity = Column(Integer, default=1, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="cart_items")
    
    def __repr__(self):
        return f"<CartItem {self.product_id} x {self.quantity}>"


class WishlistItem(Base):
    """Wishlist item model"""
    __tablename__ = "wishlist_items"
    
    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="wishlist_items")
    
    def __repr__(self):
        return f"<WishlistItem {self.product_id}>"


class Coupon(Base):
    """Coupon model"""
    __tablename__ = "coupons"
    
    id = Column(String(36), primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    
    # Coupon details
    description = Column(String(500), nullable=True)
    discount_type = Column(String(20), nullable=False)  # percentage, fixed
    discount_value = Column(String(20), nullable=False)
    
    # Limits
    min_order_amount = Column(String(20), nullable=True)
    max_uses = Column(Integer, nullable=True)
    used_count = Column(Integer, default=0, nullable=False)
    per_user_limit = Column(Integer, nullable=True)
    
    # Validity
    starts_at = Column(DateTime, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Target
    target_type = Column(String(20), nullable=True)  # all, category, vendor, product
    target_id = Column(String(36), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Coupon {self.code}>"


class Notification(Base):
    """Notification model"""
    __tablename__ = "notifications"
    
    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    
    # Notification details
    type = Column(String(50), nullable=False)  # order, payment, return, system
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(500), nullable=True)
    data = Column(JSON, nullable=True)
    
    # Status
    is_read = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Notification {self.title}>"


class AuditLog(Base):
    """Audit log model"""
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True, index=True)
    
    # Action details
    user_id = Column(String(36), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(36), nullable=True)
    
    # Changes
    old_data = Column(JSON, nullable=True)
    new_data = Column(JSON, nullable=True)
    
    # Request info
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<AuditLog {self.action} - {self.resource_type}>"
