import { useState, useEffect } from 'react';
import { retellApi } from '../api/retell';

interface CallHistoryItem {
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
}

interface CallHistoryProps {
  currentCallId: string | null;
  onCallSelect: (callId: string) => void;
}

export const CallHistory: React.FC<CallHistoryProps> = ({ currentCallId, onCallSelect }) => {
  const [calls, setCalls] = useState<CallHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCalls = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const callsList = await retellApi.getAllCalls();
      setCalls(callsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calls');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
  }, []);

  return (
    <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>📋 Call History</h3>
        <button
          onClick={loadCalls}
          disabled={isLoading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {isLoading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      {calls.length === 0 && !isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
          <p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>
            No calls found in your Retell account.
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            Make your first call using the form above, or check if your API credentials are correct.
          </p>
        </div>
      ) : (
        <div>
          <label htmlFor="call-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Select a call to view details:
          </label>
          <select
            id="call-select"
            value={currentCallId || ''}
            onChange={(e) => e.target.value && onCallSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select a call...</option>
            {calls.map((call) => (
              <option key={call.call_id} value={call.call_id}>
                {call.call_id.slice(-8)} | {call.direction === 'inbound' ? call.from_number : call.to_number}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};