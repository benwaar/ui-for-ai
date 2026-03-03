# Deployment Guide

## Architecture

```
Frontend: GitHub Pages (https://benwaar.github.io/ui-for-ai/)
Backend: Render (https://ui-for-ai-backend.onrender.com)
Cost: $0 (both free tiers)
```

## Phase 1: Current Deployment

### Frontend (GitHub Pages)

**Automatic deployment via GitHub Actions:**
- Push to `main` branch triggers `.github/workflows/deploy.yml`
- Builds Angular app with base href `/ui-for-ai/`
- Deploys to GitHub Pages
- Available at: https://benwaar.github.io/ui-for-ai/

**Manual Setup Required:**
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Save

### Backend (Render)

**Setup Steps:**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect to GitHub repository: `benwaar/ui-for-ai`
4. Configure:
   - **Name:** `ui-for-ai-backend`
   - **Root Directory:** `backend`
   - **Environment:** Python 3
   - **Build Command:** (auto-detected from render.yaml)
   - **Start Command:** (auto-detected from render.yaml)
5. Click "Create Web Service"

**Auto-deploy:**
- Every push to `main` triggers automatic redeployment
- Health check: `https://ui-for-ai-backend.onrender.com/api/health`

## Phase 2: Future RAG Backend (Not Yet Deployed)

When Phase 2 is ready:

```
Frontend: GitHub Pages (reuse)
Backend: Render free tier (reuse)
Database: Neon free tier (Postgres + pgvector)
LLM: Users run Ollama locally
Cost: $0
```

### Neon Setup (Future):
1. Sign up at [neon.tech](https://neon.tech)
2. Create project with Postgres + pgvector
3. Add connection string to Render environment variables
4. Update backend code to connect to Neon

## Environment Configuration

### Development (Local)
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:5000`
- Uses: `frontend/src/environments/environment.ts`

### Production
- Frontend: `https://benwaar.github.io/ui-for-ai/`
- Backend: `https://ui-for-ai-backend.onrender.com`
- Uses: `frontend/src/environments/environment.prod.ts`

## Testing Deployments

### Frontend
```bash
# Local build test
cd frontend
npm run build -- --base-href=/ui-for-ai/
# Check dist/frontend/browser/ output
```

### Backend
```bash
# Local test
cd backend
python app.py
# Visit http://localhost:5000/api/health
```

## Troubleshooting

### Frontend Issues
- **404 on routes:** Ensure GitHub Pages is set to "GitHub Actions" source
- **Assets not loading:** Check base href in angular.json and deploy.yml
- **API errors:** Verify backend URL in environment.prod.ts

### Backend Issues
- **Build fails:** Check Python version and requirements.txt
- **Health check fails:** Verify /api/health endpoint returns 200
- **CORS errors:** Ensure CORS is configured in Flask app

## Monitoring

### GitHub Pages
- Check Actions tab for build status
- Deployment status: Settings → Pages

### Render
- Dashboard shows deploy status and logs
- Health checks run automatically
- Free tier: Service may spin down after inactivity (takes ~30s to wake)

## Costs

**Phase 1:**
- GitHub Pages: Free forever
- Render: Free tier (750 hrs/month, spins down after 15min inactivity)
- **Total: $0/month**

**Phase 2 (Future):**
- Neon: Free tier (3GB storage, 300 compute hours)
- **Total: Still $0/month**
