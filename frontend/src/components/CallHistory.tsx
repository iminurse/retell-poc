import React, { useState, useEffect } from 'react';
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

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (durationMs?: number) => {
    if (!durationMs) return 'N/A';
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return '#ffa500';
      case 'registered': return '#17a2b8';
      case 'ongoing': return '#007bff';
      case 'ended': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created': return '📞';
      case 'registered': return '🔄';
      case 'ongoing': return '📱';
      case 'ended': return '✅';
      default: return '❓';
    }
  };

  const formatCost = (cost?: number) => {
    if (cost === undefined || cost === null) return '';
    return ` | $${(cost / 100).toFixed(4)}`;
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'inbound' ? '📞' : '📱';
  };

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
                {getDirectionIcon(call.direction)} {call.call_id.slice(-8)} | 
                {call.direction === 'inbound' ? `From: ${call.from_number}` : `To: ${call.to_number}`} | 
                {formatTimestamp(call.start_timestamp || call.end_timestamp)} | 
                {call.call_status} | 
                {formatDuration(call.duration_ms)}
                {call.has_analysis ? ' | 📊' : ''}
                {call.has_recording ? ' | 🎵' : ''}
                {formatCost(call.call_cost)}
              </option>
            ))}
          </select>

          {calls.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Recent Calls Summary:</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {calls.slice(0, 10).map((call) => (
                  <div
                    key={call.call_id}
                    onClick={() => onCallSelect(call.call_id)}
                    style={{
                      padding: '0.75rem',
                      margin: '0.25rem 0',
                      backgroundColor: call.call_id === currentCallId ? '#e3f2fd' : '#f8f9fa',
                      border: call.call_id === currentCallId ? '2px solid #007bff' : '1px solid #dee2e6',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {getDirectionIcon(call.direction)} {getStatusIcon(call.call_status)} {call.call_id.slice(-8)}
                          <span style={{ marginLeft: '0.5rem', fontWeight: 'normal', color: '#666' }}>
                            {call.agent_name || 'Unknown Agent'}
                          </span>
                        </div>
                        <div style={{ color: '#666', fontSize: '0.8rem' }}>
                          {call.direction === 'inbound' ? (
                            <>📞 From: {call.from_number} → {call.to_number}</>
                          ) : (
                            <>📱 To: {call.to_number}</>
                          )}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          🕒 {formatTimestamp(call.start_timestamp || call.end_timestamp)}
                        </div>
                        {call.disconnection_reason && (
                          <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                            📋 {call.disconnection_reason}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                        <div style={{ color: getStatusColor(call.call_status), fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {call.call_status.toUpperCase()}
                        </div>
                        {call.duration_ms && (
                          <div style={{ color: '#666' }}>
                            ⏱️ {formatDuration(call.duration_ms)}
                          </div>
                        )}
                        <div style={{ marginTop: '0.25rem' }}>
                          {call.has_analysis && <span title="Has Analysis">📊 </span>}
                          {call.has_recording && <span title="Has Recording">🎵 </span>}
                          {call.call_cost && (
                            <div style={{ color: '#666', fontSize: '0.7rem' }}>
                              💰 ${(call.call_cost / 100).toFixed(4)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};