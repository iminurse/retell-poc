# 🚀 Cloud Deployment Guide - Vercel + Render

This guide will help you deploy the Retell POC to the cloud for easy demo access.

## 📋 Overview

- **Backend**: Deploy to Render (free tier available)
- **Frontend**: Deploy to Vercel (free tier available)
- **Result**: Public URLs accessible from anywhere

---

## 🔧 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account (recommended)

### 1.2 Deploy Backend
1. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your repository or upload the `backend` folder
   - Choose "Python" as environment

2. **Configure Service**:
   - **Name**: `retell-poc-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your branch)
   - **Root Directory**: `retell-poc/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables**:
   ```
   RETELL_API_KEY=your_actual_api_key_here
   RETELL_FROM_NUMBER=+1234567890
   RETELL_AGENT_ID=your_actual_agent_id_here
   RETELL_BASE_URL=https://api.retellai.com
   RETELL_WEBHOOK_VERIFY_KEY=your_actual_api_key_here
   TODAY_DATE=19 December 2025
   ```

4. **Deploy**: Click "Create Web Service"

5. **Get Backend URL**: After deployment, copy the URL (e.g., `https://retell-poc-backend.onrender.com`)

### 1.3 Test Backend
Visit `https://your-backend-url.onrender.com/health` - should return `{"status": "healthy"}`

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account

### 2.2 Prepare Frontend
1. **Create environment file**:
   ```bash
   cd retell-poc/frontend
   cp .env.example .env
   ```

2. **Update .env with your backend URL**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

### 2.3 Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Click "New Project"
2. Import your repository
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `retell-poc/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Add Environment Variable**:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.onrender.com`
5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
cd retell-poc/frontend
npm install -g vercel
vercel --prod
```

### 2.4 Get Frontend URL
After deployment, Vercel will provide a URL like: `https://retell-poc-frontend.vercel.app`

---

## 🔄 Step 3: Update CORS Configuration

### 3.1 Update Backend CORS
1. Go to your Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Add/update the frontend URL in your backend's CORS settings

Or manually update `retell-poc/backend/app/main.py`:
```python
allow_origins=[
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://your-frontend-url.vercel.app",  # Add your actual Vercel URL
    "https://*.vercel.app"
],
```

### 3.2 Redeploy Backend
After updating CORS, redeploy your backend service on Render.

---

## 🎯 Step 4: Test Complete Setup

1. **Visit your frontend URL**: `https://your-frontend-url.vercel.app`
2. **Test call history**: Click "🔄 Refresh" - should load your Retell calls
3. **Test creating a call**: Use test number `+919840626580`
4. **Verify analysis**: Select any call to see detailed analysis

---

## 📱 Step 5: Configure Retell Webhooks (Optional)

If you want real-time webhook updates:

1. **In Retell Dashboard**:
   - Go to "Webhooks" section
   - Add webhook URL: `https://your-backend-url.onrender.com/api/webhooks/retell`
   - Select events: `call_started`, `call_ended`, `call_analyzed`

---

## 🔧 Troubleshooting

### Backend Issues:
- **Build fails**: Check `requirements.txt` is in backend folder
- **Environment variables**: Ensure all required vars are set in Render
- **Health check fails**: Check logs in Render dashboard

### Frontend Issues:
- **API calls fail**: Verify `VITE_API_BASE_URL` is correct
- **CORS errors**: Update backend CORS configuration
- **Build fails**: Ensure `package.json` is in frontend folder

### Common Solutions:
```bash
# Check backend health
curl https://your-backend-url.onrender.com/health

# Check frontend environment
console.log(import.meta.env.VITE_API_BASE_URL)
```

---

## 💰 Cost Estimate

**Free Tier Limits**:
- **Render**: 750 hours/month (enough for demos)
- **Vercel**: Unlimited for personal projects
- **Total Cost**: $0 for demo purposes

**Note**: Render free tier may sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

---

## 🎉 Final URLs

After successful deployment:
- **Frontend (Demo URL)**: `https://your-frontend-url.vercel.app`
- **Backend API**: `https://your-backend-url.onrender.com`

**Share the frontend URL with your manager for the demo!**

---

## 🔄 Making Updates

### Update Backend:
1. Push changes to your repository
2. Render auto-deploys from connected branch

### Update Frontend:
1. Push changes to your repository  
2. Vercel auto-deploys from connected branch

### Update Environment Variables:
- **Render**: Dashboard → Service → Environment
- **Vercel**: Dashboard → Project → Settings → Environment Variables

---

**🎯 Estimated Deployment Time**: 15-20 minutes total
**🌐 Result**: Public demo URL accessible from anywhere!