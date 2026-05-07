# Data Model: Pet E-Commerce Site

**Branch**: `001-pet-ecommerce-site` | **Date**: 2026-05-07
**Phase**: 1 — Design

---

## Entities

### 1. Pet

Represents a pet available for purchase in the store.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `BIGSERIAL` | PRIMARY KEY | Auto-generated |
| `name` | `VARCHAR(100)` | NOT NULL | Pet's display name |
| `species` | `VARCHAR(50)` | NOT NULL | e.g., Dog, Cat, Bird, Fish |
| `breed` | `VARCHAR(100)` | NOT NULL | Specific breed name |
| `age_months` | `INTEGER` | NOT NULL, ≥ 0 | Age expressed in months |
| `price` | `NUMERIC(10,2)` | NOT NULL, > 0 | Listing price in USD |
| `availability_status` | `VARCHAR(20)` | NOT NULL, DEFAULT 'AVAILABLE' | AVAILABLE \| SOLD \| RESERVED |
| `photo_url` | `VARCHAR(500)` | NULLABLE | URL to pet photo; placeholder used if null |
| `description` | `TEXT` | NULLABLE | Optional long description |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | NOT NULL, DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP WITH TIME ZONE` | NULLABLE | Soft-delete timestamp; NULL = active |

**Indexes**:
- `idx_pets_species` on `species` (for filter queries)
- `idx_pets_breed` on `breed` (for filter queries)
- `idx_pets_deleted_at` on `deleted_at` (for soft-delete filtering)
- `idx_pets_price` on `price` (for price range sorting/filtering)

**JPA Annotations**:
- `@SQLDelete(sql = "UPDATE pets SET deleted_at = NOW() WHERE id = ?")` — intercepts `delete()` calls
- `@Where(clause = "deleted_at IS NULL")` — applied on public-facing repository queries
- Admin repository bypasses this filter with a custom `@Query`

**Validation Rules**:
- `name`: required, 1–100 characters
- `species`: required, must be one of the allowed enum values
- `breed`: required, 1–100 characters
- `age_months`: required, integer ≥ 0
- `price`: required, decimal > 0.00, max 2 decimal places
- `availability_status`: required, must be AVAILABLE | SOLD | RESERVED
- `photo_url`: optional, must be a valid URL format if provided

---

### 2. Admin User

Represents a privileged user who manages pet listings.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `BIGSERIAL` | PRIMARY KEY | Auto-generated |
| `username` | `VARCHAR(50)` | NOT NULL, UNIQUE | Login identifier |
| `password_hash` | `VARCHAR(255)` | NOT NULL | bcrypt hash (cost ≥ 12) |
| `role` | `VARCHAR(20)` | NOT NULL, DEFAULT 'ADMIN' | ADMIN (extensible) |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | NOT NULL, DEFAULT NOW() | |
| `enabled` | `BOOLEAN` | NOT NULL, DEFAULT TRUE | Allows account deactivation |

**Indexes**:
- `idx_admin_users_username` UNIQUE on `username`

**Security Notes**:
- Passwords MUST be stored as bcrypt hashes (Spring Security `BCryptPasswordEncoder`, cost 12).
- Raw passwords MUST NEVER be logged or returned in API responses.
- Admin accounts are seeded via application startup / Flyway migration for initial setup.

---

## Relationships

```
admin_users  ──(manages)──>  pets
```

No foreign key between `admin_users` and `pets` in v1 (audit trail is out of scope).
If audit is added in v2, a `created_by` FK to `admin_users.id` on `pets` is the natural extension.

---

## Species Enum

Allowed values for `species` (enforced at application layer, stored as VARCHAR for flexibility):

```
DOG | CAT | BIRD | FISH | RABBIT | HAMSTER | REPTILE | OTHER
```

---

## Filter Criteria (Transient — Not Persisted)

Used by the gallery endpoint to construct dynamic queries. Not a database entity.

| Field | Type | Description |
|-------|------|-------------|
| `species` | `String` (optional) | Filter by exact species |
| `breed` | `String` (optional) | Filter by breed (case-insensitive contains) |
| `minAge` | `Integer` (optional) | Minimum age in months (inclusive) |
| `maxAge` | `Integer` (optional) | Maximum age in months (inclusive) |
| `minPrice` | `BigDecimal` (optional) | Minimum price (inclusive) |
| `maxPrice` | `BigDecimal` (optional) | Maximum price (inclusive) |
| `page` | `Integer` (default: 0) | Pagination — zero-indexed page number |
| `size` | `Integer` (default: 20) | Pagination — records per page |
| `sort` | `String` (default: `name,asc`) | Sort field and direction |

---

## Database Schema (SQL)

```sql
CREATE TABLE admin_users (
    id           BIGSERIAL PRIMARY KEY,
    username     VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role         VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    enabled      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE pets (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(100)   NOT NULL,
    species             VARCHAR(50)    NOT NULL,
    breed               VARCHAR(100)   NOT NULL,
    age_months          INTEGER        NOT NULL CHECK (age_months >= 0),
    price               NUMERIC(10,2)  NOT NULL CHECK (price > 0),
    availability_status VARCHAR(20)    NOT NULL DEFAULT 'AVAILABLE',
    photo_url           VARCHAR(500),
    description         TEXT,
    created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_pets_species    ON pets (species);
CREATE INDEX idx_pets_breed      ON pets (breed);
CREATE INDEX idx_pets_deleted_at ON pets (deleted_at);
CREATE INDEX idx_pets_price      ON pets (price);
CREATE INDEX idx_admin_username  ON admin_users (username);
```

---

## State Transitions

### Pet `availability_status`

```
AVAILABLE ──(admin marks sold)──> SOLD
AVAILABLE ──(admin reserves)───> RESERVED
RESERVED  ──(admin confirms)───> SOLD
RESERVED  ──(admin cancels)────> AVAILABLE
SOLD      ──(no transition)────> (terminal state in v1)
```

### Pet Soft-Delete

```
active (deleted_at IS NULL) ──(admin delete)──> soft-deleted (deleted_at = NOW())
```

Soft-deleted pets:
- Hidden from public gallery (WHERE filter)
- Visible to admin with `[DELETED]` status badge
- Cannot be updated (validated at service layer)
