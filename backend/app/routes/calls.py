import logging
from fastapi import APIRouter, HTTPException
from ..models.schemas import CreateCallRequest, CreateCallResponse, CallStatus
from ..retell_client import retell_client
from ..store import call_store
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/calls", tags=["calls"])

@router.get("/", response_model=List[Dict[str, Any]])
async def list_calls():
    """Get list of all calls from Retell API"""
    try:
        logger.info("Getting list of all calls from Retell API")
        
        # Fetch calls from Retell API - this returns a list directly
        retell_calls = await retell_client.list_calls(limit=100)
        
        # Process and format the calls
        all_calls = []
        for call_data in retell_calls:
            call_id = call_data.get("call_id")
            
            # Merge with local store data if available
            local_data = call_store.get_call(call_id) if call_id else {}
            
            call_info = {
                "call_id": call_id,
                "call_status": call_data.get("call_status", "unknown"),
                "to_number": call_data.get("to_number", ""),
                "from_number": call_data.get("from_number", ""),
                "agent_name": call_data.get("agent_name", ""),
                "agent_id": call_data.get("agent_id", ""),
                "direction": call_data.get("direction", ""),
                "start_timestamp": call_data.get("start_timestamp"),
                "end_timestamp": call_data.get("end_timestamp"),
                "duration_ms": call_data.get("duration_ms"),
                "disconnection_reason": call_data.get("disconnection_reason"),
                "created_at": local_data.get("created_at") if local_data else None,
                "updated_at": local_data.get("updated_at") if local_data else None,
                # Include analysis status
                "has_analysis": bool(call_data.get("call_analysis") or (local_data and local_data.get("call_analysis"))),
                "has_recording": bool(call_data.get("recording_url")),
                "call_cost": call_data.get("call_cost", {}).get("combined_cost") if call_data.get("call_cost") else None
            }
            all_calls.append(call_info)
        
        # Sort by start_timestamp (most recent first), fallback to end_timestamp
        all_calls.sort(key=lambda x: x.get("start_timestamp") or x.get("end_timestamp") or 0, reverse=True)
        
        logger.info(f"Successfully processed {len(all_calls)} calls from Retell API")
        return all_calls
    
    except Exception as e:
        logger.error(f"Failed to list calls: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list calls: {str(e)}")

@router.post("/", response_model=CreateCallResponse)
async def create_call(request: CreateCallRequest):
    """Create an outbound phone call"""
    try:
        # Call Retell API to create phone call
        call_data = await retell_client.create_phone_call(request.to_number)
        call_id = call_data.get("call_id")
        
        if not call_id:
            raise HTTPException(status_code=500, detail="Failed to create call")
        
        # Store initial call data
        call_store.update_call(call_id, {
            "call_id": call_id,
            "call_status": "created",
            "to_number": request.to_number,
            "retell_data": call_data
        })
        
        return CreateCallResponse(call_id=call_id)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create call: {str(e)}")

@router.get("/{call_id}", response_model=CallStatus)
async def get_call_status(call_id: str):
    """Get call status and analysis"""
    try:
        logger.info(f"Getting status for call: {call_id}")
        
        # Always try to fetch fresh data from Retell API for more accurate status
        try:
            logger.info(f"Fetching fresh data from Retell API for call: {call_id}")
            retell_data = await retell_client.get_call(call_id)
            
            # Update our store with fresh data
            call_store.update_call(call_id, {
                "call_id": call_id,
                "call_status": retell_data.get("call_status", "unknown"),
                "retell_data": retell_data,
                # Update with any new data from Retell API
                "transcript": retell_data.get("transcript", ""),
                "duration_ms": retell_data.get("duration_ms"),
                "agent_name": retell_data.get("agent_name"),
                "start_timestamp": retell_data.get("start_timestamp"),
                "end_timestamp": retell_data.get("end_timestamp"),
                "disconnection_reason": retell_data.get("disconnection_reason"),
                "recording_url": retell_data.get("recording_url"),
                "recording_multi_channel_url": retell_data.get("recording_multi_channel_url"),
                "scrubbed_recording_url": retell_data.get("scrubbed_recording_url"),
                "scrubbed_recording_multi_channel_url": retell_data.get("scrubbed_recording_multi_channel_url"),
                "public_log_url": retell_data.get("public_log_url"),
                "knowledge_base_retrieved_contents_url": retell_data.get("knowledge_base_retrieved_contents_url"),
                "latency": retell_data.get("latency"),
                "call_cost": retell_data.get("call_cost"),
                "llm_token_usage": retell_data.get("llm_token_usage"),
                "transcript_object": retell_data.get("transcript_object"),
                "transcript_with_tool_calls": retell_data.get("transcript_with_tool_calls"),
                "retell_llm_dynamic_variables": retell_data.get("retell_llm_dynamic_variables"),
                "collected_dynamic_variables": retell_data.get("collected_dynamic_variables")
            })
            
            # If call analysis is available in the API response, store it
            if retell_data.get("call_analysis"):
                call_store.set_call_analysis(call_id, retell_data.get("call_analysis"))
            
        except Exception as e:
            logger.warning(f"Failed to fetch fresh data from Retell API: {e}")
        
        # Get data from store (either fresh or cached)
        stored_call = call_store.get_call(call_id)
        if not stored_call:
            raise HTTPException(status_code=404, detail="Call not found")
        
        return CallStatus(
            call_id=call_id,
            call_status=stored_call.get("call_status", "unknown"),
            call_analysis=stored_call.get("call_analysis"),
            transcript=stored_call.get("transcript"),
            transcript_object=stored_call.get("transcript_object"),
            transcript_with_tool_calls=stored_call.get("transcript_with_tool_calls"),
            created_at=stored_call.get("created_at"),
            ended_at=stored_call.get("ended_at"),
            start_timestamp=stored_call.get("started_at"),
            end_timestamp=stored_call.get("ended_at"),
            duration_ms=stored_call.get("duration_ms"),
            agent_name=stored_call.get("agent_name"),
            disconnection_reason=stored_call.get("disconnection_reason"),
            recording_url=stored_call.get("recording_url"),
            recording_multi_channel_url=stored_call.get("recording_multi_channel_url"),
            scrubbed_recording_url=stored_call.get("scrubbed_recording_url"),
            scrubbed_recording_multi_channel_url=stored_call.get("scrubbed_recording_multi_channel_url"),
            public_log_url=stored_call.get("public_log_url"),
            knowledge_base_retrieved_contents_url=stored_call.get("knowledge_base_retrieved_contents_url"),
            latency=stored_call.get("latency"),
            call_cost=stored_call.get("call_cost"),
            llm_token_usage=stored_call.get("llm_token_usage"),
            retell_llm_dynamic_variables=stored_call.get("retell_llm_dynamic_variables"),
            collected_dynamic_variables=stored_call.get("collected_dynamic_variables")
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get call status: {str(e)}")