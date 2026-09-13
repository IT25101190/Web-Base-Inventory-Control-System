# NovaMart Web-Based Inventory Control System
## Module 1: Business Management & Decision Support

Enterprise Business Management, Decision Intelligence, and RBAC Administrative platform for **NovaMart Trading (Pvt) Ltd**.

---

## Repository Structure

```
Web-Base-Inventory-Control-System/
├── backend-springboot/   # Unified Core Backend (Java 17 / Spring Boot 3 / Port 8080)
│   ├── src/main/java/com/novamart/inventory/
│   │   ├── businessmanagement/   # Executive Dashboard, User/RBAC Mgmt, Audit Trail, Decision Reports, Auth
│   │   └── common/               # JWT Security, Global Exceptions, DTOs & Config
├── frontend/             # Single-Page Web Application (React / TypeScript / Vite / Port 5173)
│   ├── src/
│   │   ├── modules/business-management/ # Dashboard, Users, Roles, Audit Logs, Decision Reports
│   │   ├── pages/                       # Login Page
│   │   └── shared/                      # Auth Context, Axios API Clients, Top Navbar, Sidebar
├── database/             # MSSQL Table schemas, relationships, seed data & stored procedures
├── docs/                 # Architecture diagrams and module specifications
└── README.md             # Project documentation and run instructions
```

---

## Prerequisites

1. **Java JDK 17+** and **Apache Maven 3.8+** (or IntelliJ IDEA with bundled Maven)
2. **Node.js (v18+)** and **npm (v9+)** for frontend
3. **Microsoft SQL Server (MSSQL 2019 / 2022 / Express)** running on default port `1433`

---

## 1. Database Setup (MSSQL)

Run the SQL scripts located in the `database/` directory in this sequence using **SQL Server Management Studio (SSMS)** or `sqlcmd`:

1. `database/schema/01_create_tables.sql` — Creates `NovaMartInventoryDB` database and normalized tables.
2. `database/schema/02_create_relationships.sql` — Applies foreign key constraints.
3. `database/schema/03_indexes.sql` — Applies performance indexes.
4. `database/seed/seed_data.sql` — Inserts seed data (users, roles, initial items, suppliers).
5. `database/procedures/sp_GetBusinessKPIs.sql` — Real-time KPI aggregation procedure.
6. `database/procedures/sp_GetUserAuditTrail.sql` — Paginated audit query procedure.

---

## 2. Running the Unified Spring Boot Backend

The backend is completely self-contained in Spring Boot (no separate Node.js service needed).

```bash
cd backend-springboot

# Verify application.properties has your MSSQL credentials (default sa / YourStrongPassword!)
# Then run with Maven:
mvn spring-boot:run
```
*(Or open `backend-springboot` in IntelliJ IDEA and run `InventorySystemApplication.java`)*

The Spring Boot server will start at: `http://localhost:8080`

### Available Endpoints:
* **Authentication & Notifications**:
  - `POST /api/auth/login` — Authenticate user and issue JWT token
  - `GET /api/auth/me` — Retrieve authenticated user profile
  - `GET /api/notifications` — Retrieve low-stock and operational alerts
* **Business Management**:
  - `GET /api/business/dashboard/kpis` — Executive KPI metrics & category breakdown
  - `GET /api/business/users` — User management listing & search
  - `POST /api/business/users` — Create new operator user
  - `PUT /api/business/users/{id}` — Update user details & role assignments
  - `PATCH /api/business/users/{id}/status?active={true|false}` — Enable/disable account
  - `DELETE /api/business/users/{id}` — Delete user account
  - `GET /api/business/roles` — Role definitions (6 RBAC roles)
  - `GET /api/business/audit-logs` — Filterable audit trail with CSV export
  - `GET /api/business/decision-reports/current` — Automated decision intelligence report

---

## 3. Running the React Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open your browser at: `http://localhost:5173`

### Demo Login Accounts (Password: `Admin@123` for all accounts):
* **Business Owner**: `admin`
* **Warehouse Manager**: `warehouse_mgr`
* **Store Operations Supervisor**: `store_ops`
* **Inventory Planning Clerk**: `inventory_clerk`
* **Finance Manager**: `finance_mgr`
* **Procurement Coordinator**: `procure_coord`