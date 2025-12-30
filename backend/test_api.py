#!/usr/bin/env python3
"""
Test the API endpoints directly
"""
import asyncio
import httpx
import json

async def test_create_call():
    """Test the create call endpoint"""
    print("Testing create call endpoint...")
    
    payload = {
        "to_number": "+17578348255"  # Test number in proper E.164 format
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "http://localhost:8000/api/calls/",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                print("✅ API endpoint is working correctly!")
                result = response.json()
                call_id = result.get("call_id")
                if call_id:
                    print(f"Call ID: {call_id}")
                    return call_id
            else:
                print(f"❌ API returned error: {response.status_code}")
                
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return None

if __name__ == "__main__":
    asyncio.run(test_create_call())