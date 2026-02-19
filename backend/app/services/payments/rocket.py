"""
Rocket Payment Gateway Integration (DBBL)
Dutch-Bangla Bank's Mobile Banking
"""
import httpx
import hashlib
import uuid
from datetime import datetime
from typing import Dict, Optional

from app.core.config import settings


class RocketPayment:
    """Rocket Payment Gateway Integration"""
    
    def __init__(self):
        self.base_url = "https://sandbox.dbblexpress.com/api" if settings.ROCKET_MODE == "test" else "https://express.dbblexpress.com/api"
        self.merchant_id = settings.ROCKET_MERCHANT_ID
        self.merchant_key = settings.ROCKET_MERCHANT_KEY
    
    def _generate_checksum(self, data: str) -> str:
        """Generate checksum for Rocket"""
        return hashlib.sha256((data + self.merchant_key).encode()).hexdigest()
    
    async def create_payment(
        self,
        amount: float,
        order_id: str,
        customer_mobile: str,
        callback_url: str
    ) -> Optional[Dict]:
        """Create a Rocket payment"""
        
        # Generate checksum
        checksum_data = f"{self.merchant_id}{order_id}{amount}{customer_mobile}"
        checksum = self._generate_checksum(checksum_data)
        
        headers = {
            "Content-Type": "application/json",
            "Merchant-ID": self.merchant_id,
            "Checksum": checksum
        }
        
        data = {
            "merchantId": self.merchant_id,
            "orderId": order_id,
            "amount": str(amount),
            "customerMobile": customer_mobile,
            "callbackUrl": callback_url,
            "purpose": "ShopMax Payment"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/checkout/payment",
                    headers=headers,
                    json=data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "trx_id": result.get("trxId"),
                        "amount": result.get("amount"),
                        "customer_mobile": customer_mobile,
                    }
                return None
            except Exception:
                return None
    
    async def verify_payment(self, trx_id: str) -> Optional[Dict]:
        """Verify a Rocket payment"""
        
        checksum_data = f"{self.merchant_id}{trx_id}"
        checksum = self._generate_checksum(checksum_data)
        
        headers = {
            "Content-Type": "application/json",
            "Merchant-ID": self.merchant_id,
            "Checksum": checksum
        }
        
        data = {
            "merchantId": self.merchant_id,
            "trxId": trx_id
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/checkout/verify",
                    headers=headers,
                    json=data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception:
                return None


# Singleton instance
rocket_payment = RocketPayment()
