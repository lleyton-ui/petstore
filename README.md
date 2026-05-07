# Pet E-Commerce Site 🐾

A full-stack e-commerce platform for browsing and managing pet listings.

## Tech Stack

- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, PostgreSQL, Flyway, Spring Security (JWT)
- **Frontend**: React 18, Vite, TypeScript, Material UI v5, Tailwind CSS 3, Axios
- **Tooling**: Maven, npm, Docker

## Getting Started

### Prerequisites

- Java 17+
- Node.js 20+
- PostgreSQL database

### Local Setup

1. **Backend**:
   - Create a `.env` file in `backend/` with:
     ```env
     DB_URL=jdbc:postgresql://localhost:5432/petstore
     DB_USERNAME=postgres
     DB_PASSWORD=yourpassword
     JWT_SECRET=your_32_character_long_secret_here
     ```
   - Run: `./mvnw spring-boot:run`

2. **Frontend**:
   - Create a `.env.local` in `frontend/` with:
     ```env
     VITE_API_BASE_URL=http://localhost:8080/api
     ```
   - Run: `npm install` then `npm run dev`

3. **Login**:
   - Use `admin` / `admin123` for the admin panel at `http://localhost:5173/admin/login`.

## Features

- **Public Gallery**: Browse pets with dynamic filtering (species, breed, age, price).
- **Admin Panel**: Secure CRUD management of pet listings with soft-delete support.
- **Responsive Design**: Mobile-friendly UI using Material UI and Tailwind CSS.
- **Secure Auth**: JWT-based authentication for administrative actions.

## Documentation

- [Full Specification](specs/001-pet-ecommerce-site/spec.md)
- [Implementation Plan](specs/001-pet-ecommerce-site/plan.md)
- [API Contracts](specs/001-pet-ecommerce-site/contracts/rest-api.md)
- [Quickstart Guide](specs/001-pet-ecommerce-site/quickstart.md)
