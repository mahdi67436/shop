"""
API Router Configuration
"""
from fastapi import APIRouter

from app.api.v1 import (
    auth,
    users,
    products,
    categories,
    orders,
    cart,
    wishlist,
    payments,
    vendors,
    notifications,
)

api_router = APIRouter()

# Include sub-routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(cart.router, prefix="/cart", tags=["Cart"])
api_router.include_router(wishlist.router, prefix="/wishlist", tags=["Wishlist"])
api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])
api_router.include_router(vendors.router, prefix="/vendors", tags=["Vendors"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
