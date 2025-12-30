import { useState } from 'react';
import { retellApi } from '../api/retell';

interface CallFormProps {
  onCallCreated: (callId: string) => void;
}

export const CallForm: React.FC<CallFormProps> = ({ onCallCreated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
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
      // Prepare dynamic variables (only include non-empty values)
      const dynamicVariables: Record<string, string> = {};
      if (customerName.trim()) {
        dynamicVariables.customer_name = customerName.trim();
      }
      if (appointmentDate.trim()) {
        dynamicVariables.appointment_date = appointmentDate.trim();
      }

      const response = await retellApi.createCall({ 
        to_number: phoneNumber,
        dynamic_variables: Object.keys(dynamicVariables).length > 0 ? dynamicVariables : undefined
      });
      
      onCallCreated(response.call_id);
      setPhoneNumber('');
      setCustomerName('');
      setAppointmentDate('');
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
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
                fontSize: '1rem'
              }}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="customerName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              👤 Customer Name (Optional)
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
                fontSize: '1rem'
              }}
              disabled={isLoading}
            />
            <small style={{ color: '#666', fontSize: '0.8rem' }}>
              Agent will use: "Hello {'{{customer_name}}'}"
            </small>
          </div>

          <div>
            <label htmlFor="appointmentDate" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              📅 Appointment Date (Optional)
            </label>
            <input
              id="appointmentDate"
              type="text"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              placeholder="Monday 2pm"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              disabled={isLoading}
            />
            <small style={{ color: '#666', fontSize: '0.8rem' }}>
              Agent will use: "Your appointment on {'{{appointment_date}}'}"
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