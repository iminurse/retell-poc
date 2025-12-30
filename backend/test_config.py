#!/usr/bin/env python3
"""
Test script to verify Retell API configuration and connectivity
"""
import asyncio
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load .env file explicitly
env_path = Path(__file__).parent / ".env"
print(f"Looking for .env file at: {env_path}")
print(f".env file exists: {env_path.exists()}")

if env_path.exists():
    load_dotenv(env_path)
    print("Loaded .env file")
    
    # Test direct environment variable access
    print(f"Direct os.getenv('RETELL_API_KEY'): {os.getenv('RETELL_API_KEY', 'NOT_FOUND')}")
    print(f"Direct os.getenv('RETELL_FROM_NUMBER'): {os.getenv('RETELL_FROM_NUMBER', 'NOT_FOUND')}")
else:
    print("❌ .env file not found")

from app.config import settings
from app.retell_client import retell_client

async def test_config():
    """Test configuration and API connectivity"""
    print("\n=== Retell POC Configuration Test ===\n")
    
    # Check environment variables
    print("1. Environment Variables:")
    print(f"   RETELL_API_KEY: {'✓ Set' if settings.RETELL_API_KEY else '✗ Missing'} (len: {len(settings.RETELL_API_KEY)})")
    print(f"   RETELL_FROM_NUMBER: {settings.RETELL_FROM_NUMBER}")
    print(f"   RETELL_AGENT_ID: {settings.RETELL_AGENT_ID}")
    print(f"   RETELL_BASE_URL: {settings.RETELL_BASE_URL}")
    print(f"   TODAY_DATE: {settings.TODAY_DATE}")
    print()
    
    if not settings.RETELL_API_KEY:
        print("❌ RETELL_API_KEY is not set. Please check your .env file.")
        return
    
    if not settings.RETELL_FROM_NUMBER:
        print("❌ RETELL_FROM_NUMBER is not set. Please check your .env file.")
        return
    
    if not settings.RETELL_AGENT_ID:
        print("❌ RETELL_AGENT_ID is not set. Please check your .env file.")
        return
    
    # Test API connectivity (without making a call)
    print("2. API Connectivity Test:")
    try:
        import httpx
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Test basic connectivity to Retell API with a simpler endpoint
            response = await client.get(
                f"{settings.RETELL_BASE_URL}/v2/list-calls",
                headers={
                    "Authorization": f"Bearer {settings.RETELL_API_KEY}",
                    "Content-Type": "application/json"
                }
            )
            
            if response.status_code == 200:
                print("   ✓ Successfully connected to Retell API")
            elif response.status_code == 401:
                print("   ✗ Authentication failed - check your API key")
            elif response.status_code == 404:
                print("   ⚠ Endpoint not found - trying alternative endpoint")
                # Try a different endpoint
                response2 = await client.post(
                    f"{settings.RETELL_BASE_URL}/v2/list-calls",
                    json={},
                    headers={
                        "Authorization": f"Bearer {settings.RETELL_API_KEY}",
                        "Content-Type": "application/json"
                    }
                )
                if response2.status_code == 200:
                    print("   ✓ Successfully connected to Retell API (POST method)")
                else:
                    print(f"   ⚠ API accessible but endpoint structure may differ: {response2.status_code}")
            else:
                print(f"   ⚠ Unexpected response: {response.status_code}")
                
    except httpx.ConnectError:
        print("   ✗ Connection failed - check internet connection")
    except httpx.TimeoutException:
        print("   ✗ Connection timeout - check internet connection")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print("\n=== Test Complete ===")
    print("If all checks pass, you can start the backend server:")
    print("uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")

if __name__ == "__main__":
    asyncio.run(test_config())