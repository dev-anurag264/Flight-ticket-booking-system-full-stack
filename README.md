# Flight Ticket Booking & Distributed Seat Reservation System

A flight reservation and booking platform built as a deep dive into production-grade backend architecture — not a CRUD tutorial project. AeroBook exists to explore, in a real codebase, the problems that actually separate junior from senior backend work: concurrency correctness, stateless authentication and authorization, clean architectural boundaries, and payment/booking consistency — introduced only when a genuine problem in the domain justifies them, never for their own sake.

## Tech Stack

**Backend:** Java 17, Spring Boot, Spring Security, JWT (stateless auth), Spring Data JPA / Hibernate, PostgreSQL, Maven, Lombok, Bean Validation, OpenAPI/Swagger, JUnit 5 + Mockito + Testcontainers

**Frontend:** React, Vite, Axios, React Router, Tailwind CSS, React Hook Form + Zod

**Tools Used for tackling real world issue:** Redis, Kafka, Bucket4j, Docker, Spring Cloud Gateway, Resilience4j, Prometheus, Grafana, OpenTelemetry, AWS

## Architecture

This project is built as a **modular monolith** .A single deployable application with clean internal boundaries, deliberately *not* microservices from day one. The reasoning: a modular monolith forces good separation of concerns before paying the operational cost of distributed systems, and any future service extraction  should be justified by a real scaling or team-ownership problem, not adopted because "microservices" looks impressive on paper.

```
React (Vite) SPA — Axios + JWT
        │  HTTPS / REST (JSON)
        ▼
Spring Boot Application
  Security (stateless JWT filter, role-based access)
  Controller → Service → Repository (layered, not feature-scattered)
  PostgreSQL
```

**Package structure is layer-based** (`controller/`, `service/`, `repository/`, `dto/`, `entity/`, `mapper/`), a deliberate choice over feature-based packaging for a project at this scale — it keeps all controllers, all entities, etc. visible at a glance, at the cost of relying on naming conventions rather than folder boundaries to signal feature ownership. That trade-off is a conscious one, not an oversight.

## Key Design Decisions

- **Stateless JWT authentication** — no server-side session state, so the app can scale horizontally without sticky sessions or a shared session store. The trade-off (no instant token revocation) is accepted deliberately for this phase, with short expiry as the current mitigation.
- **DTOs everywhere, no entity ever crosses the API boundary** — decouples the persistence model from the API contract; a schema change never silently breaks a client.
- **Role-based authorization differentiated by HTTP method, not URL prefix** — `GET /api/flights` is public, `POST/PUT/DELETE` on the same resource require `ROLE_ADMIN`. Keeps one clean URL per resource instead of parallel `/admin/...` routes.
- **Optimistic locking for seat concurrency** (`@Version`) rather than pessimistic locking — seat contention is the rare case, not the common one, so a zero-cost-until-conflict strategy beats one that pays a blocking cost on every request.
- **BigDecimal for all monetary values**, never floating point — exact decimal arithmetic is non-negotiable for currency.
- **Cross-field validation via Bean Validation's `@AssertTrue`** (e.g., a flight's origin and destination airports must differ) rather than ad-hoc service-layer checks scattered across the codebase.

## Testing Strategy

Every feature ships with three testing layers, applied in order of increasing cost:

1. **Unit tests** (JUnit + Mockito) — service-layer business logic, fully mocked dependencies, no Spring context.
2. **Slice tests** (`@WebMvcTest`) — HTTP layer correctness (status codes, validation, JSON shape, role-based authorization), service mocked out.
3. **Integration tests** (`@SpringBootTest` + Testcontainers) — real Spring wiring against a real, ephemeral PostgreSQL container, reserved for behavior the first two layers structurally cannot verify (real unique constraints, the full security filter chain).

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| 1 | Authentication (JWT, roles, protected routes) |
| 2 | Airport & Flight management, customer search | 
| 3 | Seat inventory, concurrency-safe reservation | 
| 4 | Temporary seat hold state machine | Planned |
| 5 | Booking, PNR, cancellation | Planned |
| 6 | Simulated payment, idempotency | Planned |
| 7 | Notifications (simulated) | Planned |
| 8 | Redis (caching, holds, rate limiting) | Planned |
| 9 | Rate limiting (Bucket4j) | Planned |
| 10 | Kafka (event-driven workflows) | Planned |
| 11 | Transactional Outbox pattern | Planned |
| 12 | Microservices extraction (only if justified) | Planned |
| 13 | API Gateway | Planned |
| 14 | Resilience (timeout, retry, circuit breaker) | Planned |
| 15 | Docker & AWS deployment | Planned |
| 16 | Observability (Prometheus, Grafana, OpenTelemetry) | Planned |

## Project Structure

```
flightbooking/
├── backend/                  # Spring Boot (Maven)
│   └── src/main/java/com/coffeeandcoding/
│       ├── config/            # Security, CORS, OpenAPI config
│       ├── security/           # JWT filter, JwtService, UserDetailsService
│       ├── common/exception/    # GlobalExceptionHandler, ApiException
│       ├── entity/              # JPA entities
│       ├── repository/           # Spring Data JPA repositories
│       ├── dto/                   # Request/response contracts
│       ├── mapper/                 # Entity ↔ DTO translation
│       ├── service/                 # Business logic
│       └── controller/               # REST endpoints
├── frontend/                  # React + Vite
│   └── src/
│       ├── api/                # Axios client + per-resource API modules
│       ├── auth/                # AuthContext, ProtectedRoute
│       ├── pages/                 # auth/, admin/, customer/
│       ├── layouts/
│       └── router/
└── README.md
```

## Running Locally

**Backend**
```bash
cd backend
mvn spring-boot:run
```
Requires a running PostgreSQL instance and `JWT_SECRET` set as an environment variable (see `application.yml`).

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

API documentation is available via Swagger UI at `/swagger-ui.html` once the backend is running.

## Known Simplifications (documented deliberately, not accidentally)

- Flights are currently modeled as standalone rows rather than generated instances of a recurring `FlightSchedule` template, a real airline system would separate "the 2pm Kolkata–Bengaluru service" (a schedule) from "that service on October 15th" (an instance). This was a conscious scope decision to keep Phase 2 focused on CRUD + search fundamentals before introducing that modeling complexity.
- No airline/carrier entity yet — flight numbers don't yet encode a proper IATA carrier code. Flagged as a follow-up once the domain model needs it.
- Admin accounts are currently seeded manually (direct DB update) rather than through a dedicated admin-provisioning flow.

