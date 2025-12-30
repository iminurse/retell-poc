#!/bin/bash

echo "Setting up Retell POC project..."

# Backend setup
echo "Setting up backend..."
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Linux/Mac)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install Python dependencies
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please edit it with your Retell credentials."
fi

cd ..

# Frontend setup
echo "Setting up frontend..."
cd frontend

# Install Node.js dependencies
npm install

cd ..

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your Retell credentials"
echo "2. Start the backend: cd backend && uvicorn app.main:app --reload"
echo "3. Start the frontend: cd frontend && npm run dev"
echo "4. Expose webhook with ngrok: ngrok http 8000"