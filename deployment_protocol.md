# Taskiee: Deployment & Infrastructure Protocol

This document outlines the professional deployment strategy for the **Taskiee** platform, ensuring scalability, security, and high availability.

---

## 🚀 Deployment Strategy

Taskiee follows a decoupled deployment architecture, separating the persistent data layer, the logic engine (Backend), and the user interface (Frontend).

### 1. Data Layer: MongoDB Atlas
For production, we transition from local MongoDB to **MongoDB Atlas** (Cloud).
- **Security**: IP Whitelisting and VPC Peering.
- **Availability**: Multi-region replication.
- **Connection**: `MONGODB_URI` must be updated in the production environment.

### 2. Logic Engine: Backend (Node.js/Express)
Recommended platforms: **Render**, **Railway**, or **AWS App Runner**.
- **Process Management**: Use `pm2` or Docker containers.
- **Environment**: 
  - `NODE_ENV=production`
  - `PORT=80` (or as required by the host)
- **CI/CD**: Automated deploys via GitHub Actions on `main` branch push.

### 3. User Interface: Frontend (Next.js)
Recommended platform: **Vercel** (Optimized for Next.js).
- **Build Command**: `next build`
- **Output**: Static Generation (SSG) where possible, SSR for dynamic dashboard data.
- **Environment Variables**: Must mirror `.env.local` but with production API endpoints.

---

## 📦 Containerization (Docker)

To ensure "it works on my machine" translates to production, we use Docker.

### `Dockerfile` (Backend/Frontend)
A multi-stage build is used to keep image sizes minimal.

```dockerfile
# Example for Backend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --production
CMD ["node", "dist/server.js"]
```

---

## 🛠️ Production Checklist

| Task | Status | Description |
| :--- | :--- | :--- |
| **SSL/TLS** | 🛡️ | All endpoints must use `https://`. |
| **CORS** | 🌐 | Restrict `Allowed Origins` to the production frontend URL. |
| **Secrets** | 🔑 | Use Managed Secret Stores (e.g., Vercel Env, AWS Secrets Manager). |
| **Monitoring** | 📊 | Integrate logging (Winston/Morgan) and uptime checks. |

---

> [!IMPORTANT]
> **Environment Uniformity**: Ensure `NEXT_PUBLIC_API_URL` on the frontend matches the deployed Backend URL exactly.

> [!CAUTION]
> **SRM WIFI Reminder**: Even in deployment planning, remember that local development environments should avoid **SRM WIFI** for database connectivity to prevent loading failures.
