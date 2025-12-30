from typing import Dict, Any, Optional
from datetime import datetime

class CallStore:
    def __init__(self):
        self._calls: Dict[str, Dict[str, Any]] = {}
    
    def update_call(self, call_id: str, data: Dict[str, Any]) -> None:
        """Update call data in memory store"""
        if call_id not in self._calls:
            self._calls[call_id] = {}
        
        self._calls[call_id].update(data)
        self._calls[call_id]["updated_at"] = datetime.utcnow()
    
    def get_call(self, call_id: str) -> Optional[Dict[str, Any]]:
        """Get call data from memory store"""
        return self._calls.get(call_id)
    
    def set_call_analysis(self, call_id: str, analysis: Dict[str, Any]) -> None:
        """Set call analysis data"""
        if call_id not in self._calls:
            self._calls[call_id] = {}
        
        self._calls[call_id]["call_analysis"] = analysis
        self._calls[call_id]["updated_at"] = datetime.utcnow()
    
    def set_call_status(self, call_id: str, status: str) -> None:
        """Set call status"""
        if call_id not in self._calls:
            self._calls[call_id] = {}
        
        self._calls[call_id]["call_status"] = status
        self._calls[call_id]["updated_at"] = datetime.utcnow()

# Global store instance
call_store = CallStore()