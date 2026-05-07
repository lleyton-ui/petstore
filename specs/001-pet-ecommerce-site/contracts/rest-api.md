# API Contracts: Pet E-Commerce Site

**Branch**: `001-pet-ecommerce-site` | **Date**: 2026-05-07
**Phase**: 1 — Design
**Base URL**: `http://localhost:8080/api` (dev) | configured via `API_BASE_URL` env var (prod)

---

## Authentication

All admin endpoints require a Bearer JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Public endpoints (gallery) require **no authentication**.

---

## Auth Endpoints

### POST /api/auth/login

Authenticate an admin user and receive a JWT.

**Request**:
```json
{
  "username": "admin",
  "password": "s3cr3t"
}
```

**Response 200 OK**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

**Response 401 Unauthorized**:
```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Username or password is incorrect."
}
```

---

## Public Pet Endpoints (No Auth Required)

### GET /api/pets

Retrieve a paginated, filtered list of active pet listings for the public gallery.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `species` | string | No | Filter by species (e.g., `DOG`, `CAT`) |
| `breed` | string | No | Filter by breed (case-insensitive contains) |
| `minAge` | integer | No | Minimum age in months (inclusive) |
| `maxAge` | integer | No | Maximum age in months (inclusive) |
| `minPrice` | decimal | No | Minimum price (inclusive) |
| `maxPrice` | decimal | No | Maximum price (inclusive) |
| `page` | integer | No | Zero-indexed page number (default: `0`) |
| `size` | integer | No | Records per page (default: `20`, max: `100`) |
| `sort` | string | No | Sort field + direction (default: `name,asc`) |

**Response 200 OK**:
```json
{
  "content": [
    {
      "id": 1,
      "name": "Buddy",
      "species": "DOG",
      "breed": "Golden Retriever",
      "ageMonths": 18,
      "price": 850.00,
      "availabilityStatus": "AVAILABLE",
      "photoUrl": "https://storage.example.com/pets/buddy.jpg",
      "description": "Friendly and playful male golden retriever."
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 42,
  "totalPages": 3
}
```

**Response 400 Bad Request** (invalid filter params):
```json
{
  "error": "VALIDATION_ERROR",
  "message": "minPrice must be a positive number.",
  "field": "minPrice"
}
```

---

### GET /api/pets/{id}

Retrieve the full profile of a single active pet.

**Path Parameters**: `id` — pet ID (long)

**Response 200 OK**:
```json
{
  "id": 1,
  "name": "Buddy",
  "species": "DOG",
  "breed": "Golden Retriever",
  "ageMonths": 18,
  "price": 850.00,
  "availabilityStatus": "AVAILABLE",
  "photoUrl": "https://storage.example.com/pets/buddy.jpg",
  "description": "Friendly and playful male golden retriever.",
  "createdAt": "2026-05-01T08:00:00Z",
  "updatedAt": "2026-05-05T14:30:00Z"
}
```

**Response 404 Not Found**:
```json
{
  "error": "PET_NOT_FOUND",
  "message": "Pet with id 1 not found."
}
```

---

## Admin Pet Endpoints (Auth Required)

### GET /api/admin/pets

Retrieve all pet listings including soft-deleted records (admin view).

**Query Parameters**: Same as public `GET /api/pets` plus:

| Parameter | Type | Description |
|-----------|------|-------------|
| `includeDeleted` | boolean | If `true`, include soft-deleted records (default: `true` for admin) |

**Response 200 OK**: Same pagination structure as public endpoint, with additional `deletedAt` field:
```json
{
  "content": [
    {
      "id": 2,
      "name": "Whiskers",
      "species": "CAT",
      "breed": "Persian",
      "ageMonths": 6,
      "price": 450.00,
      "availabilityStatus": "AVAILABLE",
      "photoUrl": null,
      "description": null,
      "createdAt": "2026-04-20T10:00:00Z",
      "updatedAt": "2026-04-20T10:00:00Z",
      "deletedAt": null
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 10,
  "totalPages": 1
}
```

---

### POST /api/admin/pets

Create a new pet listing.

**Request Body**:
```json
{
  "name": "Buddy",
  "species": "DOG",
  "breed": "Golden Retriever",
  "ageMonths": 18,
  "price": 850.00,
  "availabilityStatus": "AVAILABLE",
  "photoUrl": "https://storage.example.com/pets/buddy.jpg",
  "description": "Friendly and playful male golden retriever."
}
```

**Response 201 Created**:
```json
{
  "id": 1,
  "name": "Buddy",
  "species": "DOG",
  "breed": "Golden Retriever",
  "ageMonths": 18,
  "price": 850.00,
  "availabilityStatus": "AVAILABLE",
  "photoUrl": "https://storage.example.com/pets/buddy.jpg",
  "description": "Friendly and playful male golden retriever.",
  "createdAt": "2026-05-07T12:00:00Z",
  "updatedAt": "2026-05-07T12:00:00Z",
  "deletedAt": null
}
```

**Response 400 Bad Request** (validation error):
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "violations": [
    { "field": "name", "message": "name is required" },
    { "field": "price", "message": "price must be greater than 0" }
  ]
}
```

**Response 401 Unauthorized**: Missing or invalid token.

---

### PUT /api/admin/pets/{id}

Update all fields of an existing pet listing (full replacement).

**Path Parameters**: `id` — pet ID (long)

**Request Body**: Same structure as `POST /api/admin/pets`.

**Response 200 OK**: Updated pet object (same as POST 201 response).

**Response 404 Not Found**: Pet not found or already soft-deleted.

**Response 400 Bad Request**: Validation errors (same structure as POST 400).

---

### DELETE /api/admin/pets/{id}

Soft-delete a pet listing. Sets `deleted_at` to current timestamp.

**Path Parameters**: `id` — pet ID (long)

**Response 204 No Content**: Deletion successful.

**Response 404 Not Found**: Pet not found or already deleted.

---

## Error Response Format (Standard)

All error responses follow this envelope:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description.",
  "timestamp": "2026-05-07T12:00:00Z",
  "path": "/api/admin/pets/999"
}
```

| HTTP Status | Error Code | Meaning |
|-------------|------------|---------|
| 400 | `VALIDATION_ERROR` | Request body or query params failed validation |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT token |
| 403 | `FORBIDDEN` | Authenticated but insufficient permissions |
| 404 | `PET_NOT_FOUND` | Resource does not exist or is soft-deleted |
| 409 | `CONFLICT` | Concurrent modification detected |
| 500 | `INTERNAL_ERROR` | Unexpected server error |
