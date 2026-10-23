# TAJ-E-KONAIN GAS BURNER — PROFESSIONAL E-COMMERCE PLATFORM

> **Premium Gas Stoves, Burners, Kitchen Appliances & Safety Accessories**  
> **Primary Market:** Pakistan | **Currency:** PKR (Rs.) | **Primary Order Channel:** WhatsApp (03432833991)

---

## 1. Project Overview

**Taj-e-Konain Gas Burner** is a complete, modern, responsive e-commerce web platform engineered specifically for the Pakistani gas stove and kitchen appliance market.

Built to address local market dynamics—such as low gas pressure seasons, Sui Gas (Natural Gas) and LPG cylinder dual-fuel compatibility, heavy traditional cookware support, and trust-driven customer purchasing—the platform channels all customer orders directly into formatted **WhatsApp conversations**.

Customers can browse 18 demonstration models (double burners, 3-burner glass stoves, drop-in hobs, heavy commercial cast iron burners, regulators, explosion-proof hoses, and replacement parts), adjust quantities, and generate prefilled WhatsApp order messages containing SKUs, itemized totals, delivery address, and gas type specifications.

Store owners can manage inventory, upload photos from their Windows computer, modify prices, update store hours, and edit policy pages through a **password-protected Admin Dashboard** at `/admin`.

---

## 2. Technology Stack

### Frontend (`/client`)
- **Framework:** React.js 19 + Vite 8
- **Styling:** Tailwind CSS v4 with custom theme palette (Charcoal Black, Slate White, Flame Orange, Amber Copper)
- **Routing:** React Router v7 (`react-router-dom`)
- **Icons:** Lucide React (`lucide-react`)
- **SEO & Meta:** `react-helmet-async` with dynamic Schema.org JSON-LD structured data
- **State Management:** React Context API (`CartContext`, `SettingsContext`, `AdminAuthContext`) with `localStorage` persistence

### Backend (`/server`)
- **Runtime:** Node.js (LTS v22+ / v24+)
- **Framework:** Express.js 4 (ES Modules)
- **Database:** SQLite (`node:sqlite` built-in standard library, zero native build errors on Windows)
- **Authentication:** JSON Web Tokens (JWT) + `bcryptjs` password hashing
- **Security:** In-memory rate limiting against brute-force login attempts
- **File Uploads:** Multer with MIME-type filtering (JPEG, PNG, WebP, SVG, GIF) and 5MB size limit
- **SEO:** Dynamic XML Sitemap generation (`/sitemap.xml`) and crawler control (`/robots.txt`)

---

## 3. Project Directory Structure

```text
taj-e-konain-gas-burner/
├── package.json                   # Root package script runner
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git ignore rules for node_modules, DB, and builds
├── README.md                      # Complete installation and operations guide
│
├── client/                        # React.js Frontend Application
│   ├── public/
│   │   ├── images/
│   │   │   ├── logo.svg           # High-resolution brand emblem & typography
│   │   │   ├── logo-icon.svg      # Square badge & favicon icon
│   │   │   ├── hero-banner.svg    # Homepage hero graphic
│   │   │   ├── categories/        # Category banners & cards
│   │   │   └── products/          # 18 demonstration product illustrations
│   │   ├── favicon.svg
│   │   └── robots.txt
│   ├── src/
│   │   ├── admin/                 # Password-Protected Admin Panel
│   │   │   ├── AdminLayout.jsx    # Admin shell with sidebar & mobile navigation
│   │   │   ├── AdminLogin.jsx     # Secure JWT login screen
│   │   │   ├── AdminDashboard.jsx # KPI statistics & recent products overview
│   │   │   ├── AdminProducts.jsx  # Product catalog manager with image uploader
│   │   │   ├── AdminCategories.jsx# Category manager
│   │   │   ├── AdminTestimonials.jsx # Reviews manager (sample vs genuine)
│   │   │   ├── AdminSettings.jsx  # Store settings & password changer
│   │   │   ├── AdminContent.jsx   # About Us, FAQs & policy editor
│   │   │   └── AdminInquiries.jsx # Contact form messages viewer
│   │   ├── components/
│   │   │   ├── cart/
│   │   │   │   ├── CartDrawer.jsx # Slide-out shopping cart drawer
│   │   │   │   └── WhatsAppOrderModal.jsx # WhatsApp checkout & address collector
│   │   │   ├── common/
│   │   │   │   └── SEOHelmet.jsx  # Dynamic SEO meta & JSON-LD schema
│   │   │   ├── layout/
│   │   │   │   ├── AnnouncementBar.jsx # Nationwide delivery & helpline banner
│   │   │   │   ├── Navbar.jsx     # Responsive brand header with search & cart
│   │   │   │   ├── Footer.jsx     # Trust features, links, hours & store address
│   │   │   │   └── MainLayout.jsx # Storefront wrapper with floating WhatsApp button
│   │   │   └── product/
│   │   │       └── ProductCard.jsx# Product card with price in PKR & WhatsApp action
│   │   ├── context/
│   │   │   ├── CartContext.jsx    # Cart state & localStorage sync
│   │   │   ├── SettingsContext.jsx# Live settings provider
│   │   │   └── AdminAuthContext.jsx# Admin session & JWT token manager
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # 14-section homepage with hero, features & FAQs
│   │   │   ├── ShopPage.jsx       # Responsive grid with category filters & sorting
│   │   │   ├── ProductDetailPage.jsx # Gallery, specs table & WhatsApp order button
│   │   │   ├── CartPage.jsx       # Full cart review page
│   │   │   ├── AboutPage.jsx      # Story & craftsmanship overview
│   │   │   ├── ContactPage.jsx    # Contact form & store phone/address
│   │   │   ├── FAQPage.jsx        # Searchable accordion FAQ catalog
│   │   │   ├── PolicyPage.jsx     # Shipping, Returns, Privacy & Terms policies
│   │   │   └── NotFoundPage.jsx   # Custom 404 error page
│   │   ├── services/
│   │   │   ├── api.js             # REST API client
│   │   │   └── whatsapp.js        # WhatsApp link & message generator
│   │   ├── utils/
│   │   │   └── formatters.js      # Currency (Rs. X,XXX) and phone formatters
│   │   ├── index.css              # Tailwind CSS imports & custom theme tokens
│   │   ├── App.jsx                # Route definitions
│   │   └── main.jsx               # Entry point
│   ├── index.html                 # Semantic HTML5 template with SEO fonts
│   ├── vite.config.js             # Vite configuration with proxy to port 5000
│   └── package.json
│
└── server/                        # Node.js & Express Backend API
    ├── database/
    │   ├── db.js                  # SQLite connection & schema initialization
    │   ├── seed.js                # Database seeder (admin, 18 products, FAQs, etc.)
    │   └── store.db               # Persistent SQLite database file
    ├── middleware/
    │   ├── auth.js                # JWT verification middleware
    │   ├── rateLimiter.js         # Login brute-force protector
    │   └── upload.js              # Multer secure image upload handler
    ├── routes/
    │   ├── auth.js                # Login, verify, and change-password endpoints
    │   ├── products.js            # Products CRUD, search, and category filters
    │   ├── categories.js          # Categories CRUD
    │   ├── testimonials.js        # Reviews CRUD
    │   ├── settings.js            # Store settings key-value manager
    │   ├── content.js             # Markdown content blocks & FAQs CRUD
    │   ├── contact.js             # Contact form inquiry handler
    │   ├── upload.js              # Image upload endpoints
    │   ├── stats.js               # Admin dashboard analytics KPI endpoint
    │   └── seo.js                 # Dynamic /sitemap.xml & /robots.txt
    ├── scripts/
    │   ├── generate_assets.js     # Brand SVGs and 18 product graphics generator
    │   └── test_app.js            # Automated 30-test verification suite
    ├── uploads/                   # Statically served user-uploaded photos
    ├── server.js                  # Main Express server entry point
    ├── .env                       # Local environment variables
    ├── .env.example
    └── package.json
```

---

## 4. Windows 10 Step-by-Step Installation

### Step 1: Install Node.js (LTS)
If Node.js is not yet installed on Windows 10, run in PowerShell:
```powershell
winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
```
Verify installation:
```powershell
node -v
npm -v
```

### Step 2: Clone or Open the Project Folder
Open PowerShell or Command Prompt and navigate to the project directory:
```powershell
cd C:\Users\KNA\Desktop\taj-e-konain-gas-burner
```

### Step 3: Install Dependencies
Install all root, backend, and frontend dependencies:
```powershell
npm run install:all
```
*(Or manually: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

### Step 4: Configure Environment Variables
Copy `.env.example` to `server/.env`:
```powershell
Copy-Item .env.example server\.env
```

Review `server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=taj_e_konain_secure_jwt_token_secret_key_change_me_987654321
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TajGasBurnerAdmin2026!
SITE_URL=http://localhost:5173
PRODUCTION_DOMAIN=https://tajekonain.com
STORE_NAME=Taj-e-Konain Gas Burner
WHATSAPP_NUMBER=923432833991
STORE_PHONE=03432833991
STORE_EMAIL=info@tajekonain.com
STORE_ADDRESS=Main Commercial Market, Pakistan (Update via Admin Dashboard)
BUSINESS_HOURS=Mon - Sat: 9:00 AM - 9:00 PM | Sunday: Closed
```

### Step 5: Initialize and Seed the Database
Generate all product graphic assets and seed the SQLite database with 18 demonstration products, categories, FAQs, and policies:
```powershell
npm run seed
```

### Step 6: Start the Development Servers
Start both backend (Port 5000) and frontend Vite server (Port 5173) concurrently:
```powershell
npm run dev
```
Open your web browser at:
- **Storefront:** [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Dynamic XML Sitemap:** [http://localhost:5000/sitemap.xml](http://localhost:5000/sitemap.xml)

---

## 5. Production Build & Deployment

To build the client bundle for production:
```powershell
npm run build
```
This bundles the optimized React code into `client/dist`. The Express backend is configured to automatically serve `client/dist` statically at port 5000!

To start the production server:
```powershell
npm start
```
Now access the full application at [http://localhost:5000](http://localhost:5000).

---

## 6. Administrator Credentials & Admin Portal

Access the Admin Dashboard at:
```text
http://localhost:5173/admin/login  (or /admin)
```

**Default Credentials:**
- **Username:** `admin`
- **Password:** `TajGasBurnerAdmin2026!`

> [!IMPORTANT]
> **Change Default Password:** Before publishing your website online, log in to `/admin`, navigate to **Store Settings**, scroll down to **Change Administrator Password**, and update it to a secure, private password.

### Admin Capabilities:
1. **Dashboard KPI Overview:** Monitor total products, in-stock count, out-of-stock items, categories count, and incoming inquiries.
2. **Product Management:** Add new stoves, modify prices in PKR, set discounts, update stock counts, toggle featured stoves for the homepage, and edit specifications.
3. **Image Uploader:** Upload photos directly from your Windows computer. The server checks file types, sets unique filenames, and saves them safely to `/uploads`.
4. **Category Management:** Create and edit category names, descriptions, and display orders.
5. **Testimonials:** Add genuine customer reviews or edit demonstration reviews.
6. **Store Settings:** Change store name, WhatsApp number, phone number, address, announcement bar, hero headline, and production domain.
7. **Content & FAQs:** Edit About Us story, policies (Shipping, Returns, Privacy, Terms), and manage FAQs.
8. **Inquiries:** Review messages submitted through the contact form with quick one-click WhatsApp reply links.

---

## 7. WhatsApp Ordering & Checkout Workflow

WhatsApp is the primary checkout channel for Taj-e-Konain Gas Burner:

- **WhatsApp Helpline:** `03432833991`
- **International Format:** `923432833991` (no leading zero, no plus sign)

### How It Works:
1. **Single Product Order:** Customers can click **"Order on WhatsApp"** on any product card or details page. It generates a prefilled message containing the store name, product title, SKU, unit price, quantity, and URL link.
2. **Shopping Cart Checkout:** Customers can add multiple items to their cart. Upon clicking **"Proceed to WhatsApp Order"**, a modal captures:
   - Full Name
   - Phone Number
   - City & Complete Delivery Address
   - Fuel Type in Use (Sui Gas vs LPG Cylinder)
   - Order Notes & Custom Instructions
3. **Draft Generation:** A clean WhatsApp URL is opened (`https://wa.me/923432833991?text=...`).
4. **Transparent Order Notice:** The modal clearly informs the customer that **they must send the prefilled WhatsApp message to confirm the order**. No payment gateway is needed for the initial launch, and courier delivery fees will be confirmed directly by the store representative based on package weight.

---

## 8. SEO & Local Search Optimization

- **React Helmet Async:** Dynamically manages unique titles, meta descriptions, canonical URLs, and Open Graph cards for every page and product.
- **Dynamic XML Sitemap:** Automatically rendered at `/sitemap.xml` containing all published products and category links.
- **Crawler Rules:** `/robots.txt` disallows private `/admin` endpoints while declaring the sitemap URL.
- **Schema.org Structured Data:**
  - `Store` / `LocalBusiness` Schema on homepage and contact page.
  - `Product` & `Offer` Schema with PKR currency, brand, and stock status on product pages.
  - `BreadcrumbList` Schema on catalog pages.
- **Local Pakistani Keywords:** Naturally targets searches like *"double burner gas stove in Pakistan"*, *"stainless steel gas stove"*, *"built-in gas hobs Pakistan"*, *"commercial catering burner"*, and *"LPG gas regulator with meter"*.

---

## 9. Demonstration Inventory (18 Products)

The database includes 18 demonstration products with realistic PKR prices:
1. `TK-DG-201` — Taj Premium Tempered Glass Double Burner Stove (Rs. 9,950)
2. `TK-SS-202` — Taj Heavy-Gauge Stainless Steel Double Burner Stove (Rs. 8,900)
3. `TK-TG-303` — Taj Royal 3-Burner Tempered Glass Kitchen Stove (Rs. 14,500)
4. `TK-4B-404` — Taj Imperial 4-Burner Built-In Luxury Gas Hob (Rs. 23,800)
5. `TK-SH-305` — Taj Stainless Steel 3-Burner Drop-In Kitchen Hob (Rs. 19,200)
6. `TK-SB-106` — Taj Compact Single Burner Auto-Ignition Table Stove (Rs. 4,200)
7. `TK-CB-707` — Taj Heavy Cast Iron Commercial Cooking Burner (C-30) (Rs. 7,600)
8. `TK-DR-808` — Taj Dual-Ring Hotel & Catering Heavy Stove Stand (Rs. 11,900)
9. `TK-RG-909` — Taj Low-Pressure LPG Regulator with Pressure Gauge Meter (Rs. 1,550)
10. `TK-HR-910` — Taj High-Pressure Heavy Commercial Gas Regulator (Rs. 2,100)
11. `TK-GH-111` — Taj Steel-Wire Braided Explosion-Proof Gas Hose (2 Meters) (Rs. 990)
12. `TK-BC-112` — Taj Pure Brass Burner Cap & Flame Spreader Ring Set (Rs. 1,200)
13. `TK-TS-113` — Taj Heavy Cast Iron Pan Trivet Stand with Wok Ring (Rs. 900)
14. `TK-KB-114` — Taj Heat-Resistant Metallic Universal Stove Knobs (Pack of 2) (Rs. 590)
15. `TK-IG-115` — Taj Piezo Auto-Ignition Spark Replacement Assembly Kit (Rs. 750)
16. `TK-CS-116` — Taj Outdoor Portable LPG Camping & Picnic Gas Stove (Rs. 4,800)
17. `TK-MK-117` — Taj Stove Maintenance & Nozzle Cleaning Wire Kit (Rs. 490)
18. `TK-CN-118` — Taj Solid Brass Gas Pipe Nipples & Quick Connectors (3 Pcs) (Rs. 650)

### How to Replace Demonstration Products:
Log in to `/admin` -> Navigate to **Products** -> Click **Edit** on any item or click **Add New Product**. You can upload actual showroom photos and update real prices.

---

## 10. Automated Test Suite

A built-in test runner verifies all API routes, database CRUD, sitemap generation, and WhatsApp message construction:
```powershell
node server/scripts/test_app.js
```
**Verification Results:**
- 30 / 30 automated test cases PASSED.
- Zero syntax, compilation, or schema errors.

---

## 11. Pre-Launch Checklist for Store Owner

Before pointing a live public domain to this storefront:
- [ ] Log in to `/admin` and change the default administrator password in **Store Settings**.
- [ ] Update the physical showroom address and city in **Store Settings**.
- [ ] Confirm your WhatsApp number is set to `923432833991` (or your preferred sales number).
- [ ] Enter your real production domain (e.g. `https://tajekonain.com`) in **Store Settings** for canonical sitemap links.
- [ ] Replace demonstration product photos with real stock photography using the Admin Image Uploader.
- [ ] Verify courier delivery rates with your local logistics partner (e.g. TCS, Leopard, Trax, PostEx).
- [ ] Submit `https://yourdomain.com/sitemap.xml` to Google Search Console.

---

*Engineered with quality for Taj-e-Konain Gas Burner — Pakistan.*
