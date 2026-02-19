"""
Database Models - Orders
"""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, Text, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
import enum


class OrderStatus(enum.Enum):
    """Order status enumeration"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentStatus(enum.Enum):
    """Payment status enumeration"""
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"


class Order(Base):
    """Order model"""
    __tablename__ = "orders"
    
    id = Column(String(36), primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), index=True, nullable=False)
    
    # Pricing
    subtotal = Column(Numeric(10, 2), nullable=False)
    shipping_cost = Column(Numeric(10, 2), default=0.00, nullable=False)
    tax = Column(Numeric(10, 2), default=0.00, nullable=False)
    discount = Column(Numeric(10, 2), default=0.00, nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    
    # Platform fee and vendor payout
    platform_fee = Column(Numeric(10, 2), default=0.00, nullable=False)
    vendor_payout = Column(Numeric(10, 2), default=0.00, nullable=False)
    
    # Status
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    
    # Payment details
    payment_method = Column(String(50), nullable=True)
    payment_transaction_id = Column(String(100), nullable=True)
    
    # Shipping
    shipping_address = Column(JSON, nullable=False)
    
    # Notes
    customer_note = Column(Text, nullable=True)
    vendor_note = Column(Text, nullable=True)
    admin_note = Column(Text, nullable=True)
    
    # Delivery
    estimated_delivery = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    vendor = relationship("Vendor", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)
    
    def __repr__(self):
        return f"<Order {self.order_number}>"


class OrderItem(Base):
    """Order item model"""
    __tablename__ = "order_items"
    
    id = Column(String(36), primary_key=True, index=True)
    order_id = Column(String(36), ForeignKey("orders.id"), index=True, nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=True)
    
    # Item details
    product_name = Column(String(500), nullable=False)
    product_image = Column(String(500), nullable=True)
    variant_name = Column(String(200), nullable=True)
    
    # Pricing
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    
    # Status
    status = Column(String(20), default="pending", nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    
    def __repr__(self):
        return f"<OrderItem {self.product_name}>"


class Payment(Base):
    """Payment model"""
    __tablename__ = "payments"
    
    id = Column(String(36), primary_key=True, index=True)
    order_id = Column(String(36), ForeignKey("orders.id"), unique=True, index=True, nullable=False)
    
    # Amount
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), default="BDT", nullable=False)
    
    # Payment gateway
    gateway = Column(String(50), nullable=False)  # bkash, nagad, rocket, stripe, cod
    transaction_id = Column(String(100), nullable=True)
    gateway_response = Column(JSON, nullable=True)
    
    # Status
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    
    # Payment details
    payment_number = Column(String(20), nullable=True)
    
    # Refund
    refund_amount = Column(Numeric(10, 2), default=0.00, nullable=False)
    refund_reason = Column(Text, nullable=True)
    refunded_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="payment")
    
    def __repr__(self):
        return f"<Payment {self.gateway} - {self.amount}>"


class ReturnRequest(Base):
    """Return request model"""
    __tablename__ = "return_requests"
    
    id = Column(String(36), primary_key=True, index=True)
    order_id = Column(String(36), ForeignKey("orders.id"), index=True, nullable=False)
    order_item_id = Column(String(36), ForeignKey("order_items.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    
    # Reason
    reason = Column(Text, nullable=False)
    images = Column(JSON, default=list, nullable=False)
    
    # Status
    status = Column(String(20), default="pending", nullable=False)  # pending, approved, rejected, completed
    admin_note = Column(Text, nullable=True)
    
    # Refund
    refund_amount = Column(Numeric(10, 2), nullable=True)
    refund_method = Column(String(50), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<ReturnRequest {self.id}>"
