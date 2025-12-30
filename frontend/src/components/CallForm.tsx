import { useState } from 'react';
import { retellApi } from '../api/retell';

interface CallFormProps {
  onCallCreated: (callId: string) => void;
}

export const CallForm: React.FC<CallFormProps> = ({ onCallCreated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    // Set default to current date
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    // Basic E.164 format validation
    if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      setError('Please enter a valid phone number in E.164 format (e.g., +91XXXXXXXXXX)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare dynamic variables (always include today's date)
      const dynamicVariables: Record<string, string> = {
        today_date: appointmentDate.trim() || new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
      
      // Add customer name if provided
      if (customerName.trim()) {
        dynamicVariables.name = customerName.trim();
      }

      const response = await retellApi.createCall({ 
        to_number: phoneNumber,
        dynamic_variables: dynamicVariables  // Always send dynamic variables
      });
      
      onCallCreated(response.call_id);
      setPhoneNumber('');
      setCustomerName('');
      // Keep today's date as default, don't clear it
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create call');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>📞 Make Call</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              📱 Phone Number (E.164 format) *
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91XXXXXXXXXX"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              disabled={isLoading}
              required
            />
            <small style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic', display: 'block', marginTop: '0.5rem' }}>
              Required field for making the call
            </small>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <label htmlFor="customerName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              👤 Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="John Smith"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              disabled={isLoading}
            />
            <small style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic', display: 'block', marginTop: '0.5rem' }}>
              Agent will use: "Hello {'{{name}}'}"
            </small>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <label htmlFor="appointmentDate" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              📅 Today's Date
            </label>
            <input
              id="appointmentDate"
              type="text"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              placeholder="December 30, 2024"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              disabled={isLoading}
            />
            <small style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic', display: 'block', marginTop: '0.5rem' }}>
              Helps agent understand current date context
            </small>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '📞 Creating Call...' : '📞 Call phone number'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', color: 'red', fontSize: '0.9rem' }}>
          ❌ Error: {error}
        </div>
      )}
    </div>
  );
};