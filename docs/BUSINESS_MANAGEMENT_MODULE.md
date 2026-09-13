# NovaMart Inventory Control System — Module 1: Business Management & Decision Support

## 1. Executive Summary
The **Business Management & Decision Support** module serves as the primary executive hub and administrative foundation for NovaMart Trading (Pvt) Ltd's inventory control system. It equips business owners and directors with real-time operational visibility, aggregated financial valuation of warehouse stock, immutable audit compliance trails, and predictive decision intelligence to mitigate stock-out risks and dead-capital buildup.

---

## 2. Core Functional Capabilities

### 2.1. Executive Real-Time Dashboard & KPIs
- **Aggregated Inventory Valuation**: Live asset calculation based on unit cost and active warehouse quantities:
  $$\text{Total Valuation} = \sum (\text{QuantityOnHand} \times \text{UnitCost})$$
- **Stock Liquidity & Turnover Velocity**: Dynamic tracking of stock turnover ratio (target: $4.0\times+$).
- **Stock-Out Threat Counter**: Instant count of active SKUs breaching their assigned reorder levels.
- **Monthly Revenue & Order Volumes**: Aggregates verified sales orders across fulfillment pipelines.
- **Valuation Breakdown by Category**: Category-level distribution (Electronics, Hardware, Packaging, Stationery, Safety).
- **6-Month Performance Trajectory**: Historical trend comparison of inventory capital vs. sales revenue.

### 2.2. User Account & Access Control Management
- **Full Operator Lifecycle**: Create, update, activate, deactivate, and remove system operator profiles.
- **Role Assignment**: Assign one or multiple system roles based on departmental responsibilities.
- **Password Hashing & Security**: Encrypted credential storage using BCrypt with cryptographic salts.
- **Account Status Guard**: Disabled accounts are instantaneously locked out of both Spring Boot and Node.js microservices.

### 2.3. Role-Based Access Control (RBAC) Matrix
The system recognizes 6 predefined personas corresponding to the 6 group project modules:
1. `BUSINESS_OWNER`: Complete administrative, financial, and executive oversight.
2. `WAREHOUSE_MANAGER`: Physical goods receiving, internal bin transfers, order allocation, and GRN corrections.
3. `STORE_OPERATIONS_SUPERVISOR`: Sales order validation, dispatch scheduling, and customer product returns.
4. `INVENTORY_CLERK`: Item master registry, minimum safety stock maintenance, and replenishment requests.
5. `FINANCE_MANAGER`: Unit purchase costs, total inventory valuation, and supplier payments.
6. `PROCUREMENT_COORDINATOR`: Replenishment review, purchase order lifecycle, and supplier ratings.

### 2.4. Immutable System Audit Trail
- Automated interception and logging of critical operational mutations across all 6 modules.
- Captures: `LogId`, `Timestamp`, `Username`, `ActionCode`, `ModuleName`, `IP_Address`, `PayloadDetails`, and `Severity` (`INFO`, `WARNING`, `ERROR`, `CRITICAL`).
- Multi-parameter filtering with full-text search and **CSV export** for financial auditors.

### 2.5. Automated Decision Intelligence Reports
- Automated generation of monthly executive reports (`DecisionReportDto`).
- Identifies **Critical Stock-Out Risks** with deficit units.
- Surfaces **High-Velocity Fast Moving Items**.
- Flags **Obsolescence & Dead Stock** (capital locked $>90$ days) with markdown clearance recommendations.
- Formulates actionable strategic recommendations for executive approval.

---

## 3. REST API Contract

### Business Dashboard Endpoints
- `GET /api/business/dashboard/kpis`
  - **Description**: Returns consolidated executive KPIs, category valuations, and historical revenue trends.
  - **Auth**: Bearer JWT (`BUSINESS_OWNER`, `FINANCE_MANAGER`).
- `POST /api/business/dashboard/kpis/snapshot`
  - **Description**: Triggers a daily or ad-hoc archival snapshot into `KpiSnapshots`.

### User & Role Management Endpoints
- `GET /api/business/users?search=&isActive=&page=0&size=10`
  - **Description**: Returns paginated list of system operators.
- `GET /api/business/users/{id}`
  - **Description**: Returns detailed operator profile.
- `POST /api/business/users`
  - **Payload**: `{ "username": "kasun.p", "password": "...", "fullName": "Kasun Perera", "email": "kasun@novamart.lk", "phoneNumber": "+9477...", "roles": ["WAREHOUSE_MANAGER"] }`
  - **Response**: `201 Created` with created `UserDto`.
- `PUT /api/business/users/{id}`
  - **Description**: Modifies operator details, roles, or resets password.
- `PATCH /api/business/users/{id}/status?active={true|false}`
  - **Description**: Toggles operator active/disabled status.
- `DELETE /api/business/users/{id}`
  - **Description**: Permanently deletes an operator account (audited as `CRITICAL`).
- `GET /api/business/roles`
  - **Description**: Lists all 6 operational roles with descriptions.

### Audit & Compliance Endpoints
- `GET /api/business/audit-logs?moduleName=&action=&username=&severity=&page=0&size=15`
  - **Description**: Returns paginated and filtered system audit records.
- `GET /api/business/audit-logs/recent`
  - **Description**: Returns latest 10 transactional activities for live dashboard feeds.

### Decision Intelligence Endpoints
- `GET /api/business/decision-reports/current`
  - **Description**: Returns stock health score, stock-out threat matrix, and actionable strategic directives.

---

## 4. MSSQL Database Design & Stored Procedures

### Tables Owned by Module 1:
- `dbo.Roles` (`RoleId`, `RoleName`, `Description`, `CreatedAt`)
- `dbo.Users` (`UserId`, `Username`, `PasswordHash`, `FullName`, `Email`, `PhoneNumber`, `IsActive`, `CreatedAt`, `UpdatedAt`, `LastLoginAt`)
- `dbo.UserRoles` (`UserId`, `RoleId`, `AssignedAt`)
- `dbo.AuditLogs` (`LogId`, `UserId`, `Username`, `Action`, `ModuleName`, `IpAddress`, `Details`, `Severity`, `CreatedAt`)
- `dbo.KpiSnapshots` (`SnapshotId`, `SnapshotDate`, `TotalInventoryValue`, `TotalItemsCount`, `LowStockCount`, `ActiveOrdersCount`, `MonthlyRevenue`, `InventoryTurnoverRatio`, `GeneratedAt`)

### Stored Procedures:
- `dbo.sp_GetBusinessKPIs`: Aggregates active items, stock deficits, order totals, and calculates live inventory asset value in a single atomic query.
- `dbo.sp_GetUserAuditTrail`: Delivers indexed, offset-paginated audit trail data with dynamic SQL filtering.

---

## 5. Security & Authentication Architecture
- **JWT Issuance**: Authenticated via Node.js secondary service (`/api/auth/login`), signed with shared HMAC-SHA256 secret.
- **Cross-Service Validation**: Spring Boot inspects incoming `Authorization: Bearer <token>` using `JwtAuthenticationFilter`, verifies signature, and populates `SecurityContextHolder` with `ROLE_<ROLE_NAME>` authorities.
