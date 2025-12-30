import { CreateCallRequest, CreateCallResponse, CallStatus } from '../types/call';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const retellApi = {
  async createCall(request: CreateCallRequest): Promise<CreateCallResponse> {
    const response = await fetch(`${API_BASE_URL}/api/calls/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create call' }));
      throw new Error(error.detail || 'Failed to create call');
    }

    return response.json();
  },

  async getCallStatus(callId: string): Promise<CallStatus> {
    const response = await fetch(`${API_BASE_URL}/api/calls/${callId}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to get call status' }));
      throw new Error(error.detail || 'Failed to get call status');
    }

    return response.json();
  },

  async getAllCalls(): Promise<Array<{
    call_id: string;
    call_status: string;
    to_number: string;
    from_number: string;
    agent_name: string;
    agent_id: string;
    direction: string;
    created_at?: string;
    updated_at?: string;
    start_timestamp?: number;
    end_timestamp?: number;
    duration_ms?: number;
    disconnection_reason?: string;
    has_analysis: boolean;
    has_recording: boolean;
    call_cost?: number;
  }>> {
    const response = await fetch(`${API_BASE_URL}/api/calls/`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to get calls list' }));
      throw new Error(error.detail || 'Failed to get calls list');
    }

    return response.json();
  },
};