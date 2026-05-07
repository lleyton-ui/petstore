# Quickstart: Pet E-Commerce Site

**Branch**: `001-pet-ecommerce-site` | **Date**: 2026-05-07

This guide lets you run the full stack locally in under 10 minutes and validate each
user story independently.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Java | 17+ | [sdkman.io](https://sdkman.io) or system package manager |
| Maven | 3.9+ | Bundled with Spring Boot wrapper (`./mvnw`) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| PostgreSQL | 15+ | Local install or Docker |
| Docker (optional) | 24+ | [docker.com](https://docker.com) — for Testcontainers |

---

## 1. Database Setup

### Option A — Local PostgreSQL

```bash
psql -U postgres -c "CREATE DATABASE petstore;"
psql -U postgres -c "CREATE USER petstore_user WITH PASSWORD 'petstore_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE petstore TO petstore_user;"
```

### Option B — Docker

```bash
docker run -d \
  --name petstore-db \
  -e POSTGRES_DB=petstore \
  -e POSTGRES_USER=petstore_user \
  -e POSTGRES_PASSWORD=petstore_pass \
  -p 5432:5432 \
  postgres:15
```

---

## 2. Backend Setup

```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env: set DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET

# Run the application (Flyway migrations run automatically on startup)
./mvnw spring-boot:run
```

Backend starts at: **http://localhost:8080**

**Environment variables** (`backend/.env.example`):

```env
DB_URL=jdbc:postgresql://localhost:5432/petstore
DB_USERNAME=petstore_user
DB_PASSWORD=petstore_pass
JWT_SECRET=change-me-to-a-256-bit-random-secret
JWT_EXPIRY_SECONDS=3600
FRONTEND_ORIGIN=http://localhost:5173
PHOTO_STORAGE_BASE_URL=http://localhost:8080/uploads
```

**Seed admin user** (created by Flyway migration `V2__seed_admin.sql`):
- Username: `admin`
- Password: `admin123` *(change in production)*

---

## 3. Frontend Setup

```bash
cd frontend

npm install

# Copy and configure environment
cp .env.example .env.local
# Edit .env.local: set VITE_API_BASE_URL

npm run dev
```

Frontend starts at: **http://localhost:5173**

**Environment variables** (`frontend/.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 4. Validation Checklist

Run these checks in order to validate each user story independently.

### ✅ User Story 1 — Browse Pet Gallery (P1)

1. Open http://localhost:5173 in a browser.
2. Verify: The pet gallery loads with a responsive card grid.
3. Apply the **Species** filter → select "Dog".
4. Verify: Only dogs are shown; count updates correctly.
5. Add a **Price Range** filter (e.g., $100–$500).
6. Verify: Results narrow to dogs in the price range.
7. Clear all filters.
8. Verify: Full gallery restores.
9. Click any pet card.
10. Verify: Pet detail view shows all fields including photo.

**Pass criteria**: All 10 steps complete without errors.

---

### ✅ User Story 2 — Admin Manages Pet Listings (P2)

1. Open http://localhost:5173/admin/login.
2. Login with `admin` / `admin123`.
3. Verify: Redirected to admin dashboard.
4. Click **"Add Pet"** → fill all fields → submit.
5. Verify: New pet appears in admin list AND in public gallery.
6. Click **Edit** on the new pet → change the price → save.
7. Verify: Updated price appears in admin list and gallery card.
8. Click **Delete** on the pet → confirm.
9. Verify: Pet disappears from public gallery.
10. In admin list, verify: soft-deleted pet shows with `[DELETED]` status.
11. Attempt to create a pet with an empty **Name** field.
12. Verify: Validation error message appears; no record created.

**Pass criteria**: All 12 steps complete without errors.

---

### ✅ User Story 3 — Data Persistence (P3)

1. Ensure at least one pet listing exists (from US2 test above).
2. Stop the backend: `Ctrl+C` in the terminal running `./mvnw spring-boot:run`.
3. Restart the backend: `./mvnw spring-boot:run`.
4. Reload http://localhost:5173.
5. Verify: All previously created pets are still present.

**Pass criteria**: Data survives restart with zero loss.

---

## 5. Running Tests

### Backend Unit + Integration Tests

```bash
cd backend
./mvnw test
```

> Requires Docker for Testcontainers (PostgreSQL container spun automatically).

### Frontend Unit Tests

```bash
cd frontend
npm run test
```

---

## 6. Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `Connection refused` on backend start | PostgreSQL not running | Start DB (Option A or B above) |
| `401 Unauthorized` on admin actions | JWT token expired or missing | Re-login at `/admin/login` |
| Gallery shows no pets | No seed data | Add pets via admin panel |
| CORS errors in browser | `FRONTEND_ORIGIN` mismatch | Set `FRONTEND_ORIGIN` in backend `.env` to your frontend URL |
| Photo not loading | Invalid `photoUrl` | Use a valid image URL; placeholder shown automatically |
