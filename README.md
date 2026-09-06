# ✈️ AeroLock

### High-Concurrency, Event-Driven Flight Reservation & Transaction Platform

> **AeroLock** is a production-inspired flight reservation platform designed to model real-world backend and distributed-system challenges such as concurrent seat allocation, transactional booking workflows, payment consistency, distributed locking, asynchronous event processing, and fault-tolerant service communication.

---

## 📌 Overview

AeroLock is an end-to-end flight booking platform built with a focus on **backend engineering, concurrency, distributed transactions, event-driven architecture, and scalability** rather than simple CRUD operations.

The platform supports the complete reservation lifecycle:

```text
Search Flight
     ↓
Select Flight
     ↓
Select Seat
     ↓
Temporarily Lock Seat
     ↓
Create Booking
     ↓
Process Payment
     ↓
Confirm Booking
     ↓
Generate Ticket
     ↓
Send Notification
```

The system is designed to address challenging scenarios such as:

- Multiple users attempting to book the same seat
- Payment failures after seat reservation
- Duplicate payment requests
- Temporary seat holds and expiration
- Cross-service transaction consistency
- Asynchronous event processing
- Service failures and retries
- Cache consistency
- Secure API access

---

# 🏗️ System Architecture

AeroLock follows a **microservices-oriented, event-driven architecture** where business capabilities are separated into independently deployable services.

```text
                         ┌─────────────────────┐
                         │   Web / Mobile App  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     API Gateway     │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
      │ Auth / User │       │   Flight    │       │  Inventory  │
      │   Service   │       │   Service   │       │   Service   │
      └─────────────┘       └─────────────┘       └──────┬──────┘
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │   Booking   │
                                                  │   Service   │
                                                  └──────┬──────┘
                                                         │
                             ┌───────────────────────────┼──────────────────────┐
                             │                           │                      │
                             ▼                           ▼                      ▼
                      ┌─────────────┐             ┌─────────────┐       ┌─────────────┐
                      │   Payment   │             │   Ticket    │       │Notification │
                      │   Service   │             │   Service   │       │   Service   │
                      └─────────────┘             └─────────────┘       └─────────────┘

                             ┌────────────────────────────────────┐
                             │               Kafka                │
                             │        Event Streaming Bus         │
                             └────────────────────────────────────┘

                  ┌──────────────────────┐       ┌──────────────────────┐
                  │      PostgreSQL      │       │        Redis         │
                  │   Persistent Data    │       │ Cache + Seat Locks   │
                  └──────────────────────┘       └──────────────────────┘
```

---

# 🧩 Microservices

| Service | Responsibility |
|---|---|
| **API Gateway** | Routing, authentication filters, centralized entry point |
| **Auth/User Service** | Registration, login, JWT, roles, user profiles |
| **Flight Service** | Flights, airports, aircraft, schedules, fares |
| **Inventory Service** | Seat inventory, availability, seat locking/release |
| **Booking Service** | Booking lifecycle, PNR, passengers, cancellation |
| **Payment Service** | Payment processing, status, refunds |
| **Ticket Service** | Ticket and e-ticket generation |
| **Notification Service** | Booking, payment and cancellation notifications |

Each service follows clear **bounded responsibilities** and owns its business logic.

---

# 🔐 Concurrent Seat Reservation

One of the primary engineering challenges is preventing **double booking under concurrent requests**.

Consider two users attempting to reserve the same seat:

```text
                    Flight 6E-201
                         │
                       Seat 12A
                         │
              ┌──────────┴──────────┐
              │                     │
           User A                User B
              │                     │
           Request                 Request
              │                     │
              └──────────┬──────────┘
                         ▼
                 Concurrency Control
                         │
                  ┌──────┴──────┐
                  │             │
               Success         Reject
                  │             │
               User A          User B
```

The reservation workflow must guarantee:

> **One flight seat can have at most one confirmed booking.**

Potential mechanisms used by the system include:

- Optimistic locking
- Pessimistic database locking
- Redis distributed locking
- Database unique constraints
- Transactional boundaries

The exact mechanism depends on the reservation operation and consistency requirements.

---

# 🔒 Temporary Seat Locking

A seat should not remain permanently unavailable when a user abandons the payment process.

A temporary reservation can be represented as:

```text
User selects Seat
       ↓
Acquire Seat Lock
       ↓
TTL / Expiration Window
       ↓
 ┌─────┴─────┐
 │           │
 ▼           ▼
Payment     Timeout
Success       │
 │            ▼
 ▼        Release Seat
Confirm
Booking
```

Redis can be used to maintain short-lived seat locks with expiration.

Example conceptual key:

```text
seat:{flightId}:{seatNumber}
```

---

# 🔄 Distributed Booking Transaction

A flight booking spans multiple business operations and potentially multiple services.

```text
Create Booking
      ↓
Reserve Seat
      ↓
Initiate Payment
      ↓
Payment Successful
      ↓
Confirm Booking
      ↓
Generate Ticket
      ↓
Send Notification
```

A failure may require compensating actions:

```text
Reserve Seat
      ↓
Process Payment
      ↓
   PAYMENT FAILED
      ↓
Release Seat
      ↓
Cancel / Expire Booking
```

AeroLock uses the **Saga Pattern** to model distributed business transactions without requiring a single distributed database transaction.

---

# 🔄 Saga Pattern

The booking workflow can be represented as a Saga:

```text
                     Booking Saga
                          │
                          ▼
                   Create Booking
                          │
                          ▼
                     Lock Seat
                          │
                          ▼
                   Process Payment
                    /           \
                   /             \
              Success           Failure
                 │                 │
                 ▼                 ▼
          Confirm Booking      Release Seat
                 │                 │
                 ▼                 ▼
          Generate Ticket    Cancel Booking
                 │
                 ▼
          Send Notification
```

Each service manages its own local transaction and participates in the overall business workflow through commands and events.

---

# 📨 Event-Driven Architecture

Apache Kafka is used for asynchronous communication between services.

Example:

```text
                    Booking Service
                           │
                           │ BookingConfirmed
                           ▼
                         Kafka
                    ┌──────┼──────┐
                    │      │      │
                    ▼      ▼      ▼
                 Ticket  Notification
                 Service    Service
```

### Domain Events

```text
BookingCreated
SeatLocked
SeatReleased
PaymentInitiated
PaymentCompleted
PaymentFailed
BookingConfirmed
BookingCancelled
TicketGenerated
NotificationRequested
```

Event-driven communication helps reduce synchronous coupling between services and allows independent consumers to react to domain events.

---

# ⚡ Redis

Redis is used for low-latency operations such as:

### Flight Search Caching

```text
Client
  │
  ▼
Flight Search API
  │
  ▼
Redis
  │
  ├── Cache Hit ──► Return Result
  │
  └── Cache Miss ──► PostgreSQL
                         │
                         ▼
                     Update Cache
```

### Temporary Seat Locks

```text
Seat Selection
      ↓
Redis Lock
      ↓
Expiration / TTL
      ↓
 ┌────┴─────┐
 │          │
 ▼          ▼
Payment    Timeout
Success      │
 │           ▼
 ▼       Release Lock
Confirm
Booking
```

Redis is therefore used for both **performance optimization** and **short-lived reservation state**, rather than being treated as the primary persistent database.

---

# 💳 Payment Processing

The payment subsystem is designed around abstractions so that the core booking workflow does not depend directly on a particular payment provider.

```text
                 Payment Service
                        │
                        ▼
                 Payment Strategy
                /       |        \
               /        |         \
              ▼         ▼          ▼
           Card        UPI       Wallet
          Payment     Payment     Payment
```

External providers can be integrated through adapters:

```text
Application
     │
     ▼
Payment Gateway
     │
     ├── Razorpay Adapter
     ├── Stripe Adapter
     └── Mock Payment Adapter
```

This keeps external provider-specific logic isolated from the core domain logic.

---

# 🔁 Idempotency

Payment and booking APIs must be safe against duplicate requests caused by retries, network failures, or client resubmission.

Example:

```http
POST /api/v1/payments

Idempotency-Key: abc123
```

First request:

```text
Request
  ↓
Payment Service
  ↓
Create Payment
```

Retry with the same key:

```text
Request
  ↓
Payment Service
  ↓
Existing Transaction
  ↓
Return Existing Result
```

This prevents accidental duplicate payment processing.

---

# 🔐 Security

AeroLock uses **Spring Security** for API authentication and authorization.

### Authentication Flow

```text
Username / Password
        ↓
Authentication
        ↓
JWT Access Token
        ↓
Authenticated API Request
        ↓
JWT Validation
        ↓
Authorization
```

### Security Features

- JWT authentication
- BCrypt password hashing
- Role-based access control
- Stateless authentication
- Authentication filters
- Request validation
- Secure API endpoints
- Centralized exception handling

Example roles:

```text
PASSENGER
ADMIN
```

---

# ✈️ Core Features

## Passenger Features

- User registration and login
- JWT authentication
- Flight search
- Flight filtering and sorting
- Flight details
- Seat availability
- Seat selection
- Temporary seat reservation
- Booking creation
- Multiple passenger support
- Payment processing
- Ticket generation
- Booking history
- Booking cancellation
- Refund processing
- Notifications

## Administrative Features

- Airport management
- Aircraft management
- Aircraft seat configuration
- Flight management
- Flight scheduling
- Fare management
- Flight status management
- Inventory management
- Booking management

---

# 🔎 Flight Search

The search API supports:

- Origin and destination
- Departure date
- Passenger count
- Cabin class
- Price filtering
- Duration filtering
- Departure-time filtering
- Sorting
- Pagination

Example:

```http
GET /api/v1/flights/search
```

Example query:

```text
origin=DEL
destination=BLR
departureDate=2026-10-15
passengers=2
cabinClass=ECONOMY
```

Frequently accessed search results can be cached using Redis.

---

# 💺 Flight Inventory Model

AeroLock separates static aircraft configuration from flight-specific inventory.

```text
Aircraft
   │
   └── Seat Configuration
             │
             ▼
           Flight
             │
             ▼
       Flight Inventory
             │
             ▼
        Seat Status
```

This allows the same aircraft configuration to be reused across different flights while maintaining independent seat availability for every flight.

---

# 🗃️ Data Model

Core entities include:

```text
User
Airport
Aircraft
AircraftSeat
Flight
FlightSeat
Fare
Booking
BookingPassenger
Payment
Refund
Ticket
```

High-level relationships:

```text
User
 │
 └──────────► Booking
                 │
                 ├────────► Passenger
                 │
                 ├────────► Payment
                 │
                 └────────► Ticket

Airport ───────► Flight ◄────── Aircraft
                   │
                   ▼
              FlightSeat
```

---

# 📡 REST API

## Authentication

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
```

## Flights

```text
GET    /api/v1/flights/search
GET    /api/v1/flights/{id}
```

## Bookings

```text
POST   /api/v1/bookings
GET    /api/v1/bookings/{id}
GET    /api/v1/bookings/user/{userId}
POST   /api/v1/bookings/{id}/cancel
```

## Payments

```text
POST   /api/v1/payments
GET    /api/v1/payments/{id}
POST   /api/v1/payments/{id}/refund
```

## Tickets

```text
GET    /api/v1/tickets/{id}
```

## Administration

```text
POST   /api/v1/admin/flights
PUT    /api/v1/admin/flights/{id}
DELETE /api/v1/admin/flights/{id}

POST   /api/v1/admin/aircraft
POST   /api/v1/admin/airports
```

---

# 🧩 Design Patterns

AeroLock applies design patterns where they provide practical architectural value.

| Pattern | Application |
|---|---|
| **Strategy Pattern** | Payment and processing strategies |
| **Factory Pattern** | Creation of payment/notification processors |
| **Builder Pattern** | Construction of complex domain/request objects |
| **Adapter Pattern** | External payment provider integration |
| **Facade Pattern** | Simplification of complex booking workflows |
| **Repository Pattern** | Persistence abstraction |
| **Observer / Event-Driven Pattern** | Kafka-based domain events |
| **Saga Pattern** | Distributed transaction management |

---

# 🧪 Testing Strategy

Testing is performed at multiple levels.

### Unit Testing

- JUnit 5
- Mockito

### Integration Testing

- Spring Boot Test
- Testcontainers
- PostgreSQL
- Redis
- Kafka

### API Testing

- Postman
- OpenAPI / Swagger

### Critical Test Scenarios

```text
✓ Successful booking
✓ Concurrent seat booking
✓ Seat already locked
✓ Seat lock expiration
✓ Payment failure
✓ Duplicate payment request
✓ Booking cancellation
✓ Refund processing
✓ Invalid JWT
✓ Unauthorized API access
✓ Invalid booking state
✓ Kafka event processing
```

---

# 🐳 Containerization

Application services and supporting infrastructure can be containerized using Docker.

```text
Docker Compose
     │
     ├── API Gateway
     ├── Auth Service
     ├── Flight Service
     ├── Inventory Service
     ├── Booking Service
     ├── Payment Service
     ├── Ticket Service
     ├── Notification Service
     │
     ├── PostgreSQL
     ├── Redis
     └── Kafka
```

---

# 🔄 CI/CD

The project is designed for automated build, test, analysis, and deployment workflows.

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub
    │
    ▼
CI Pipeline
    │
    ├── Compile
    ├── Unit Tests
    ├── Integration Tests
    ├── Static Analysis
    ├── Docker Build
    │
    ▼
Docker Image
    │
    ▼
Deployment
```

Potential tooling:

- Git
- GitHub
- Jenkins
- GitHub Actions
- Docker
- SonarQube

---

# 📊 Observability

The system is designed to support production-style observability.

Potential components:

- Spring Boot Actuator
- Micrometer
- Prometheus
- Grafana
- Structured logging
- Correlation IDs
- Distributed tracing

Example request flow:

```text
Client
  │
  ▼
API Gateway
  │
  ▼
Booking Service
  │
  ▼
Payment Service
  │
  ▼
Kafka
  │
  ▼
Notification Service
```

Correlation IDs can be propagated across services to trace a request through the distributed workflow.

---

# 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Language | Java |
| Framework | Spring Boot |
| Security | Spring Security, JWT |
| API | REST, JSON, OpenAPI |
| ORM | Hibernate, Spring Data JPA |
| Database | PostgreSQL |
| Cache / Locking | Redis |
| Messaging | Apache Kafka |
| Testing | JUnit 5, Mockito, Testcontainers |
| Containerization | Docker, Docker Compose |
| CI/CD | Jenkins, GitHub Actions |
| Code Quality | SonarQube |
| Cloud | AWS |
| Monitoring | Actuator, Prometheus, Grafana |
| Version Control | Git, GitHub |

---

# 📁 Project Structure

```text
aerolock/
│
├── api-gateway/
│
├── auth-service/
│
├── flight-service/
│
├── inventory-service/
│
├── booking-service/
│
├── payment-service/
│
├── ticket-service/
│
├── notification-service/
│
├── infrastructure/
│   ├── docker/
│   └── docker-compose.yml
│
├── docs/
│   ├── architecture/
│   ├── database/
│   └── api/
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

```text
Java 21+
Maven
Docker
Docker Compose
Git
```

## Clone Repository

```bash
git clone https://github.com/<your-username>/aerolock.git

cd aerolock
```

## Start Infrastructure

```bash
docker compose up -d
```

## Build

```bash
mvn clean install
```

Start the required Spring Boot services according to the provided configuration.

---

# ⚙️ Configuration

Sensitive configuration should be supplied through environment variables or a secrets-management solution rather than committed to source control.

Example:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD

REDIS_HOST
REDIS_PORT

KAFKA_BOOTSTRAP_SERVERS

JWT_SECRET

PAYMENT_API_KEY
```

---

# 🧠 Engineering Highlights

AeroLock focuses on solving practical backend and distributed-system problems:

- High-concurrency seat allocation
- Race-condition prevention
- Distributed locking
- Transaction boundaries
- Distributed transaction management
- Saga orchestration
- Event-driven architecture
- Asynchronous processing
- Idempotent APIs
- Redis caching
- Kafka event streaming
- Database indexing
- Optimistic and pessimistic locking
- Fault handling and retries
- Authentication and authorization
- Containerized deployment
- CI/CD automation
- Observability and distributed tracing

---

# 📈 Future Improvements

- Dynamic fare pricing
- Multi-airline support
- Waitlist management
- Loyalty/reward system
- Advanced flight recommendation engine
- API rate limiting
- Circuit breaker with Resilience4j
- Dead-letter Kafka topics
- OpenTelemetry-based distributed tracing
- Kubernetes deployment
- Horizontal service autoscaling
- Real-time flight status updates

---

# 🎯 Project Objective

AeroLock is intentionally designed beyond a traditional CRUD application.

The primary engineering focus is:

```text
Concurrency
     ↓
Consistency
     ↓
Transactions
     ↓
Events
     ↓
Failure Handling
     ↓
Scalability
```

The project aims to demonstrate how a real-world reservation platform can maintain **correctness under concurrent traffic while coordinating distributed business workflows across multiple services**.

---

## 👨‍💻 Author

**Anurag Prasad**

Java Backend / Full Stack Developer

**Core Technologies:** Java • Spring Boot • Microservices • PostgreSQL • Redis • Kafka • Docker • AWS
