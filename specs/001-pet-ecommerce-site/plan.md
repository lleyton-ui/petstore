# Implementation Plan: Pet E-Commerce Site

**Branch**: `001-pet-ecommerce-site` | **Date**: 2026-05-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-pet-ecommerce-site/spec.md`

## Summary

Build a functional pet e-commerce site with a Spring Boot 3 / PostgreSQL REST API backend
and a React (Vite) + Tailwind CSS + MUI frontend. The public gallery allows shoppers to
browse and filter active pet listings. An authenticated admin panel provides full CRUD
management of pet listings with soft-deletion. All data persists in PostgreSQL across
server restarts.

## Technical Context

**Language/Version**: Java 17 (backend), Node 20 / React 18 (frontend)
**Primary Dependencies**: Spring Boot 3, Spring Data JPA, Spring Security 6 (JWT), Flyway;
React 18, Vite 5, Tailwind CSS 3, Material UI v5
**Storage**: PostgreSQL 15
**Testing**: JUnit 5 + MockMvc + Testcontainers (backend); Vitest + React Testing Library (frontend)
**Target Platform**: Linux server (backend API), Browser SPA (frontend)
**Project Type**: Web application — REST API backend + SPA frontend
**Performance Goals**: Gallery load + 2 filters ≤ 10s (SC-001); Create → visible ≤ 5s (SC-002)
**Constraints**: HTTPS enforced non-local; soft-delete on all pet records; WCAG 2.1 AA on gallery
**Scale/Scope**: Small admin team; public shoppers; MVP — no cart or checkout in v1

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Pre-Design | Post-Design | Notes |
|-----------|-----------|-------------|-------|
| I. Customer-First Commerce | ✅ Pass | ✅ Pass | Gallery P1; responsive 320–1920px; empty states |
| II. Catalog Integrity | ✅ Pass | ✅ Pass | Soft-delete via `deleted_at`; atomic JPA mutations; field validation |
| III. Secure Transactions | ✅ Pass | ✅ Pass | JWT auth; bcrypt cost 12; no payment data; HTTPS env var |
| IV. Testable Feature Slices | ✅ Pass | ✅ Pass | 3 independent user stories; integration tests via Testcontainers |
| V. Simplicity & Maintainability | ✅ Pass | ✅ Pass | Standard Spring Boot monolith + Vite SPA; no premature microservices |

**All gates pass. No Complexity Tracking violations.**

## Project Structure

### Documentation (this feature)

```text
specs/001-pet-ecommerce-site/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── rest-api.md      # Phase 1 output (/speckit-plan command)
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify output)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
backend/                         # Spring Boot 3 Maven project
├── src/
│   ├── main/
│   │   ├── java/com/petstore/
│   │   │   ├── PetstoreApplication.java
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java      # Spring Security + JWT filter chain
│   │   │   │   └── CorsConfig.java          # CORS (FRONTEND_ORIGIN env var)
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java      # POST /api/auth/login
│   │   │   │   ├── PetController.java       # GET /api/pets, GET /api/pets/{id}
│   │   │   │   └── AdminPetController.java  # CRUD /api/admin/pets
│   │   │   ├── service/
│   │   │   │   ├── PetService.java
│   │   │   │   └── AdminUserService.java
│   │   │   ├── repository/
│   │   │   │   ├── PetRepository.java       # JPA repo with @Where soft-delete filter
│   │   │   │   └── AdminUserRepository.java
│   │   │   ├── model/
│   │   │   │   ├── Pet.java                 # @Entity with @SQLDelete + @Where
│   │   │   │   └── AdminUser.java           # @Entity
│   │   │   ├── dto/
│   │   │   │   ├── PetDto.java              # Public response DTO
│   │   │   │   ├── AdminPetDto.java         # Admin response DTO (includes deletedAt)
│   │   │   │   ├── CreatePetRequest.java    # Validated request body
│   │   │   │   └── LoginRequest.java
│   │   │   ├── filter/
│   │   │   │   └── PetFilterCriteria.java   # Query param object for gallery
│   │   │   └── exception/
│   │   │       └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/
│   │           ├── V1__create_tables.sql
│   │           └── V2__seed_admin.sql
│   └── test/
│       └── java/com/petstore/
│           ├── controller/
│           │   ├── PetControllerTest.java    # MockMvc unit tests
│           │   └── AdminPetControllerTest.java
│           └── integration/
│               └── PetIntegrationTest.java  # Testcontainers + full HTTP cycle
└── pom.xml

frontend/                        # React Vite SPA
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── api/
│   │   ├── petsApi.ts           # Axios calls to GET /api/pets
│   │   └── adminApi.ts          # Axios calls to /api/admin/pets + auth
│   ├── components/
│   │   ├── PetCard.tsx          # Gallery card (MUI Card + Tailwind)
│   │   ├── PetGallery.tsx       # Responsive MUI Grid of PetCards
│   │   ├── FilterPanel.tsx      # Species/breed/age/price filter controls
│   │   ├── PetDetailModal.tsx   # Full pet profile (MUI Dialog)
│   │   ├── EmptyState.tsx       # "No pets found" component
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       ├── PetForm.tsx      # Create/edit form (MUI + react-hook-form)
│   │       ├── PetTable.tsx     # Admin listing table (MUI DataGrid)
│   │       └── LoginForm.tsx
│   ├── pages/
│   │   ├── GalleryPage.tsx      # Public gallery (US1)
│   │   ├── PetDetailPage.tsx    # Single pet detail
│   │   └── admin/
│   │       ├── LoginPage.tsx
│   │       ├── DashboardPage.tsx
│   │       └── PetManagementPage.tsx
│   ├── hooks/
│   │   ├── usePets.ts           # Gallery data fetching + filter state
│   │   └── useAdminPets.ts      # Admin CRUD operations
│   ├── context/
│   │   └── AuthContext.tsx      # JWT storage + auth state
│   └── types/
│       └── pet.ts               # TypeScript interfaces
├── .env.example
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

**Structure Decision**: Web application layout (Option 2) — `backend/` and `frontend/`
as independent projects in the repository root. Backend is a Spring Boot Maven project;
frontend is a Vite + React SPA. They communicate exclusively over the REST API. This
matches the user's explicit tech stack and avoids monorepo tooling overhead for v1.
