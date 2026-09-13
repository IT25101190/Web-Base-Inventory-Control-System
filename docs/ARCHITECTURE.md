# NovaMart Inventory Control System — Module 1: Business Management Architecture

## Architecture Diagram (Unified Spring Boot Backend)

```
                              +---------------------------------------+
                              |         React + Vite Frontend         |
                              |       (TypeScript / Port 5173)        |
                              +-------------------+-------------------+
                                                  |
                                                  | (REST APIs / Axios)
                                                  v
                              +---------------------------------------+
                              |         Spring Boot Backend           |
                              |       (Java 17 / Port 8080)           |
                              |                                       |
                              | • Business Management & Dashboard     |
                              | • User & RBAC Management              |
                              | • Audit Trail & Compliance            |
                              | • Decision Support Intelligence       |
                              | • Authentication Service (/api/auth)  |
                              | • Alert Notifications Engine          |
                              +-------------------+-------------------+
                                                  |
                                                  | (Spring Data JPA / JDBC)
                                                  v
                              +---------------------------------------+
                              |       Microsoft SQL Server 2022       |
                              |        (NovaMartInventoryDB)          |
                              |                                       |
                              | • Users, Roles, UserRoles             |
                              | • AuditLogs, KpiSnapshots             |
                              | • Stored Procedures: KPIs & Audit     |
                              +---------------------------------------+
```

## Module Scope
- **Repository Branch**: `business-management`
- **Module**: Module 1 — Business Management & Decision Support
- **Lead Component**: Executive Dashboard, Access Control (RBAC), Audit Trail, Decision Intelligence, and Unified JWT Authentication.
