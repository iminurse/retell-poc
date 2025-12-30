import asyncio
import httpx

async def test_endpoint():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get('http://localhost:8000/api/calls/')
            print(f'Status: {response.status_code}')
            if response.status_code == 200:
                calls = response.json()
                print(f'Found {len(calls)} calls')
                if calls:
                    call = calls[0]
                    print(f'First call: {call.get("call_id")} - {call.get("call_status")}')
            else:
                print(f'Error: {response.text}')
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    asyncio.run(test_endpoint())