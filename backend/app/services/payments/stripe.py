"""
Stripe Payment Gateway Integration
International Card Payments
"""
import stripe
from typing import Dict, Optional

from app.core.config import settings

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class StripePayment:
    """Stripe Payment Gateway Integration"""
    
    def __init__(self):
        self.webhook_secret = settings.STRIPE_WEBHOOK_SECRET
    
    async def create_checkout_session(
        self,
        amount: float,
        currency: str = "bdt",
        order_id: str = "",
        customer_email: str = "",
        callback_url: str = "",
        cancel_url: str = ""
    ) -> Optional[Dict]:
        """Create a Stripe checkout session"""
        
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": currency,
                            "product_data": {
                                "name": f"ShopMax Order #{order_id}",
                            },
                            "unit_amount": int(amount * 100),  # Convert to cents
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url=callback_url,
                cancel_url=cancel_url,
                customer_email=customer_email,
                metadata={
                    "order_id": order_id
                }
            )
            
            return {
                "session_id": session.id,
                "url": session.url
            }
        except Exception:
            return None
    
    async def verify_payment(self, session_id: str) -> Optional[Dict]:
        """Verify a Stripe payment"""
        
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            
            return {
                "id": session.id,
                "payment_status": session.payment_status,
                "customer_email": session.customer_email,
                "amount_total": session.amount_total / 100,
                "currency": session.currency,
                "metadata": session.metadata
            }
        except Exception:
            return None
    
    async def create_refund(
        self,
        payment_intent_id: str,
        amount: Optional[float] = None,
        reason: str = ""
    ) -> Optional[Dict]:
        """Create a Stripe refund"""
        
        try:
            refund_data = {
                "payment_intent": payment_intent_id,
            }
            
            if amount:
                refund_data["amount"] = int(amount * 100)
            
            if reason:
                refund_data["reason"] = reason
            
            refund = stripe.Refund.create(**refund_data)
            
            return {
                "id": refund.id,
                "amount": refund.amount / 100,
                "status": refund.status,
                "reason": refund.reason
            }
        except Exception:
            return None
    
    def construct_webhook_event(self, payload: bytes, signature: str) -> Optional[Dict]:
        """Construct webhook event from payload"""
        
        try:
            event = stripe.Webhook.construct_event(
                payload,
                signature,
                self.webhook_secret
            )
            return event
        except Exception:
            return None


# Singleton instance
stripe_payment = StripePayment()
