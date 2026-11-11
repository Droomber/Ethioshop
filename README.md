# EthioMarket — enhanced full-stack learning project

**Folder structure preserved:** the existing `backend/` and `frontend/` folders and their existing file organization remain in place. New backend model/route and frontend language files were added inside those folders. The uploaded `.env` file was intentionally excluded because it contained live-looking database and payment credentials. Create a fresh one from `.env.example`.

## Stack
- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express
- Online database: MongoDB Atlas + Mongoose
- Login: JWT + bcrypt; customers must log in before checkout; admin-only CRUD
- Payment: Chapa hosted checkout integration (test mode only)
- Contact: email through Nodemailer; phone and SMS contact links; optional SMS sending via Twilio
- Hosting: GitHub + Render (API); frontend can be hosted on GitHub Pages or Render Static Site

## Added features
1. Integrated marketing communications section describing consistent website, social, email and community messaging.
2. Market-location coverage examples for Addis Ababa, Mekelle, Adama, Hawassa, Bahir Dar, Gondar, Dire Dawa and Jimma. These are illustrative service markets, not a claim that delivery is already available in every city.
3. Promotions section for seasonal offers and artisan bundles.
4. Digital campaign section with social storytelling, video, email and creator-collaboration ideas.
5. 100 Ethiopian cultural product sample listings (coffee, clothing, weaving, pottery, jewelry, leather, spices, music, art and books) in addition to the original general catalog.
6. Email contact form, phone/SMS links, and optional Twilio SMS API endpoint.
7. Product ratings and comments; one review per signed-in user per product, editable by submitting again.
8. Basic interface language selector: English, Amharic, Afaan Oromoo and Tigrinya. Seller-entered product content is not automatically translated.
9. MongoDB Atlas, Chapa, GitHub and Render deployment configuration.
10. Admin product create/read/update/delete tools retained; customer login and protected order checkout.
11. Customer registration/login remains the first step for ordering. Product browsing remains public.
12. Existing cart/order features plus review moderation-ready database records, stock display, campaign messaging and health endpoint.

## Local setup
1. Install Node.js LTS.
2. In a terminal:
   ```bash
   cd backend
   npm install
   ```
3. Copy `.env.example` to `.env`, then configure:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=use_a_long_random_secret
   CLIENT_ORIGIN=http://127.0.0.1:5500,http://localhost:5500
   FRONTEND_URL=http://127.0.0.1:5500
   ```
4. Start API:
   ```bash
   npm run dev
   ```
5. Seed demo products:
   ```bash
   npm run seed
   ```
   The seed defines 150 demo items: 50 general products and 100 Ethiopian cultural product samples. Existing records are updated by name or inserted if missing.
6. Open `frontend/index.html` using VS Code Live Server.

## Admin setup
Register a normal user, then change that user's `role` from `customer` to `admin` in the MongoDB Atlas `users` collection. Log out and log in again. Never add public self-service admin registration.

## Contact configuration
- Email: set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_TO`.
- Phone: replace the sample `+251900000000` in `frontend/contact.html` with the store's real business number.
- SMS: install dependencies with `npm install`, then set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, and `CONTACT_SMS_TO`. The credentials stay on the backend. SMS sending depends on a valid Twilio account, sender and destination permissions.

## Payment
Configure `CHAPA_PRIVATE_KEY` only in backend environment variables. Use test mode and follow the provider's current merchant onboarding and API instructions. Never put payment secrets in frontend code. A browser redirect is not proof of payment; verify payment server-side before fulfilment. Review the existing payment route carefully against the exact Chapa API version enabled for your merchant account before live use.

## GitHub + Render deployment
1. Create a GitHub repository and push the project. `.env` and `node_modules/` are ignored; do not commit secrets.
2. Create a MongoDB Atlas database and a database user with a strong password. Restrict network access appropriately.
3. Connect the repository to Render. The root `render.yaml` describes the backend web service (`rootDir: backend`). Add all environment variables in Render's dashboard.
4. Deploy the frontend as a GitHub Pages site or Render Static Site with publish directory `frontend`.
5. Set `window.ETHIOMARKET_API` before loading the frontend, or change the default API URL in `frontend/js/app.js` to `https://YOUR-API.onrender.com/api`. For GitHub Pages, use the deployed Render API URL.
6. Set `CLIENT_ORIGIN` to the exact frontend origin and `FRONTEND_URL` to the frontend base URL.
7. Test `/api/health`, register/login, admin CRUD, review posting, contact email, order creation and payment verification.

## Important security and production notes
- The uploaded archive contained credentials in `backend/.env`. They have been excluded from this updated archive. **Rotate the MongoDB database password, JWT secret and Chapa test key immediately** because the old values were included in an uploaded file. Do not reuse them.
- SMS requires Twilio configuration and may incur charges. Phone links require the correct business number.
- Market cities are sample targeting areas; confirm actual shipping coverage and rates before advertising them.
- Promotions are campaign content examples; no automatic discount engine or coupon validation is claimed.
- Language support is a basic UI dictionary, not full content translation.
- Before real sales, add automated tests, webhook signature verification, payment idempotency, stock reservation transactions, email verification, password reset, image hosting, order cancellation/refunds, privacy/returns/shipping policies, audit logs, backups and monitoring.
