import httpx
import hashlib
import hmac
import logging
from typing import Dict, Any, Optional, List
from .config import settings

logger = logging.getLogger(__name__)

class RetellClient:
    def __init__(self):
        self.base_url = settings.RETELL_BASE_URL
        self.api_key = settings.RETELL_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def create_phone_call(self, to_number: str) -> Dict[str, Any]:
        """Create an outbound phone call using Retell API"""
        payload = {
            "from_number": settings.RETELL_FROM_NUMBER,
            "to_number": to_number,
            "override_agent_id": settings.RETELL_AGENT_ID,
            "retell_llm_dynamic_variables": {
                "today_date": settings.TODAY_DATE
            }
        }
        
        logger.info(f"Creating phone call to {to_number} with payload: {payload}")
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/v2/create-phone-call",
                    json=payload,
                    headers=self.headers
                )
                
                logger.info(f"Retell API response status: {response.status_code}")
                
                if response.status_code not in [200, 201]:
                    error_text = response.text
                    logger.error(f"Retell API error: {response.status_code} - {error_text}")
                    raise httpx.HTTPStatusError(
                        f"Retell API error: {response.status_code} - {error_text}",
                        request=response.request,
                        response=response
                    )
                
                result = response.json()
                logger.info(f"Call created successfully: {result.get('call_id')}")
                return result
                
        except httpx.TimeoutException:
            logger.error("Timeout connecting to Retell API")
            raise Exception("Timeout connecting to Retell API")
        except httpx.ConnectError as e:
            logger.error(f"Connection error to Retell API: {e}")
            raise Exception(f"Failed to connect to Retell API: {e}")
        except Exception as e:
            logger.error(f"Unexpected error calling Retell API: {e}")
            raise
    
    async def get_call(self, call_id: str) -> Dict[str, Any]:
        """Get call details from Retell API"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/v2/get-call/{call_id}",
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Error getting call {call_id}: {e}")
            raise
    
    async def list_calls(self, limit: int = 100) -> List[Dict[str, Any]]:
        """List calls from Retell API"""
        try:
            payload = {
                "filter_criteria": {},
                "sort_order": "descending",
                "limit": limit
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/v2/list-calls",
                    json=payload,
                    headers=self.headers
                )
                
                logger.info(f"List calls response status: {response.status_code}")
                
                if response.status_code not in [200, 201]:
                    error_text = response.text
                    logger.error(f"Retell API error: {response.status_code} - {error_text}")
                    raise httpx.HTTPStatusError(
                        f"Retell API error: {response.status_code} - {error_text}",
                        request=response.request,
                        response=response
                    )
                
                result = response.json()
                logger.info(f"Successfully fetched {len(result)} calls from Retell")
                return result  # Return the list directly
                
        except Exception as e:
            logger.error(f"Error listing calls: {e}")
            raise
    
    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """Verify webhook signature from Retell"""
        if not settings.RETELL_WEBHOOK_VERIFY_KEY:
            return False
        
        expected_signature = hmac.new(
            settings.RETELL_WEBHOOK_VERIFY_KEY.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)

retell_client = RetellClient()