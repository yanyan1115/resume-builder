# Setup Guide

This guide explains how to run the current MVP locally. The project has a Vue frontend and an Express/MongoDB backend.

## Requirements

- Node.js 18 or newer is recommended.
- npm.
- MongoDB, either local or remote.

## 1. Clone And Install Frontend Dependencies

From the repository root:

```bash
npm install
```

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Return to the repository root when needed:

```bash
cd ..
```

## 3. Configure Backend Environment

Create a backend environment file from the example:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Fill in:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/resume-builder
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
PUBLIC_BASE_URL=http://localhost:5000
```

Do not commit `backend/.env`.

## 4. Run MongoDB

If using a local MongoDB installation, make sure the MongoDB service is running. If using MongoDB Atlas or another hosted database, use its connection string as `MONGO_URI`.

## 5. Run The Backend

```bash
cd backend
npm start
```

Expected backend URL:

```text
http://localhost:5000
```

## 6. Run The Frontend

In another terminal from the repository root:

```bash
npm run serve
```

The Vue dev server usually opens at:

```text
http://localhost:8080
```

## 7. Build And Lint

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Known Setup Gaps

- The frontend API base URL defaults to `http://localhost:5000/api`. Override it with `VUE_APP_API_BASE_URL` when needed.
- A backend development script with auto-reload is still not configured.
- Local mobile experiments are not required for the web app MVP and are not included in this beta release.
