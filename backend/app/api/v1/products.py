"""
Product API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
import uuid

from app.core.database import get_db
from app.core.security import decode_token
from app.models.product import Product, ProductStatus, Category, Brand
from app.models.vendor import Vendor, VendorStatus

router = APIRouter()


class ProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str]
    price: float
    original_price: Optional[float]
    images: list
    category_id: str
    vendor_id: str
    stock: int
    rating: float
    review_count: int
    
    class Config:
        from_attributes = True


@router.get("")
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category_id: Optional[str] = None,
    vendor_id: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get products list"""
    
    query = select(Product).where(Product.status == ProductStatus.APPROVED)
    
    if category_id:
        query = query.where(Product.category_id == category_id)
    if vendor_id:
        query = query.where(Product.vendor_id == vendor_id)
    if featured:
        query = query.where(Product.is_featured == True)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    
    # Get total count
    from sqlalchemy import func
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    
    # Apply pagination
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()
    
    return {
        "data": [ProductResponse.model_validate(p) for p in products],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit
        }
    }


@router.get("/{product_id}")
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    """Get single product"""
    
    result = await db.execute(
        select(Product).where(
            Product.id == product_id,
            Product.status == ProductStatus.APPROVED
        )
    )
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return ProductResponse.model_validate(product)
