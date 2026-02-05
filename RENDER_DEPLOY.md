# Render Deployment Guide

## Prerequisites

- Render account (https://render.com)
- GitHub repository with this project
- Environment variables ready (see `.env.example`)

## Deployment Steps

### 1. Create a Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the web service:
   - **Name**: `sustainable-design-api` (or your choice)
   - **Runtime**: Python 3.11
   - **Build Command**: 
     ```bash
     cd backend && pip install -r requirements.txt && cd ../frontend && npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     cd backend && gunicorn --workers 4 --worker-class sync --bind 0.0.0.0:$PORT app:app
     ```

### 2. Configure Environment Variables

In Render service settings, add these environment variables:

**Required:**
- `DATABASE_URL` - Your PostgreSQL connection string (from Neon, etc.)
- `SECRET_KEY` - Generate a secure random string: `python -c "import secrets; print(secrets.token_hex(32))"`
- `FLASK_ENV` - Set to `production`

**OAuth (if using authentication):**
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GITHUB_CLIENT_ID` - From GitHub OAuth Apps
- `GITHUB_CLIENT_SECRET` - From GitHub OAuth Apps
- `MICROSOFT_CLIENT_ID` - From Azure Portal
- `MICROSOFT_CLIENT_SECRET` - From Azure Portal

### 3. Deploy Database (PostgreSQL)

#### Option A: Create on Render
1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Configure database (note the connection string)
3. Add the connection string as `DATABASE_URL` in your web service

#### Option B: Use Neon (Recommended)
1. Sign up at [Neon](https://neon.tech)
2. Create a new database
3. Copy the connection string
4. Add as `DATABASE_URL` environment variable in Render

### 4. Connect Database to Your App

Update `DATABASE_URL` in your web service environment:
```
postgresql://user:password@host:port/dbname?sslmode=require
```

### 5. Deploy

1. Push your code to GitHub
2. Render will automatically trigger a build
3. Monitor the deployment in the Render dashboard
4. Your app will be available at `https://your-service-name.onrender.com`

## Monitoring & Troubleshooting

### View Logs
```bash
# In Render Dashboard
Service → Logs (view build and runtime logs)
```

### Common Issues

**Issue**: Build fails with Python dependencies
- **Solution**: Ensure `backend/requirements.txt` has all dependencies

**Issue**: Frontend doesn't load
- **Solution**: Verify `npm run build` completes successfully, creates `frontend/dist/`

**Issue**: Database connection fails
- **Solution**: Check `DATABASE_URL` format and that it allows remote connections

**Issue**: CORS errors
- **Solution**: Update `CORS(app, origins=[...])` in `backend/app.py` with your deployed domain

### Health Check

Test your deployment:
```bash
curl https://your-service-name.onrender.com/api/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "Sustainable Design API",
  "ml_enabled": true,
  "timestamp": "2024-XX-XXT00:00:00.000Z"
}
```

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Database is running and accessible
- [ ] Health check endpoint returns 200 status
- [ ] Frontend loads at root URL
- [ ] API endpoints are accessible at `/api/*`
- [ ] OAuth credentials are configured (if using auth)
- [ ] SSL/HTTPS is enabled
- [ ] Custom domain is configured (optional)

## Scaling & Performance

### Worker Configuration
For higher traffic, adjust in `Procfile`:
```bash
web: cd backend && gunicorn --workers 8 --worker-class sync app:app
```

### Enable Caching
- Set up Redis cache service on Render
- Configure Flask caching in `backend/app.py`

## Local Testing Before Deployment

Test the exact deployment configuration locally:

```bash
# Build frontend
cd frontend
npm install
npm run build

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Run with gunicorn (simulates production)
PORT=5000 gunicorn --bind 0.0.0.0:5000 app:app
```

## Rollback

If something goes wrong:
1. In Render Dashboard, go to your service
2. Click "Deploys"
3. Select a previous successful deployment
4. Click "Redeploy"

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Flask Deployment Guide](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [Gunicorn Configuration](https://docs.gunicorn.org/en/stable/source/gunicorn.app.wsgiapp.html)
