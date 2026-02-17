# TaskFlow - Deployment and Polish

## About This Directory

The deployment configuration for TaskFlow lives in the **lab** directory for this session:

```
week-4/session-11-deployment-and-polish/lab/
```

This is because the lab directory **IS** the TaskFlow deployment configuration. The Dockerfiles, docker-compose.yml, nginx.conf, and comprehensive README all describe how to deploy the TaskFlow application you have been building throughout the course.

## Files to Review

| File | Purpose |
|------|---------|
| `../lab/backend/Dockerfile` | Builds the Express backend into a Docker image |
| `../lab/backend/.dockerignore` | Excludes unnecessary files from the Docker build |
| `../lab/backend/railway.toml` | Configuration for deploying to Railway |
| `../lab/frontend/Dockerfile` | Multi-stage build for the React frontend |
| `../lab/frontend/nginx.conf` | Nginx config for SPA routing and caching |
| `../lab/docker-compose.yml` | Orchestrates all three services (DB, backend, frontend) |
| `../lab/README.md` | Comprehensive setup, deployment, and API documentation |

## Deployment Checklist

Before deploying your TaskFlow project:

- [ ] All environment variables are configured (not hardcoded!)
- [ ] `.env` files are listed in `.gitignore` and `.dockerignore`
- [ ] Database migrations are ready (`npx prisma migrate deploy`)
- [ ] Backend health check endpoint works (`GET /api/health`)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Docker Compose starts all services (`docker compose up --build`)
- [ ] All tests pass (`npm test`)
- [ ] README.md has complete setup instructions
- [ ] No secrets committed to Git (check with `git log --all -p | grep -i "password\|secret\|key"`)

## Quick Deploy Commands

```bash
# Build and run everything with Docker Compose
docker compose up --build -d

# Run database migrations
docker compose exec backend npx prisma migrate deploy

# Check logs
docker compose logs -f backend

# Stop everything
docker compose down
```
