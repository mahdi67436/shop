"""
bKash Payment Gateway Integration
Bangladesh's Leading Mobile Financial Service
"""
import httpx
import json
import hashlib
import uuid
from datetime import datetime
from typing import Dict, Optional

from app.core.config import settings


class BKashPayment:
    """bKash Payment Gateway Integration"""
    
    def __init__(self):
        self.base_url = "https://checkout.pay.bka.sh/vedor" if settings.BKASH_MODE == "live" else "https://checkout.sandbox.bka.sh/vedor"
        self.app_key = settings.BKASH_APP_KEY
        self.app_secret = settings.BKASH_APP_SECRET
        self.username = settings.BKASH_USERNAME
        self.password = settings.BKASH_PASSWORD
    
    async def get_token(self) -> Optional[str]:
        """Get access token from bKash"""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "username": self.username,
            "password": self.password
        }
        
        data = {
            "app_key": self.app_key,
            "app_secret": self.app_secret
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/checkout/token/grant",
                    headers=headers,
                    json=data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get("id_token")
                return None
            except Exception:
                return None
    
    async def create_payment(
        self,
        amount: float,
        merchant_invoice_number: str,
        intent: str = "sale",
        callback_url: str = ""
    ) -> Optional[Dict]:
        """Create a bKash payment"""
        token = await self.get_token()
        if not token:
            return None
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token,
            "X-APP-Key": self.app_key
        }
        
        data = {
            "intent": intent,
            "merchantInvoiceNumber": merchant_invoice_number,
            "amount": str(amount),
            "merchantAssociationInfo": "MI07MID",
            "intent": "sale",
            "merchantUpdateURL": callback_url,
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/checkout/v1.2.0-beta/payment/create",
                    headers=headers,
                    json=data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception:
                return None
    
    async def execute_payment(self, payment_id: str) -> Optional[Dict]:
        """Execute a bKash payment"""
        token = await self.get_token()
        if not token:
            return None
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token,
            "X-APP-Key": self.app_key
        }
        
        data = {"payment_id": payment_id}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/checkout/v1.2.0-beta/payment/execute",
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
        payment_id: str,
        amount: float,
        reason: str = ""
    ) -> Optional[Dict]:
        """Refund a bKash payment"""
        token = await self.get_token()
        if not token:
            return None
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token,
            "X-APP-Key": self.app_key
        }
        
        data = {
            "paymentId": payment_id,
            "amount": str(amount),
            "trxId": str(uuid.uuid4()),
            "sku": "REFUND",
            "reason": reason
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/checkout/v1.2.0-beta/payment/refund",
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
bkash_payment = BKashPayment()
