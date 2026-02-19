"""
Nagad Payment Gateway Integration
Bangladesh's Digital Payment Service
"""
import httpx
import hashlib
import uuid
from datetime import datetime
from typing import Dict, Optional
import json

from app.core.config import settings


class NagadPayment:
    """Nagad Payment Gateway Integration"""
    
    def __init__(self):
        self.base_url = "https://api-nagad.paywave.net" if settings.NAGAD_MODE == "live" else "https://sandbox-api-nagad.paywave.net"
        self.merchant_id = settings.NAGAD_MERCHANT_ID
        self.merchant_key = settings.NAGAD_MERCHANT_KEY
    
    def _generate_signature(self, data: str) -> str:
        """Generate signature for Nagad"""
        return hashlib.sha256((data + self.merchant_key).encode()).hexdigest()
    
    async def create_payment(
        self,
        amount: float,
        order_id: str,
        callback_url: str
    ) -> Optional[Dict]:
        """Create a Nagad payment"""
        
        # Generate signature
        signature_data = f"{self.merchant_id}{order_id}{amount}{datetime.now().isoformat()}"
        signature = self._generate_signature(signature_data)
        
        headers = {
            "Content-Type": "application/json",
            "X-KM-IP-V4": "127.0.0.1",
            "X-KM-Api-Version": "v-0.2.0",
            "X-KM-Client-Type": "PC_WEB",
            "X-KM-Merchant-Id": self.merchant_id,
            "X-KM-Request-Id": str(uuid.uuid4()),
            "X-KM-Signature": signature
        }
        
        data = {
            "merchantId": self.merchant_id,
            "merchantKey": self.merchant_key,
            "datetime": datetime.now().isoformat(),
            "orderId": order_id,
            "amount": str(amount),
            "productName": "ShopMax Order",
            "productDescription": "Payment for order",
            "callbackUrl": callback_url
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/ps/api/checkout-xm/token/ezzy-pay",
                    headers=headers,
                    json=data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "payment_ref_id": result.get("paymentRefId"),
                        "amount": result.get("amount"),
                        "datetime": result.get("datetime"),
                        "created_at": result.get("created_at"),
                    }
                return None
            except Exception:
                return None
    
    async def verify_payment(self, payment_ref_id: str) -> Optional[Dict]:
        """Verify a Nagad payment"""
        
        signature_data = f"{self.merchant_id}{payment_ref_id}"
        signature = self._generate_signature(signature_data)
        
        headers = {
            "Content-Type": "application/json",
            "X-KM-IP-V4": "127.0.0.1",
            "X-KM-Api-Version": "v-0.2.0",
            "X-KM-Client-Type": "PC_WEB",
            "X-KM-Merchant-Id": self.merchant_id,
            "X-KM-Request-Id": str(uuid.uuid4()),
            "X-KM-Signature": signature
        }
        
        data = {
            "merchantId": self.merchant_id,
            "paymentRefId": payment_ref_id
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/ps/api/checkout-xm/verify/payment",
                    headers=headers,
                    json=data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception:
                return None
    
    async def refund_payment(
        self,
        payment_ref_id: str,
        amount: float,
        reason: str = ""
    ) -> Optional[Dict]:
        """Refund a Nagad payment"""
        
        signature_data = f"{self.merchant_id}{payment_ref_id}"
        signature = self._generate_signature(signature_data)
        
        headers = {
            "Content-Type": "application/json",
            "X-KM-IP-V4": "127.0.0.1",
            "X-KM-Api-Version": "v-0.2.0",
            "X-KM-Client-Type": "PC_WEB",
            "X-KM-Merchant-Id": self.merchant_id,
            "X-KM-Request-Id": str(uuid.uuid4()),
            "X-KM-Signature": signature
        }
        
        data = {
            "merchantId": self.merchant_id,
            "paymentRefId": payment_ref_id,
            "amount": str(amount),
            "reason": reason
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/ps/api/checkout-xm/refund",
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
nagad_payment = NagadPayment()
