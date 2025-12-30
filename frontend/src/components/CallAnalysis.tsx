import React, { useState, useEffect } from 'react';
import { retellApi } from '../api/retell';
import { CallStatus } from '../types/call';

interface CallAnalysisProps {
  callId: string;
}

export const CallAnalysis: React.FC<CallAnalysisProps> = ({ callId }) => {
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    let intervalId: number;

    const pollCallStatus = async () => {
      try {
        const status = await retellApi.getCallStatus(callId);
        setCallStatus(status);
        setError(null);

        // Stop polling if call is ended and analysis is available
        if (status.call_status === 'ended' && status.call_analysis) {
          setIsPolling(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get call status');
      }
    };

    // Initial fetch
    pollCallStatus();

    // Set up polling if still needed
    if (isPolling) {
      intervalId = window.setInterval(pollCallStatus, 3000); // Poll every 3 seconds
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [callId, isPolling]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return '#ffa500';
      case 'registered': return '#17a2b8';
      case 'ongoing': return '#007bff';
      case 'ended': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusMessage = (status: string, hasAnalysis: boolean) => {
    switch (status) {
      case 'created': 
        return '📞 Call created, initiating...';
      case 'registered':
        return '🔄 Call registered, connecting...';
      case 'ongoing':
        return '📱 Call in progress...';
      case 'ended':
        return hasAnalysis ? '✅ Call completed with analysis' : '⏳ Call ended, generating analysis...';
      default:
        return `Status: ${status}`;
    }
  };

  const getMetricExplanation = (key: string) => {
    const explanations: Record<string, string> = {
      'e2e': 'End-to-End: Total response time from user speech to agent audio output',
      'asr': 'Automatic Speech Recognition: Time to convert speech to text',
      'llm': 'Large Language Model: Time for AI to process and generate responses',
      'llm_websocket_network_rtt': 'LLM Network RTT: Round-trip time for LLM API calls',
      'tts': 'Text-to-Speech: Time to convert AI response text to audio',
      'knowledge_base': 'Knowledge Base: Time to retrieve relevant information from knowledge sources',
      's2s': 'Speech-to-Speech: Direct speech processing without intermediate text conversion'
    };
    return explanations[key] || '';
  };

  const formatDuration = (durationMs?: number) => {
    if (!durationMs) return 'N/A';
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp?: number) => {
    // Handle various timestamp formats and edge cases
    if (!timestamp || timestamp === 0) return 'N/A';
    
    // Handle both milliseconds and seconds timestamps
    const date = timestamp > 1000000000000 ? new Date(timestamp) : new Date(timestamp * 1000);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleString();
  };

  const formatCost = (cost?: number) => {
    if (cost === undefined || cost === null) return 'N/A';
    return `$${(cost / 100).toFixed(4)}`;
  };

  const tabStyle = (tabName: string) => ({
    padding: '0.5rem 1rem',
    backgroundColor: activeTab === tabName ? '#007bff' : '#f8f9fa',
    color: activeTab === tabName ? 'white' : '#333',
    border: '1px solid #dee2e6',
    cursor: 'pointer',
    borderRadius: '4px 4px 0 0',
    marginRight: '2px'
  });

  const renderOverview = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Call Information</h4>
          <p><strong>Status:</strong> <span style={{ color: getStatusColor(callStatus!.call_status) }}>{callStatus!.call_status}</span></p>
          <p><strong>Agent:</strong> {callStatus!.agent_name || 'N/A'}</p>
          <p><strong>Duration:</strong> {formatDuration(callStatus!.duration_ms)}</p>
          <p><strong>Disconnection:</strong> {callStatus!.disconnection_reason || 'N/A'}</p>
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Timestamps</h4>
          <p><strong>Started:</strong> {formatTimestamp(callStatus!.start_timestamp) !== 'N/A' 
            ? formatTimestamp(callStatus!.start_timestamp) 
            : (callStatus!.created_at ? new Date(callStatus!.created_at).toLocaleString() : 'N/A')}</p>
          <p><strong>Ended:</strong> {formatTimestamp(callStatus!.end_timestamp) !== 'N/A' 
            ? formatTimestamp(callStatus!.end_timestamp) 
            : (callStatus!.ended_at ? new Date(callStatus!.ended_at).toLocaleString() : 'N/A')}</p>
        </div>

        {callStatus!.call_cost && (
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Cost Analysis</h4>
            <p><strong>Total Cost:</strong> {formatCost(callStatus!.call_cost.combined_cost)}</p>
            <p><strong>Duration:</strong> {callStatus!.call_cost.total_duration_seconds}s</p>
            <p><strong>Rate:</strong> {formatCost(callStatus!.call_cost.total_duration_unit_price)}/s</p>
          </div>
        )}
      </div>

      {callStatus!.call_analysis && (
        <div style={{ padding: '1rem', backgroundColor: '#e8f5e8', borderRadius: '8px', marginBottom: '1rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#155724' }}>AI Analysis</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Call Successful:</strong> {callStatus!.call_analysis.call_successful ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>User Sentiment:</strong> {callStatus!.call_analysis.user_sentiment || 'N/A'}
            </div>
            <div>
              <strong>Voicemail:</strong> {callStatus!.call_analysis.in_voicemail ? '📧 Yes' : '📞 No'}
            </div>
          </div>
          {callStatus!.call_analysis.call_summary && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Summary:</strong>
              <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>{callStatus!.call_analysis.call_summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTranscript = () => (
    <div>
      {callStatus!.transcript_object && callStatus!.transcript_object.length > 0 ? (
        <div>
          <h4>Structured Transcript</h4>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
            {callStatus!.transcript_object.map((entry: any, index) => (
              <div key={index} style={{
                padding: '0.75rem',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: entry.role === 'agent' ? '#f8f9fa' : entry.role === 'user' ? '#fff' : '#fff3cd'
              }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: entry.role === 'agent' ? '#007bff' : entry.role === 'user' ? '#28a745' : '#856404', 
                  marginBottom: '0.25rem' 
                }}>
                  {entry.role === 'agent' && '🤖 Agent'}
                  {entry.role === 'user' && '👤 User'}
                  {entry.role === 'tool_call_invocation' && '🔧 Tool Call'}
                  {entry.role === 'tool_call_result' && '📋 Tool Result'}
                  {!['agent', 'user', 'tool_call_invocation', 'tool_call_result'].includes(entry.role) && `📝 ${entry.role}`}
                </div>
                
                {entry.content && <div>{entry.content}</div>}
                
                {entry.tool_name && (
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <strong>Tool:</strong> {entry.tool_name}
                  </div>
                )}
                
                {entry.arguments && (
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    <strong>Arguments:</strong> {JSON.stringify(entry.arguments)}
                  </div>
                )}
                
                {entry.result && (
                  <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    <strong>Result:</strong> {entry.result}
                  </div>
                )}
                
                {entry.time_sec && (
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    Time: {entry.time_sec.toFixed(1)}s
                  </div>
                )}
                
                {entry.words && entry.words.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    Timing: {entry.words[0].start.toFixed(1)}s - {entry.words[entry.words.length - 1].end.toFixed(1)}s
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : callStatus!.transcript ? (
        <div>
          <h4>Basic Transcript</h4>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            maxHeight: '400px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {callStatus!.transcript}
          </div>
        </div>
      ) : (
        <p>No transcript available yet.</p>
      )}
    </div>
  );

  const renderPerformance = () => (
    <div>
      {callStatus!.latency && (
        <div style={{ marginBottom: '2rem' }}>
          <h4>Latency Metrics (ms)</h4>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
            Performance measurements showing how quickly different components respond during the call
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {Object.entries(callStatus!.latency).map(([key, metrics]: [string, any]) => (
              metrics && typeof metrics === 'object' && (
                <div key={key} style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <h5 style={{ margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>{key.replace('_', ' ')}</h5>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: '0 0 0.75rem 0', fontStyle: 'italic' }}>
                    {getMetricExplanation(key)}
                  </p>
                  {metrics.p50 !== undefined && <p><strong>P50:</strong> {Math.round(metrics.p50)}ms</p>}
                  {metrics.p90 !== undefined && <p><strong>P90:</strong> {Math.round(metrics.p90)}ms</p>}
                  {metrics.p95 !== undefined && <p><strong>P95:</strong> {Math.round(metrics.p95)}ms</p>}
                  {metrics.max !== undefined && <p><strong>Max:</strong> {Math.round(metrics.max)}ms</p>}
                  {metrics.num !== undefined && <p><strong>Count:</strong> {metrics.num}</p>}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {callStatus!.llm_token_usage && (
        <div style={{ marginBottom: '2rem' }}>
          <h4>LLM Token Usage</h4>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
            Measures how much AI processing was required - tokens represent pieces of text the AI analyzed and generated
          </p>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            {callStatus!.llm_token_usage.average !== undefined && (
              <p><strong>Average Tokens:</strong> {Math.round(callStatus!.llm_token_usage.average)}</p>
            )}
            {callStatus!.llm_token_usage.num_requests !== undefined && (
              <p><strong>Total Requests:</strong> {callStatus!.llm_token_usage.num_requests}</p>
            )}
            {callStatus!.llm_token_usage.values && (
              <p><strong>Total Tokens:</strong> {callStatus!.llm_token_usage.values.reduce((a: number, b: number) => a + b, 0)}</p>
            )}
          </div>
        </div>
      )}

      {callStatus!.call_cost && callStatus!.call_cost.product_costs && (
        <div>
          <h4>Cost Breakdown</h4>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
            Detailed costs for each service used during the call (TTS, LLM processing, telephony, etc.)
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Service</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Cost</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {callStatus!.call_cost.product_costs.map((cost: any, index: number) => (
                  <tr key={index}>
                    <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>{cost.product}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatCost(cost.cost)}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatCost(cost.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderMedia = () => (
    <div>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
        Audio recordings, execution logs, and knowledge base content retrieved during the call
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {callStatus!.recording_url && (
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h5>🎵 Call Recording</h5>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0.5rem 0' }}>
              Standard mono audio recording of the entire conversation
            </p>
            <audio controls style={{ width: '100%', marginTop: '0.5rem' }}>
              <source src={callStatus!.recording_url} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <a href={callStatus!.recording_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem' }}>
              Download Recording
            </a>
          </div>
        )}

        {callStatus!.recording_multi_channel_url && (
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h5>🎵 Multi-Channel Recording</h5>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0.5rem 0' }}>
              Stereo recording with agent and user on separate channels for advanced analysis
            </p>
            <audio controls style={{ width: '100%', marginTop: '0.5rem' }}>
              <source src={callStatus!.recording_multi_channel_url} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <a href={callStatus!.recording_multi_channel_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem' }}>
              Download Multi-Channel
            </a>
          </div>
        )}

        {callStatus!.public_log_url && (
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h5>📋 Public Logs</h5>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0.5rem 0' }}>
              Detailed execution logs showing call flow, API calls, and system events
            </p>
            <a href={callStatus!.public_log_url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
              View Call Logs
            </a>
          </div>
        )}

        {callStatus!.knowledge_base_retrieved_contents_url && (
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h5>🧠 Knowledge Base Content</h5>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0.5rem 0' }}>
              Information retrieved from knowledge sources to answer user questions
            </p>
            <a href={callStatus!.knowledge_base_retrieved_contents_url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
              View Retrieved Content
            </a>
          </div>
        )}
      </div>
    </div>
  );

  const renderRawData = () => (
    <div>
      <h4>Raw Call Data</h4>
      <pre style={{
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '4px',
        fontSize: '0.8rem',
        overflow: 'auto',
        maxHeight: '500px'
      }}>
        {JSON.stringify(callStatus, null, 2)}
      </pre>
    </div>
  );

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>📊 Post Call Analysis</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>Call ID:</strong> {callId}
      </div>

      {error && (
        <div style={{ marginBottom: '1rem', color: 'red', fontSize: '0.9rem' }}>
          Error: {error}
        </div>
      )}

      {callStatus && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              color: getStatusColor(callStatus.call_status),
              fontWeight: 'bold',
              fontSize: '1.1rem',
              marginBottom: '0.5rem'
            }}>
              {getStatusMessage(callStatus.call_status, !!callStatus.call_analysis)}
            </div>
            {isPolling && (
              <div style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
                🔄 Checking for updates every 3 seconds...
                {callStatus.call_status === 'ended' && !callStatus.call_analysis && (
                  <span style={{ display: 'block', marginTop: '0.25rem' }}>
                    ⏱️ Analysis typically takes 30-60 seconds after call completion
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div style={{ marginBottom: '1rem', borderBottom: '1px solid #dee2e6' }}>
            <div style={{ display: 'flex' }}>
              <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>
                📋 Overview
              </button>
              <button style={tabStyle('transcript')} onClick={() => setActiveTab('transcript')}>
                💬 Transcript
              </button>
              <button style={tabStyle('performance')} onClick={() => setActiveTab('performance')}>
                ⚡ Performance
              </button>
              <button style={tabStyle('media')} onClick={() => setActiveTab('media')}>
                🎵 Media & Logs
              </button>
              <button style={tabStyle('raw')} onClick={() => setActiveTab('raw')}>
                🔧 Raw Data
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: '300px' }}>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'transcript' && renderTranscript()}
            {activeTab === 'performance' && renderPerformance()}
            {activeTab === 'media' && renderMedia()}
            {activeTab === 'raw' && renderRawData()}
          </div>
        </>
      )}
    </div>
  );
};