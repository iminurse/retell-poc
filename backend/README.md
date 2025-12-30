# Retell POC Backend

FastAPI backend for Retell AI phone call integration.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Retell credentials
```

4. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `POST /api/calls` - Create outbound phone call
- `GET /api/calls/{call_id}` - Get call status and analysis
- `POST /api/webhooks/retell` - Retell webhook receiver

## Environment Variables

See `.env.example` for required configuration.