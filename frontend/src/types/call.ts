export interface CreateCallRequest {
  to_number: string;
}

export interface CreateCallResponse {
  call_id: string;
}

export interface CallAnalysisData {
  call_summary?: string;
  in_voicemail?: boolean;
  user_sentiment?: string;
  call_successful?: boolean;
  custom_analysis_data?: Record<string, any>;
}

export interface CallStatus {
  call_id: string;
  call_status: string;
  call_analysis?: CallAnalysisData;
  transcript?: string;
  transcript_object?: Array<Record<string, any>>;
  transcript_with_tool_calls?: Array<Record<string, any>>;
  created_at?: string;
  ended_at?: string;
  start_timestamp?: number;
  end_timestamp?: number;
  duration_ms?: number;
  agent_name?: string;
  disconnection_reason?: string;
  recording_url?: string;
  recording_multi_channel_url?: string;
  scrubbed_recording_url?: string;
  scrubbed_recording_multi_channel_url?: string;
  public_log_url?: string;
  knowledge_base_retrieved_contents_url?: string;
  latency?: Record<string, any>;
  call_cost?: Record<string, any>;
  llm_token_usage?: Record<string, any>;
  retell_llm_dynamic_variables?: Record<string, any>;
  collected_dynamic_variables?: Record<string, any>;
}