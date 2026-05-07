# Research: Pet E-Commerce Site

**Branch**: `001-pet-ecommerce-site` | **Date**: 2026-05-07
**Phase**: 0 — Pre-design research & unknowns resolution

## Summary

All technical choices were explicitly provided by the user or resolved via industry
standards for the given stack. No blocking unknowns remain.

---

## Decision Log

### 1. Backend Framework

- **Decision**: Java 17 + Spring Boot 3.x + Spring Data JPA
- **Rationale**: Explicitly specified by user. Spring Boot 3 requires Java 17+; provides
  production-ready auto-configuration, embedded Tomcat, JPA repository abstractions,
  and Spring Security for admin auth out of the box.
- **Alternatives considered**: Node.js/Express (constitution default) — overridden by
  user's explicit requirement.

### 2. Database

- **Decision**: PostgreSQL 15+
- **Rationale**: Explicitly specified by user. Relational integrity for pet listings,
  supports soft-delete via nullable `deleted_at` column, ACID transactions for catalog
  mutations, full-text search extensions available for future search features.
- **Alternatives considered**: MySQL — PostgreSQL preferred for richer type system and
  JSON support.

### 3. Frontend Stack

- **Decision**: React 18 (Vite), Tailwind CSS, Material UI (MUI) v5
- **Rationale**: Explicitly specified by user. Vite provides fast HMR and optimised
  production builds. MUI supplies accessible, prebuilt components (DataGrid, Cards,
  Dialogs). Tailwind handles utility-level layout and spacing between MUI components.
- **Alternatives considered**: Plain CSS — Tailwind + MUI reduces boilerplate for a
  gallery + admin form UI.
- **Note**: Tailwind and MUI can conflict on CSS specificity. MUI's `sx` prop and
  `CssBaseline` must be loaded before Tailwind's reset. Configure `important: '#root'`
  in Tailwind config to avoid conflicts.

### 4. Authentication (Admin)

- **Decision**: Spring Security with JWT (stateless)
- **Rationale**: Stateless JWT is standard for REST APIs consumed by SPAs; avoids
  session affinity issues in cloud deployments. Spring Security 6 (included in Boot 3)
  provides JWT filter chain support via `spring-security-oauth2-resource-server`.
- **Alternatives considered**: Session-based — requires sticky sessions or Redis in
  cloud; more complex for SPA. Basic Auth — acceptable for MVP but not industry standard.
- **Token lifetime**: Access token 1 hour; refresh token 7 days (configurable via env).

### 5. Soft-Delete Strategy

- **Decision**: `deleted_at TIMESTAMP NULL` column on `pets` table; JPA `@Where`
  annotation to filter deleted records from public queries; admin queries bypass filter.
- **Rationale**: Mandated by Constitution Principle II. Preserves historical data
  without a separate archive table. Spring Data JPA `@SQLDelete` + `@FilterDef`
  pattern is the standard approach.
- **Alternatives considered**: Hard delete — rejected per constitution. Separate
  archive table — over-engineered for v1 scope.

### 6. Photo Storage

- **Decision**: Photos stored as URLs in the database; actual binary files uploaded to
  a configured external storage provider (e.g., local filesystem in dev, cloud bucket
  in prod via environment variable `PHOTO_STORAGE_BASE_URL`).
- **Rationale**: Spec assumption: cloud storage configured at environment level.
  Decouples storage provider from application code. Avoids storing blobs in PostgreSQL.
- **Alternatives considered**: Storing photos as DB blobs — rejected for performance
  and scalability reasons.

### 7. Filtering Strategy

- **Decision**: Server-side filtering via Spring Data JPA `Specification` (Criteria API).
  Frontend sends filter params as query strings: `?species=Dog&minPrice=100&maxPrice=500`.
- **Rationale**: Server-side filtering is scalable and correct for large datasets.
  JPA Specifications allow composable, type-safe predicates. Frontend filter state
  managed in React with URL query param sync for shareable filter links.
- **Alternatives considered**: Client-side filtering — rejected because it requires
  fetching all records and breaks at scale.

### 8. Testing Strategy

- **Decision**:
  - Backend: JUnit 5 + Mockito (unit), MockMvc + Testcontainers/PostgreSQL (integration)
  - Frontend: Vitest + React Testing Library (unit), Playwright (e2e — optional v2)
- **Rationale**: Testcontainers spins a real PostgreSQL container for integration tests,
  aligning with Constitution Principle IV (no mocking of core flows). MockMvc tests the
  full HTTP request/response cycle.
- **Alternatives considered**: H2 in-memory DB for tests — rejected because PostgreSQL-
  specific features (e.g., `deleted_at` filter) may behave differently in H2.

### 9. Project Structure Decision

- **Decision**: Web application layout — two independent projects in one repository:
  - `backend/` — Spring Boot Maven project
  - `frontend/` — React Vite project
- **Rationale**: Clear separation of concerns; independent CI pipelines; frontend
  deployed as static SPA, backend as containerised service.
- **Alternatives considered**: Monorepo with shared types — over-engineered for v1.

### 10. CORS

- **Decision**: Spring Boot CORS config allows requests from configured `FRONTEND_ORIGIN`
  env variable. Defaults to `http://localhost:5173` in dev.
- **Rationale**: SPA and API are served from different origins; explicit CORS config
  is required by browsers. Environment variable allows flexible deployment.

---

## Open Items / Deferred to Plan Phase

| Item | Status |
|------|--------|
| Deployment target (Render, Railway, Vercel) | Deferred — confirm at deployment config task |
| Cloud storage provider for photos | Deferred — environment-level config; no code change needed |
| Exact MUI version (v5 vs v6) | v5 — stable, well-documented; v6 still in RC as of 2026-Q1 |
