# Principles Playoff - Deployment Guide

## Cloudflare Pages Deployment

### Method 1: Cloudflare Pages Dashboard (Recommended)

1. **Connect your repository to Cloudflare Pages:**
   - Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
   - Click "Create a project" → "Connect to Git"
   - Select your repository

2. **Configure build settings:**
   ```
   Framework preset: None (or Vite)
   Build command: cd app && npm install && npm run build
   Build output directory: app/dist
   Root directory: /
   ```

3. **Environment variables (optional):**
   - No environment variables needed for basic deployment

### Method 2: Local Build + Manual Upload

1. **Build locally:**
   ```bash
   cd app
   npm install
   npm run build
   ```

2. **Upload the `app/dist` folder contents to Cloudflare Pages**

### Method 3: Wrangler CLI (Alternative)

1. **Create wrangler.jsonc in project root:**
   ```json
   {
     "name": "principles-playoff",
     "compatibility_date": "2025-06-02",
     "assets": {
       "directory": "./app/dist"
     }
   }
   ```

2. **Deploy commands:**
   ```bash
   cd app
   npm install
   npm run build
   cd ..
   npx wrangler pages deploy app/dist --project-name=principles-playoff
   ```

## Correct Cloudflare Pages Settings

- **Build command:** `cd app && npm install && npm run build`
- **Build output directory:** `app/dist`
- **Root directory:** `/` (project root)
- **Node.js version:** 18 or 20

## Troubleshooting

### Common Issues:

1. **Build fails:** Make sure Node.js version is 18+
2. **Wrong directory:** Build output should point to `app/dist`, not just `dist`
3. **Dependencies:** All dependencies are in `app/package.json`

### Local Testing:

```bash
cd app
npm install
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
```

The built files will be in `app/dist/` - this is what should be deployed to Cloudflare Pages.