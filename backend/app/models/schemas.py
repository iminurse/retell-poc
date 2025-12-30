from pydantic import BaseModel
from typing import Optional, Dict, Any, List, Union
from datetime import datetime

class CreateCallRequest(BaseModel):
    to_number: str

class CreateCallResponse(BaseModel):
    call_id: str

class LatencyMetrics(BaseModel):
    p50: Optional[Union[int, float]] = None
    p90: Optional[Union[int, float]] = None
    p95: Optional[Union[int, float]] = None
    p99: Optional[Union[int, float]] = None
    max: Optional[Union[int, float]] = None
    min: Optional[Union[int, float]] = None
    num: Optional[int] = None
    values: Optional[List[Union[int, float]]] = None

class CallLatency(BaseModel):
    e2e: Optional[LatencyMetrics] = None
    asr: Optional[LatencyMetrics] = None
    llm: Optional[LatencyMetrics] = None
    llm_websocket_network_rtt: Optional[LatencyMetrics] = None
    tts: Optional[LatencyMetrics] = None
    knowledge_base: Optional[LatencyMetrics] = None
    s2s: Optional[LatencyMetrics] = None

class CallCost(BaseModel):
    product_costs: Optional[List[Dict[str, Any]]] = None
    total_duration_seconds: Optional[Union[int, float]] = None
    total_duration_unit_price: Optional[Union[int, float]] = None
    combined_cost: Optional[Union[int, float]] = None

class LLMTokenUsage(BaseModel):
    values: Optional[List[Union[int, float]]] = None
    average: Optional[Union[int, float]] = None
    num_requests: Optional[int] = None

class CallAnalysisData(BaseModel):
    call_summary: Optional[str] = None
    in_voicemail: Optional[bool] = None
    user_sentiment: Optional[str] = None
    call_successful: Optional[bool] = None
    custom_analysis_data: Optional[Dict[str, Any]] = None

class TranscriptWord(BaseModel):
    word: str
    start: float
    end: float

class TranscriptEntry(BaseModel):
    role: str
    content: Optional[str] = None  # Make content optional for tool calls
    words: Optional[List[TranscriptWord]] = None
    # Add fields for tool calls and other transcript entry types
    tool_call_id: Optional[str] = None
    tool_name: Optional[str] = None
    arguments: Optional[Dict[str, Any]] = None
    result: Optional[str] = None
    time_sec: Optional[float] = None
    type: Optional[str] = None

class CallStatus(BaseModel):
    call_id: str
    call_status: str
    call_analysis: Optional[CallAnalysisData] = None
    transcript: Optional[str] = None
    transcript_object: Optional[List[Dict[str, Any]]] = None  # More flexible
    transcript_with_tool_calls: Optional[List[Dict[str, Any]]] = None  # More flexible
    created_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    start_timestamp: Optional[int] = None
    end_timestamp: Optional[int] = None
    duration_ms: Optional[int] = None
    agent_name: Optional[str] = None
    disconnection_reason: Optional[str] = None
    recording_url: Optional[str] = None
    recording_multi_channel_url: Optional[str] = None
    scrubbed_recording_url: Optional[str] = None
    scrubbed_recording_multi_channel_url: Optional[str] = None
    public_log_url: Optional[str] = None
    knowledge_base_retrieved_contents_url: Optional[str] = None
    latency: Optional[Dict[str, Any]] = None  # More flexible
    call_cost: Optional[Dict[str, Any]] = None  # More flexible
    llm_token_usage: Optional[Dict[str, Any]] = None  # More flexible
    retell_llm_dynamic_variables: Optional[Dict[str, Any]] = None
    collected_dynamic_variables: Optional[Dict[str, Any]] = None

class WebhookPayload(BaseModel):
    event: str
    call: Dict[str, Any]