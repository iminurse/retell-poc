import { useState } from 'react';
import { CallForm } from './components/CallForm';
import { CallAnalysis } from './components/CallAnalysis';
import { CallHistory } from './components/CallHistory';

function App() {
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);

  const handleCallCreated = (callId: string) => {
    setCurrentCallId(callId);
  };

  const handleCallSelect = (callId: string) => {
    setCurrentCallId(callId);
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Retell AI Phone Call POC
      </h1>
      
      <CallForm onCallCreated={handleCallCreated} />
      
      <CallHistory 
        currentCallId={currentCallId} 
        onCallSelect={handleCallSelect} 
      />
      
      {currentCallId && (
        <CallAnalysis callId={currentCallId} />
      )}
    </div>
  );
}

export default App;