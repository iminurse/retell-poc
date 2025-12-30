from fastapi import APIRouter, Request, HTTPException, Header
from ..retell_client import retell_client
from ..store import call_store
from typing import Optional
import json
import logging
import time

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

@router.post("/retell")
async def retell_webhook(
    request: Request,
    x_retell_signature: Optional[str] = Header(None)
):
    """Handle Retell webhook events"""
    try:
        # Get raw body for signature verification
        body = await request.body()
        
        # Verify webhook signature
        if x_retell_signature:
            if not retell_client.verify_webhook_signature(body, x_retell_signature):
                raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        # Parse webhook payload
        payload = json.loads(body.decode())
        event_type = payload.get("event")
        call_data = payload.get("call", {})
        call_id = call_data.get("call_id")
        
        if not call_id:
            raise HTTPException(status_code=400, detail="Missing call_id in webhook payload")
        
        # Handle different event types
        if event_type == "call_started":
            call_store.set_call_status(call_id, "ongoing")
            call_store.update_call(call_id, {
                "started_at": call_data.get("start_timestamp"),
                "transcript": call_data.get("transcript", ""),
                "agent_name": call_data.get("agent_name"),
                "from_number": call_data.get("from_number"),
                "to_number": call_data.get("to_number")
            })
        
        elif event_type == "call_ended":
            call_store.set_call_status(call_id, "ended")
            call_store.update_call(call_id, {
                "ended_at": call_data.get("end_timestamp"),
                "transcript": call_data.get("transcript", ""),
                "duration_ms": call_data.get("duration_ms"),
                "disconnection_reason": call_data.get("disconnection_reason"),
                "recording_url": call_data.get("recording_url"),
                "recording_multi_channel_url": call_data.get("recording_multi_channel_url"),
                "scrubbed_recording_url": call_data.get("scrubbed_recording_url"),
                "scrubbed_recording_multi_channel_url": call_data.get("scrubbed_recording_multi_channel_url"),
                "public_log_url": call_data.get("public_log_url"),
                "knowledge_base_retrieved_contents_url": call_data.get("knowledge_base_retrieved_contents_url"),
                "latency": call_data.get("latency"),
                "call_cost": call_data.get("call_cost"),
                "llm_token_usage": call_data.get("llm_token_usage"),
                "transcript_object": call_data.get("transcript_object"),
                "transcript_with_tool_calls": call_data.get("transcript_with_tool_calls"),
                "retell_llm_dynamic_variables": call_data.get("retell_llm_dynamic_variables"),
                "collected_dynamic_variables": call_data.get("collected_dynamic_variables")
            })
        
        elif event_type == "call_analyzed":
            # Store call analysis
            analysis = call_data.get("call_analysis", {})
            call_store.set_call_analysis(call_id, analysis)
            call_store.update_call(call_id, {
                "transcript": call_data.get("transcript", ""),
                "transcript_object": call_data.get("transcript_object"),
                "transcript_with_tool_calls": call_data.get("transcript_with_tool_calls"),
                # Update any additional data that might come with analysis
                "latency": call_data.get("latency"),
                "call_cost": call_data.get("call_cost"),
                "llm_token_usage": call_data.get("llm_token_usage")
            })
        
        # Update general call data
        call_store.update_call(call_id, {
            "last_event": event_type,
            "webhook_data": call_data,
            "last_webhook_received": payload.get("timestamp") or int(time.time() * 1000)
        })
        
        return {"status": "ok"}
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")

@router.get("/test")
async def test_webhook():
    """Test endpoint to verify webhook URL is accessible"""
    return {"status": "webhook endpoint is accessible", "timestamp": int(time.time() * 1000)}