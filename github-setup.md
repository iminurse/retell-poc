# GitHub Setup Commands

After creating your repository on GitHub, run these commands:

## 1. Add GitHub as remote origin
```bash
git remote add origin https://github.com/YOUR_USERNAME/retell-poc.git
```

## 2. Push your code to GitHub
```bash
git branch -M main
git push -u origin main
```

## 3. Verify upload
Visit: https://github.com/YOUR_USERNAME/retell-poc

---

## Next Steps After GitHub Upload:

### Deploy Backend to Render:
1. Go to [render.com](https://render.com)
2. Sign up/login and connect GitHub
3. Create "Web Service"
4. Select your `retell-poc` repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Deploy Frontend to Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login and connect GitHub
3. Import your `retell-poc` repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

---

## Environment Variables:

### Render (Backend):
```
RETELL_API_KEY=your_api_key_here
RETELL_FROM_NUMBER=+1234567890
RETELL_AGENT_ID=your_agent_id_here
RETELL_BASE_URL=https://api.retellai.com
RETELL_WEBHOOK_VERIFY_KEY=your_api_key_here
TODAY_DATE=19 December 2025
```

### Vercel (Frontend):
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

Replace `YOUR_USERNAME` with your actual GitHub username!