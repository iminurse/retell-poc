from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import calls, webhooks

app = FastAPI(
    title="Retell POC API",
    description="FastAPI backend for Retell AI phone call integration",
    version="1.0.0"
)

# Configure CORS for both local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "https://*.vercel.app",  # Allow all Vercel subdomains
        "https://retell-poc-frontend.vercel.app"  # Your specific Vercel URL (update this)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(calls.router)
app.include_router(webhooks.router)

@app.get("/")
async def root():
    return {"message": "Retell POC API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}