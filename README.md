# Retell POC

A monorepo project demonstrating Retell AI phone call integration with FastAPI backend and React frontend.

## 🚀 Deployment Options

### Option 1: Cloud Deployment (Recommended for Demos)
Deploy to cloud for public access - perfect for sharing with stakeholders:

**📖 [Cloud Deployment Guide](DEPLOYMENT_GUIDE.md)** - Deploy to Vercel + Render

### Option 2: Local Development
Set up locally for development and testing:

**📖 [Local Setup Guide](SETUP_GUIDE.md)** - Complete local installation guide

## Project Structure

```
retell-poc/
├── backend/          # FastAPI application
├── frontend/         # React + Vite + TypeScript
└── .kiro/           # Kiro configuration
```

## Quick Setup

### Option 1: Automated Setup
Run the setup script for your platform:

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

### Option 2: Manual Setup

#### Prerequisites
- Python 3.8+
- Node.js 16+
- ngrok (for webhook exposure)

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy environment file and configure:
```bash
cp .env.example .env
# Edit .env with your Retell credentials
```

5. Run the backend:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend:
```bash
npm run dev
```

#### Webhook Setup

1. Expose backend webhook endpoint using ngrok:
```bash
ngrok http 8000
```

2. Configure the webhook URL in Retell dashboard:
```
https://your-ngrok-url.ngrok.io/api/webhooks/retell
```

## Usage

1. Open http://localhost:5173 in your browser
2. Enter a phone number in E.164 format (e.g., +91XXXXXXXXXX)
3. Click "Call phone number"
4. Monitor call status and analysis in the Post Call section

## Environment Variables

See `backend/.env.example` for required environment variables.

## API Endpoints

### Backend (http://localhost:8000)
- `POST /api/calls` - Create outbound phone call
- `GET /api/calls/{call_id}` - Get call status and analysis  
- `POST /api/webhooks/retell` - Retell webhook receiver
- `GET /health` - Health check endpoint

### Frontend (http://localhost:5173)
- Single page application with call creation and analysis display

## Architecture

### Backend (FastAPI)
- **FastAPI**: Modern Python web framework with automatic API documentation
- **httpx**: Async HTTP client for Retell API calls
- **In-memory store**: Simple dictionary-based storage for demo purposes
- **Webhook verification**: HMAC signature verification for security
- **CORS enabled**: Allows frontend to communicate with backend during development

### Frontend (React + Vite + TypeScript)
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Polling mechanism**: Automatic status updates every 3 seconds
- **Responsive UI**: Clean, minimal interface focused on functionality

## Key Features

1. **Outbound Call Creation**: Uses Retell's Create Phone Call API with dynamic variables
2. **Real-time Status Updates**: Polls call status and displays updates
3. **Webhook Integration**: Receives and processes Retell webhook events
4. **Call Analysis Display**: Shows post-call analysis in formatted JSON
5. **Error Handling**: Comprehensive error handling and user feedback
6. **Security**: Webhook signature verification and input validation

## Development Notes

- The app uses in-memory storage for simplicity - in production, use a proper database
- Phone numbers are assumed to be Twilio-verified (no verification checks implemented)
- Minimal styling is used to focus on functionality over aesthetics
- The agent flow is pre-built in Retell dashboard using the conversation flow builder

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend is running on port 8000 and frontend on 5173
2. **Webhook not receiving events**: Check ngrok URL is correctly configured in Retell dashboard
3. **Call creation fails**: Verify Retell API credentials and agent ID in .env file
4. **Signature verification fails**: Ensure RETELL_WEBHOOK_VERIFY_KEY matches your Retell configuration

### Logs and Debugging

- Backend logs are visible in the terminal where uvicorn is running
- Frontend errors appear in browser developer console
- Check network tab for API request/response details