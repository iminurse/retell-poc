import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    RETELL_API_KEY: str = os.getenv("RETELL_API_KEY", "")
    RETELL_FROM_NUMBER: str = os.getenv("RETELL_FROM_NUMBER", "")
    RETELL_AGENT_ID: str = os.getenv("RETELL_AGENT_ID", "")
    RETELL_BASE_URL: str = os.getenv("RETELL_BASE_URL", "https://api.retellai.com")
    RETELL_WEBHOOK_VERIFY_KEY: str = os.getenv("RETELL_WEBHOOK_VERIFY_KEY", "")

settings = Settings()