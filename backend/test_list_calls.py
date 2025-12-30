#!/usr/bin/env python3
"""
Test script to verify list calls API
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
if env_path.exists():
    load_dotenv(env_path)

from app.retell_client import retell_client

async def test_list_calls():
    """Test the list calls functionality"""
    print("=== Testing List Calls API ===\n")
    
    try:
        print("1. Testing Retell API list calls...")
        calls = await retell_client.list_calls(limit=10)
        
        print(f"✅ Successfully fetched {len(calls)} calls from Retell API")
        
        if calls:
            print("\n📋 Sample call data:")
            sample_call = calls[0]
            print(f"   Call ID: {sample_call.get('call_id')}")
            print(f"   Status: {sample_call.get('call_status')}")
            print(f"   Agent: {sample_call.get('agent_name', 'N/A')}")
            print(f"   Direction: {sample_call.get('direction', 'N/A')}")
            print(f"   To Number: {sample_call.get('to_number', 'N/A')}")
            print(f"   From Number: {sample_call.get('from_number', 'N/A')}")
            print(f"   Start Time: {sample_call.get('start_timestamp', 'N/A')}")
            print(f"   Duration: {sample_call.get('duration_ms', 'N/A')}ms")
            print(f"   Has Analysis: {bool(sample_call.get('call_analysis'))}")
            print(f"   Has Recording: {bool(sample_call.get('recording_url'))}")
        else:
            print("📭 No calls found in your Retell account")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_list_calls())