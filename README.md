# Augustin Garden | Premium Flowers & Curated Vases Kigali

A high-performance, responsive, luxury-tier botanical showcase and flower/vase e-commerce catalog tailored for Kigali, Rwanda. This elegant application features a robust administration dashboard to manage products, categories, services, sliding hero panels, and general contact or profile settings.

## 🏛️ Architecture Overview

The application is built using a **unified full-stack architecture** consisting of:
- **Frontend**: React 19, TypeScript, and Tailwind CSS (v4) with Motion (framer-motion) for high-end cinematic transitions. Icons are sourced from Lucide-React.
- **Backend**: Node.js and Express server which serves both the REST API endpoints and acts as a production static server for the built frontend bundle.
- **Database/Persistence**: Single-file JSON database (`/data/db.json`) enabling simple, highly reliable file-system storage with fast operations and simple hosting overhead.

---

## 🛠️ Tech Stack & Key Libraries

- **Vite (v6)**: High-speed bundling, local HMR dev server.
- **TypeScript**: Typed code structures across the stack to prevent runtime defects.
- **Tailwind CSS (v4)**: Modern, responsive utility classes.
- **Motion (React)**: Professional layout animations and beautiful viewport triggers.
- **Lucide React**: Premium icon suite matching the minimalist luxury theme.
- **Express (v4)**: Minimal, fast server runtime.
- **tsx**: Direct TypeScript execution for dev mode.
- **esbuild**: Bundles the production backend into a single self-contained executable.

---

## 🚀 Local Development Setup

To run this project locally, ensure you have **Node.js (v18+)** installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a local `.env` file or copy `.env.example`:
```bash
cp .env.example .env
```

### 3. Run Development Server
Boot both the Express API and Vite Dev middleware simultaneously under port `3000`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Admin Credentials
To log into the Administrative Dashboard, navigate to `/admin` or use the Navbar admin tab:
- **Email**: `admin@augustingarden.com`
- **Password**: `admin123`

---

## 📦 Production Build & Testing

Verify that your environment builds without errors:

### Build Phase
This compiles the client-side SPA bundle into `/dist` and uses `esbuild` to compile `server.ts` into a self-contained CJS bundle in `/dist/server.cjs`:
```bash
npm run build
```

### Type Checking & Linting
Run TypeScript compilation checks across all modules:
```bash
npm run lint
```

### Start Production Server
Launch the compiled backend production package:
```bash
npm run start
```

---

## 🌍 Vercel Deployment Instructions

Since this app is a **full-stack Express server** with a **JSON-based database**, standard Serverless environments (like Vercel Serverless Functions) can run the client code perfectly, but file-system updates to `data/db.json` and local image uploads in serverless environments are ephemeral (erased on container recycling). 

For standard production deployment, follow one of the methods below:

### Method A: Static Client Deployment (Frontend Only on Vercel)
If you wish to deploy only the high-end showcase frontend on Vercel:
1. Push your code to a GitHub repository.
2. Link your repository in the Vercel Dashboard.
3. Configure the Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy the project.

### Method B: Serverless Deployment (Frontend + Express API)
To host the backend API endpoints as Vercel Serverless Functions:
1. Add a `vercel.json` file in your root folder:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "dist/$1"
    }
  ]
}
```
2. Set up your Vercel project environment variables in the Vercel settings panel (e.g., `GEMINI_API_KEY`).

---

## 🛡️ License
Designed and maintained by Augustin Garden Ltd. All rights reserved.
