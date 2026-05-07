---
description: "Task list for Pet E-Commerce Site"
---

# Tasks: Pet E-Commerce Site

**Input**: Design documents from `specs/001-pet-ecommerce-site/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: Test tasks are NOT included unless explicitly requested. Add TDD tasks via `/speckit-tasks --tdd` if needed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in all descriptions

## Path Conventions

- **Backend**: `backend/src/main/java/com/petstore/`
- **Frontend**: `frontend/src/`
- **Migrations**: `backend/src/main/resources/db/migration/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize both projects, configure tooling, and establish the shared skeleton before any feature work begins.

- [X] T001 Create `backend/` Maven project with Spring Boot 3 initializr — include dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-security-oauth2-resource-server`, `flyway-core`, `postgresql`, `lombok`, `spring-boot-starter-validation`
- [X] T002 Create `frontend/` Vite + React 18 + TypeScript project via `npm create vite@latest frontend -- --template react-ts -y`
- [X] T003 [P] Configure Tailwind CSS 3 in `frontend/tailwind.config.js` and `frontend/src/index.css` — set `important: '#root'` to prevent MUI conflicts
- [X] T004 [P] Install and configure Material UI v5 in `frontend/` — add `@mui/material`, `@emotion/react`, `@emotion/styled`; wrap app in `<CssBaseline />` + `<ThemeProvider>`
- [X] T005 [P] Create `backend/src/main/resources/application.yml` — configure datasource via env vars `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`; set Flyway `baseline-on-migrate: true`; configure JWT properties
- [X] T006 [P] Create `frontend/.env.example` with `VITE_API_BASE_URL=http://localhost:8080/api` and `frontend/src/api/axiosClient.ts` with base URL from env var
- [X] T007 [P] Add `backend/.gitignore` (exclude `.env`, `target/`) and `frontend/.gitignore` (exclude `.env.local`, `node_modules/`, `dist/`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure MUST be complete before any user story can be implemented.

⚠️ **CRITICAL**: No user story work can begin until this phase is complete.

- [X] T008 Create Flyway migration `backend/src/main/resources/db/migration/V1__create_tables.sql` — exact SQL from data-model.md: `admin_users` table, `pets` table, all indexes (`idx_pets_species`, `idx_pets_breed`, `idx_pets_deleted_at`, `idx_pets_price`, `idx_admin_username`)
- [X] T009 Create Flyway migration `backend/src/main/resources/db/migration/V2__seed_admin.sql` — insert default admin user with bcrypt-hashed password (`admin`/`admin123`, cost 12); add comment warning to change in production
- [X] T010 [P] Create `Pet` JPA entity in `backend/src/main/java/com/petstore/model/Pet.java` — all columns from data-model.md; `@SQLDelete(sql = "UPDATE pets SET deleted_at = NOW() WHERE id = ?")`, `@Where(clause = "deleted_at IS NULL")`; `@PreUpdate` to set `updatedAt`
- [X] T011 [P] Create `AdminUser` JPA entity in `backend/src/main/java/com/petstore/model/AdminUser.java` — all columns from data-model.md; implement `UserDetails` for Spring Security integration
- [X] T012 Create `PetRepository` in `backend/src/main/java/com/petstore/repository/PetRepository.java` — extend `JpaRepository<Pet, Long>` and `JpaSpecificationExecutor<Pet>`; add custom `@Query` to find including soft-deleted (for admin)
- [X] T013 [P] Create `AdminUserRepository` in `backend/src/main/java/com/petstore/repository/AdminUserRepository.java` — `findByUsername(String username)` method
- [X] T014 Create `PetFilterCriteria` query param object in `backend/src/main/java/com/petstore/filter/PetFilterCriteria.java` — fields: `species`, `breed`, `minAge`, `maxAge`, `minPrice`, `maxPrice`, `page` (default 0), `size` (default 20), `sort` (default `name,asc`)
- [X] T015 Create `PetSpecification` in `backend/src/main/java/com/petstore/filter/PetSpecification.java` — static factory methods building JPA `Specification<Pet>` predicates for each filter field; compose with `Specification.where().and()`
- [X] T016 [P] Create DTOs in `backend/src/main/java/com/petstore/dto/`: `PetDto.java` (public fields, no `deletedAt`), `AdminPetDto.java` (includes `deletedAt`), `CreatePetRequest.java` (Bean Validation annotations: `@NotBlank`, `@Positive`, etc.), `LoginRequest.java`
- [X] T017 Create `GlobalExceptionHandler` in `backend/src/main/java/com/petstore/exception/GlobalExceptionHandler.java` — `@RestControllerAdvice`; handle `MethodArgumentNotValidException` → 400 with violations array; `EntityNotFoundException` → 404; generic `Exception` → 500; all responses use standard error envelope from contracts/rest-api.md
- [X] T018 Create Spring Security JWT configuration in `backend/src/main/java/com/petstore/config/SecurityConfig.java` — stateless session; permit `GET /api/pets/**` and `POST /api/auth/login`; require auth on `POST|PUT|DELETE /api/admin/**`; configure `BCryptPasswordEncoder` (strength 12); configure JWT decoder from `JWT_SECRET` env var
- [X] T019 [P] Create CORS configuration in `backend/src/main/java/com/petstore/config/CorsConfig.java` — allow origin from `FRONTEND_ORIGIN` env var; allow `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`; allow `Authorization` and `Content-Type` headers
- [X] T020 Create `AdminUserService` in `backend/src/main/java/com/petstore/service/AdminUserService.java` — implement `UserDetailsService`; load admin by username; used by Spring Security auth provider
- [X] T021 Create `AuthController` in `backend/src/main/java/com/petstore/controller/AuthController.java` — `POST /api/auth/login`; validate credentials via `AuthenticationManager`; generate and return JWT; response shape from contracts/rest-api.md
- [X] T022 Create `AuthContext` in `frontend/src/context/AuthContext.tsx` — store JWT in `localStorage`; provide `login()`, `logout()`, `isAuthenticated`; wrap `App.tsx` with `<AuthProvider>`

**Checkpoint**: Foundation ready — database schema migrated, security configured, auth endpoint working. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Browse Pet Product Gallery (Priority: P1) 🎯 MVP

**Goal**: Public shoppers can browse a responsive pet gallery and filter by species, breed, age range, and price range.

**Independent Test**: Load gallery at `http://localhost:5173`, verify all active pets appear, apply species filter, apply price range filter, click a pet card to see detail view. No admin login required.

### Implementation for User Story 1

- [X] T023 [P] [US1] Create `PetService` in `backend/src/main/java/com/petstore/service/PetService.java` — `findAllActive(PetFilterCriteria criteria)` using `PetSpecification` + `PetRepository.findAll(spec, pageable)`; `findActiveById(Long id)` throwing `EntityNotFoundException` if not found or soft-deleted; map `Pet` → `PetDto`
- [X] T024 [P] [US1] Create `PetController` in `backend/src/main/java/com/petstore/controller/PetController.java` — `GET /api/pets` (paginated + filtered, 200 OK with pagination envelope); `GET /api/pets/{id}` (200 OK or 404); map responses to `PetDto`; inject `PetService`
- [X] T025 [P] [US1] Create `PetCard` component in `frontend/src/components/PetCard.tsx` — MUI `Card` + `CardMedia` (photo with fallback placeholder if `photoUrl` null/broken); display name, species, breed, age in months, price; onClick handler prop; Tailwind for spacing
- [X] T026 [P] [US1] Create `EmptyState` component in `frontend/src/components/EmptyState.tsx` — MUI `Box` + `Typography`; shows "No pets found" message; "Clear Filters" `Button` prop (optional)
- [X] T027 [US1] Create `usePets` hook in `frontend/src/hooks/usePets.ts` — fetch `GET /api/pets` via `axiosClient`; accept filter state as params; return `{ pets, totalPages, loading, error }`; re-fetch when filter params change; sync filter state to URL query params using `URLSearchParams`
- [X] T028 [US1] Create `FilterPanel` component in `frontend/src/components/FilterPanel.tsx` — MUI `Select` for species (enum values: DOG, CAT, BIRD, FISH, RABBIT, HAMSTER, REPTILE, OTHER); MUI `TextField` for breed (debounced 300ms); MUI `Slider` for age range (0–240 months); MUI `Slider` for price range ($0–$5000); "Clear All" button; onChange props to parent
- [X] T029 [US1] Create `PetGallery` component in `frontend/src/components/PetGallery.tsx` — MUI `Grid` container; renders `PetCard` for each pet; shows `EmptyState` when `pets.length === 0`; MUI `Skeleton` cards during loading; MUI `Pagination` component at bottom
- [X] T030 [US1] Create `GalleryPage` in `frontend/src/pages/GalleryPage.tsx` — compose `FilterPanel` + `PetGallery`; manage filter state; pass filter changes to `usePets`; render `PetDetailModal` on card click
- [X] T031 [US1] Create `PetDetailModal` in `frontend/src/components/PetDetailModal.tsx` — MUI `Dialog`; fetch `GET /api/pets/{id}` via `axiosClient` on open; display all fields: photo, name, species, breed, age, price, description, availability status; close button
- [X] T032 [US1] Configure React Router in `frontend/src/App.tsx` — route `/` → `GalleryPage`; route `/pets/:id` → `PetDetailPage` (optional direct URL); route `/admin/*` → admin pages (Phase 4); wrap with `AuthProvider`
- [X] T033 [US1] Create `frontend/src/pages/GalleryPage` TypeScript types in `frontend/src/types/pet.ts` — `Pet`, `PetListResponse`, `FilterCriteria` interfaces matching contract shapes from contracts/rest-api.md

**Checkpoint**: User Story 1 fully functional. Shoppers can browse, filter, and view pet details. Test independently per quickstart.md US1 checklist.

---

## Phase 4: User Story 2 — Admin Manages Pet Listings (Priority: P2)

**Goal**: Authenticated admins can create, view (all + soft-deleted), update, and soft-delete pet listings via a protected admin panel.

**Independent Test**: Login at `/admin/login`, create a pet, verify it appears in gallery AND admin list, edit price, verify update persists, delete pet, verify removed from gallery, verify soft-deleted record still visible in admin list with [DELETED] status.

### Implementation for User Story 2

- [X] T034 [P] [US2] Create `AdminPetService` in `backend/src/main/java/com/petstore/service/AdminPetService.java` — `findAll(PetFilterCriteria, includeDeleted)` bypassing `@Where` filter when `includeDeleted=true` using custom repository query; `create(CreatePetRequest)` → save + return `AdminPetDto`; `update(Long id, CreatePetRequest)` → find, validate not deleted, update fields, save; `softDelete(Long id)` → delegates to JPA `deleteById` (intercepted by `@SQLDelete`); map `Pet` → `AdminPetDto`
- [X] T035 [P] [US2] Create `AdminPetController` in `backend/src/main/java/com/petstore/controller/AdminPetController.java` — `GET /api/admin/pets` (paginated, `includeDeleted` param defaulting `true`); `POST /api/admin/pets` (201 Created); `PUT /api/admin/pets/{id}` (200 OK); `DELETE /api/admin/pets/{id}` (204 No Content); `@PreAuthorize("hasRole('ADMIN')")` on class; inject `AdminPetService`
- [X] T036 [P] [US2] Create `LoginForm` component in `frontend/src/components/admin/LoginForm.tsx` — MUI `TextField` for username + password; MUI `Button` submit; show MUI `Alert` on error; calls `AuthContext.login()` on success; redirect to `/admin/dashboard`
- [X] T037 [P] [US2] Create `LoginPage` in `frontend/src/pages/admin/LoginPage.tsx` — centered MUI `Card`; renders `LoginForm`; redirect to `/admin/dashboard` if already authenticated
- [X] T038 [US2] Create `useAdminPets` hook in `frontend/src/hooks/useAdminPets.ts` — `fetchAll()`, `create(data)`, `update(id, data)`, `remove(id)` via `adminApi.ts`; return `{ pets, loading, error, refetch }`; include JWT `Authorization` header via axios interceptor in `adminApi.ts`
- [X] T039 [US2] Create `adminApi.ts` in `frontend/src/api/adminApi.ts` — axios instance with `Authorization: Bearer <token>` interceptor reading from `AuthContext`; functions: `getPets(params)`, `createPet(data)`, `updatePet(id, data)`, `deletePet(id)`, `login(username, password)`
- [X] T040 [US2] Create `PetForm` component in `frontend/src/components/admin/PetForm.tsx` — MUI form fields for all `CreatePetRequest` fields (name, species dropdown, breed, ageMonths, price, availabilityStatus dropdown, photoUrl, description); react-hook-form for validation; `onSubmit` prop; pre-populate fields when editing; show field-level validation errors from API 400 response
- [X] T041 [US2] Create `PetTable` component in `frontend/src/components/admin/PetTable.tsx` — MUI `DataGrid` (or `Table`); columns: name, species, breed, age, price, status (with `[DELETED]` chip for soft-deleted rows), createdAt, actions (Edit / Delete buttons); `onEdit(pet)` and `onDelete(id)` props; soft-deleted rows styled with reduced opacity
- [X] T042 [US2] Create `PetManagementPage` in `frontend/src/pages/admin/PetManagementPage.tsx` — render `PetTable` with `useAdminPets` data; "Add Pet" button opens `PetForm` in a MUI `Dialog`; row Edit opens `PetForm` pre-populated; row Delete shows MUI `Dialog` confirmation before calling `remove(id)`; refetch list after each mutation
- [X] T043 [US2] Create `AdminLayout` in `frontend/src/components/admin/AdminLayout.tsx` — MUI `AppBar` with site title + Logout button (calls `AuthContext.logout()`); MUI `Drawer` sidebar with navigation links; `<Outlet />` for nested admin routes
- [X] T044 [US2] Create `DashboardPage` in `frontend/src/pages/admin/DashboardPage.tsx` — summary counts (total pets, active, sold, deleted) fetched from `GET /api/admin/pets`; quick link to Pet Management
- [X] T045 [US2] Add admin routes to `frontend/src/App.tsx` — `GET /admin` → redirect to `/admin/login`; `/admin/login` → `LoginPage`; `/admin/*` wrapped in `<RequireAuth>` guard component → `AdminLayout` with nested routes `/admin/dashboard` → `DashboardPage`, `/admin/pets` → `PetManagementPage`
- [X] T046 [US2] Create `RequireAuth` guard component in `frontend/src/components/admin/RequireAuth.tsx` — redirect to `/admin/login` if `!AuthContext.isAuthenticated`; renders `<Outlet />` when authenticated

**Checkpoint**: User Story 2 fully functional. Admin can login, perform all CRUD operations, and view soft-deleted records. Test independently per quickstart.md US2 checklist.

---

## Phase 5: User Story 3 — Data Persistence Across Sessions (Priority: P3)

**Goal**: All pet data survives application restarts and browser sessions with zero loss.

**Independent Test**: Create a pet, stop backend (`Ctrl+C`), restart backend (`./mvnw spring-boot:run`), reload gallery — pet is still present.

### Implementation for User Story 3

- [X] T047 [P] [US3] Verify Flyway `spring.flyway.locations` is configured in `backend/src/main/resources/application.yml` and migrations run automatically on startup — confirm in startup logs
- [X] T048 [US3] Add `@UpdateTimestamp` or `@PreUpdate` lifecycle hook to `Pet.java` in `backend/src/main/java/com/petstore/model/Pet.java` — ensures `updated_at` is auto-set on every JPA save/merge
- [X] T049 [US3] Add `backend/src/main/resources/db/migration/V3__add_pet_indexes.sql` — verify all four indexes from data-model.md exist; idempotent `CREATE INDEX IF NOT EXISTS` statements
- [X] T050 [US3] Document persistence validation steps in `specs/001-pet-ecommerce-site/quickstart.md` — US3 restart test procedure (already present; verify it matches final implementation and update if needed)

**Checkpoint**: All three user stories independently functional and persistent. Full end-to-end validation per quickstart.md passes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements that span multiple user stories.

- [X] T051 [P] Add loading skeleton states to `frontend/src/components/PetGallery.tsx` — render 8 MUI `Skeleton` card placeholders while `loading === true` (prevents blank flash on initial load)
- [X] T052 [P] Add broken image fallback to `frontend/src/components/PetCard.tsx` and `PetDetailModal.tsx` — `onError` handler on `<img>` sets `src` to `/placeholder-pet.png`; add placeholder image to `frontend/public/`
- [X] T053 [P] Add MUI `Snackbar` + `Alert` global toast notifications in `frontend/src/App.tsx` — show success toasts on admin create/update/delete; show error toasts on API failures
- [X] T054 [P] Add accessibility attributes to `frontend/src/components/FilterPanel.tsx` and `PetCard.tsx` — `aria-label` on filter controls; `role="img"` + `alt` text on pet photos; keyboard navigation for gallery cards (WCAG 2.1 AA per constitution)
- [X] T055 [P] Add `backend/src/main/resources/application-prod.yml` — override `spring.jpa.show-sql=false`; enforce `server.ssl.enabled` reference; document `FRONTEND_ORIGIN` and `JWT_SECRET` must be set via environment
- [X] T056 Add `README.md` at repository root — project overview, prerequisites, setup instructions (link to quickstart.md), branch name, tech stack summary
- [X] T057 [P] Add `backend/Dockerfile` — multi-stage build: `maven:3.9-eclipse-temurin-17` for build, `eclipse-temurin:17-jre` for runtime; expose port 8080
- [X] T058 [P] Add `frontend/Dockerfile` — multi-stage build: `node:20-alpine` for build (`npm run build`), `nginx:alpine` for serving; expose port 80
- [X] T059 Run quickstart.md full validation — execute all three user story validation checklists end-to-end; document any failures as follow-up issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — **BLOCKS all user stories**
- **Phase 3 (US1 Gallery)**: Depends on Phase 2 — can start as soon as foundation is ready
- **Phase 4 (US2 Admin CRUD)**: Depends on Phase 2 — can run in parallel with Phase 3 (different files)
- **Phase 5 (US3 Persistence)**: Depends on Phase 2 — mostly verification; can run in parallel
- **Phase 6 (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependencies on US2 or US3
- **US2 (P2)**: Can start after Phase 2 — builds on `Pet` entity from Phase 2 but independent of US1 frontend
- **US3 (P3)**: Can start after Phase 2 — persistence is ensured by Flyway + JPA setup; mostly verification tasks

### Within Each User Story

- Backend service → backend controller → frontend API client → frontend hook → frontend components → frontend page
- Models (Phase 2) before services; services before controllers
- Story complete before moving to next priority

### Parallel Opportunities

All `[P]` tasks within the same phase can be executed concurrently (different files, no shared dependency).

Key parallel batches:
- **Phase 1**: T003, T004, T005, T006, T007 (all parallel after T001/T002)
- **Phase 2**: T010+T011, T016, T018+T019 can run together after T008+T009
- **Phase 3**: T023+T024 (backend) can run while T025+T026+T033 (frontend foundation) runs simultaneously
- **Phase 4**: T034+T035 (backend) can run while T036+T037 (frontend login) runs simultaneously

---

## Parallel Example: User Story 1

```bash
# Launch backend work for US1 simultaneously:
Task T023: Create PetService in backend/src/main/java/com/petstore/service/PetService.java
Task T024: Create PetController in backend/src/main/java/com/petstore/controller/PetController.java

# Launch frontend foundation for US1 simultaneously:
Task T025: Create PetCard in frontend/src/components/PetCard.tsx
Task T026: Create EmptyState in frontend/src/components/EmptyState.tsx
Task T033: Create pet TypeScript types in frontend/src/types/pet.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T007)
2. Complete Phase 2: Foundational (T008–T022) — **CRITICAL, blocks everything**
3. Complete Phase 3: User Story 1 (T023–T033)
4. **STOP and VALIDATE**: Run US1 checklist from quickstart.md independently
5. Demo gallery to stakeholders; collect feedback before proceeding to admin panel

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 (US1) → Public gallery works → Demo/deploy MVP
3. Phase 4 (US2) → Admin CRUD works → Internal team can manage listings
4. Phase 5 (US3) → Verify persistence → All stories stable
5. Phase 6 → Polish + Dockerize → Production-ready

### Parallel Team Strategy

With two developers:

1. Both complete Phase 1 + 2 together (sequential gate)
2. Once Phase 2 done:
   - **Developer A**: Phase 3 (US1 — public gallery, backend + frontend)
   - **Developer B**: Phase 4 (US2 — admin CRUD, backend + frontend)
3. Developer B also handles Phase 5 (US3 — persistence verification, low effort)
4. Both collaborate on Phase 6 (Polish)

---

## Notes

- `[P]` tasks = different files, no incomplete task dependencies — safe to parallelize
- `[USn]` label maps each task to its user story for traceability back to spec.md
- Tests are NOT included; add with `/speckit-tasks --tdd` if TDD is desired
- Each user story phase ends with a **Checkpoint** — validate the story independently before proceeding
- Admin seed credentials (`admin`/`admin123`) MUST be changed before any production deployment
- Tailwind + MUI coexistence: `important: '#root'` in `tailwind.config.js` is mandatory (research.md decision #3)
