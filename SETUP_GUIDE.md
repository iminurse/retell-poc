# 🚀 Retell POC - Complete Setup Guide

This guide will help you set up the Retell AI Phone Call POC from scratch on any machine.

## 📋 Prerequisites

### Required Software:
1. **Python 3.8+** - [Download here](https://www.python.org/downloads/)
2. **Node.js 16+** - [Download here](https://nodejs.org/download/)
3. **Git** - [Download here](https://git-scm.com/downloads)

### Required Accounts/Credentials:
1. **Retell AI Account** - [Sign up here](https://retellai.com)
2. **Retell API Key** - Get from Retell dashboard
3. **Retell Agent ID** - Create an agent in Retell dashboard
4. **Retell Phone Number** - Purchase/configure in Retell dashboard

---

## 🛠️ Step-by-Step Setup

### Step 1: Download the Project

**Option A: If you have the project folder**
```bash
# Copy the entire retell-poc folder to your machine
# No additional download needed
```

**Option B: If using Git (if project is in repository)**
```bash
git clone <repository-url>
cd retell-poc
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd retell-poc/backend
   ```

2. **Create Python virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env file with your credentials
   ```

5. **Edit the .env file:**
   Open `.env` in any text editor and replace with your actual values:
   ```
   RETELL_API_KEY=your_actual_api_key_here
   RETELL_FROM_NUMBER=+1234567890
   RETELL_AGENT_ID=your_actual_agent_id_here
   RETELL_BASE_URL=https://api.retellai.com
   RETELL_WEBHOOK_VERIFY_KEY=your_actual_api_key_here
   TODAY_DATE=19 December 2025
   ```

6. **Test the backend configuration:**
   ```bash
   python test_config.py
   ```
   You should see: ✅ Successfully connected to Retell API

7. **Start the backend server:**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   Keep this terminal open. Backend runs on: http://localhost:8000

### Step 3: Frontend Setup

**Open a NEW terminal/command prompt:**

1. **Navigate to frontend directory:**
   ```bash
   cd retell-poc/frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend server:**
   ```bash
   npm run dev
   ```
   Keep this terminal open. Frontend runs on: http://localhost:5173

### Step 4: Verify Everything Works

1. **Open your browser:** Go to http://localhost:5173

2. **Test call history:** Click "🔄 Refresh" - should load your Retell calls

3. **Test creating a call:** 
   - Enter phone number: `+919840626580` (test number)
   - Click "Call phone number"
   - Should see call ID appear

4. **Test call analysis:** Select any call from history to see detailed analysis

---

## 🔧 Troubleshooting

### Common Issues:

#### "No calls found" or API errors:
- ✅ Check your `.env` file has correct API key
- ✅ Verify API key is active in Retell dashboard
- ✅ Run `python test_config.py` to verify connection

#### "Failed to create call":
- ✅ Check phone number format (must be E.164: +1234567890)
- ✅ Verify agent ID exists in your Retell account
- ✅ Check if from_number is configured in Retell

#### Frontend can't connect to backend:
- ✅ Ensure backend is running on port 8000
- ✅ Check if Windows Firewall is blocking the port
- ✅ Try accessing http://localhost:8000/health directly

#### Python/Node.js not found:
- ✅ Restart terminal after installing Python/Node.js
- ✅ Add Python/Node.js to system PATH
- ✅ Use `python3` instead of `python` on Mac/Linux

### Port Issues:
If ports 8000 or 5173 are busy:

**Backend (change port 8000):**
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```
Then update frontend `src/api/retell.ts` line 4:
```typescript
const API_BASE_URL = 'http://localhost:8001';
```

**Frontend (change port 5173):**
```bash
npm run dev -- --port 3000
```

---

## 📱 Getting Your Retell Credentials

### 1. Retell API Key:
1. Go to [Retell Dashboard](https://beta.retellai.com)
2. Navigate to "API Keys" section
3. Copy your API key (starts with `key_`)

### 2. Agent ID:
1. In Retell Dashboard, go to "Agents"
2. Create a new agent or use existing one
3. Copy the Agent ID (starts with `agent_`)

### 3. Phone Number:
1. In Retell Dashboard, go to "Phone Numbers"
2. Purchase a number or import existing Twilio number
3. Use the number in E.164 format (+1234567890)

---

## 🎯 Final Checklist

Before demo, verify:
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Call history loads (shows your Retell calls)
- [ ] Can create new calls
- [ ] Can view call analysis
- [ ] All performance metrics display correctly

---

## 🆘 Need Help?

### Quick Tests:
```bash
# Test backend health
curl http://localhost:8000/health

# Test API connection
cd backend
python test_config.py

# Test call listing
python test_list_calls.py
```

### Log Files:
- Backend logs appear in the terminal where uvicorn is running
- Frontend errors appear in browser developer console (F12)

---

## 📦 What's Included

This POC includes:
- ✅ **Call Management**: Create and view all Retell calls
- ✅ **Real-time Updates**: Live call status polling
- ✅ **Rich Analytics**: Performance metrics, costs, sentiment analysis
- ✅ **Audio Playback**: Direct access to call recordings
- ✅ **Tool Call Visualization**: See AI tool usage in conversations
- ✅ **Comprehensive UI**: Professional interface with explanations

---

**🎉 You're all set!** The app should now work exactly like the original demo.

**Estimated Setup Time:** 15-20 minutes for first-time setup