# DEPLOYMENT GUIDE: OPTION A (NETLIFY + RENDER)

This guide walks you through deploying **Taj-e-Konain Gas Burner** using **Option A**:
- **Frontend (Storefront & Admin UI):** Hosted on **Netlify** (Free global CDN & SSL)
- **Backend (Express API & SQLite Database):** Hosted on **Render.com** (Free Node.js Web Service with persistent SQLite storage)

---

## Your Store Information Already Configured

- **Business Name:** Taj-e-Konain Gas Burner
- **Primary WhatsApp Hotline:** `03432833991` (International: `923432833991`)
- **Store Address:** `House no.13/3 H area near, main Liaqat Market Rd, Model Colony H Area malir, Karachi, 75050`
- **Google Location Link:** [https://share.google/31m1BrmEBxjzaiXpg](https://share.google/31m1BrmEBxjzaiXpg)

---

## Step 1: Push Code to GitHub

Open PowerShell in the project directory:

```powershell
cd C:\Users\KNA\Desktop\taj-e-konain-gas-burner

# Initialize Git repository (if not already done)
git init
git add .
git commit -m "Taj-e-Konain Gas Burner with Karachi address and Netlify configuration"

# Create a new repository on GitHub (e.g., taj-e-konain-gas-burner) and run:
git remote add origin https://github.com/YOUR_USERNAME/taj-e-konain-gas-burner.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend on Render.com (Free)

1. Go to [Render.com](https://render.com) and sign up / log in with your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your repository `taj-e-konain-gas-burner`.
4. Fill in the settings:
   - **Name:** `taj-e-konain-backend`
   - **Region:** Frankfurt (EU) or Singapore (closest to Pakistan)
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && node database/seed.js`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Click **Advanced** -> **Add Environment Variable**:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `taj_e_konain_secret_jwt_production_2026_xyz`
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = `TajGasBurnerAdmin2026!`
   - `WHATSAPP_NUMBER` = `923432833991`
   - `STORE_ADDRESS` = `House no.13/3 H area near, main Liaqat Market Rd, Model Colony H Area malir, Karachi, 75050`
   - `GOOGLE_MAPS_URL` = `https://share.google/31m1BrmEBxjzaiXpg`
6. Click **Create Web Service**.
7. Once deployed, Render will display your public backend URL, for example:  
   `https://taj-e-konain-backend.onrender.com`  
   *(Copy this URL for Step 3).*

---

## Step 3: Deploy Frontend on Netlify (Free)

1. Go to [Netlify.com](https://netlify.com) and log in with your GitHub account.
2. Click **Add new site** -> **Import an existing project** -> **GitHub**.
3. Choose your repository `taj-e-konain-gas-burner`.
4. Netlify will automatically detect [`netlify.toml`](file:///C:/Users/KNA/Desktop/taj-e-konain-gas-burner/netlify.toml), but verify:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist` (or `client/dist`)
5. Click **Environment variables** -> **Add a variable**:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://taj-e-konain-backend.onrender.com` *(Paste your Render backend URL from Step 2 without a trailing slash)*
6. Click **Deploy Site**.
7. In about 40 seconds, Netlify will publish your site (e.g. `https://taj-e-konain.netlify.app`).

---

## Step 4: Verify Full Operation

1. Open your Netlify URL in your browser.
2. Click **Contact & Store** in the navigation:
   - Confirm your Karachi address is visible:  
     `House no.13/3 H area near, main Liaqat Market Rd, Model Colony H Area malir, Karachi, 75050`
   - Click the **"Open Location in Google Maps"** button to confirm it opens:  
     `https://share.google/31m1BrmEBxjzaiXpg`
3. Add a product to your cart and click **"Proceed to WhatsApp Order"** to test message drafting.
4. Go to `/admin/login` and log in with `admin` / `TajGasBurnerAdmin2026!`.
5. Under **Store Settings**, update your password and verify your live store.

---

## Custom Domain Setup (Optional)

When you purchase a custom domain (such as `tajekonain.com`):
1. In Netlify, go to **Domain management** -> **Add custom domain**.
2. Add your domain and update your DNS records (CNAME / ALIAS) as instructed by Netlify.
3. In Netlify **Environment Variables**, ensure `PRODUCTION_DOMAIN` is set to `https://tajekonain.com`.
