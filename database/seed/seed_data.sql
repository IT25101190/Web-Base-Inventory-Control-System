-- =============================================================
-- NovaMart Web-Based Inventory Control System
-- Database: Microsoft SQL Server (MSSQL)
-- Script 04: Seed Data
-- =============================================================

USE NovaMartInventoryDB;
GO

-- 1. Insert Roles
SET IDENTITY_INSERT dbo.Roles ON;

IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE RoleId = 1)
    INSERT INTO dbo.Roles (RoleId, RoleName, Description) VALUES
    (1, N'BUSINESS_OWNER', N'Executive authority with access to dashboards, KPIs, user management, and decision reports'),
    (2, N'WAREHOUSE_MANAGER', N'Oversees goods receipts, warehouse inventory allocations, and internal stock transfers'),
    (3, N'STORE_OPERATIONS_SUPERVISOR', N'Supervises order fulfillment, stock availability verification, and delivery schedules'),
    (4, N'INVENTORY_CLERK', N'Manages inventory master records, tracks reorder points, and requests replenishment'),
    (5, N'FINANCE_MANAGER', N'Monitors purchase costs, inventory valuation, and manages supplier payment records'),
    (6, N'PROCUREMENT_COORDINATOR', N'Manages supplier profiles, purchase orders, and supplier lifecycle evaluations');

SET IDENTITY_INSERT dbo.Roles OFF;
GO

-- 2. Insert Users (Password: Admin@123 / bcrypt hash: $2a$10$EBLZqN07301/b8hN8L44Oue9r4378f.3Zc0Gz7Dqg29sQ67878g22)
SET IDENTITY_INSERT dbo.Users ON;

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserId = 1)
    INSERT INTO dbo.Users (UserId, Username, PasswordHash, FullName, Email, PhoneNumber, IsActive) VALUES
    (1, N'admin', N'$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', N'Saman Jayawardena', N'owner@novamart.lk', N'+94771234560', 1),
    (2, N'warehouse_mgr', N'$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', N'Kasun Perera', N'warehouse@novamart.lk', N'+94771234561', 1),
    (3, N'store_ops', N'$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', N'Dilshan Silva', N'storeops@novamart.lk', N'+94771234562', 1),
    (4, N'inventory_clerk', N'$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', N'Nimesha Fernando', N'clerk@novamart.lk', N'+94771234563', 1),
    (5, N'finance_mgr', N'$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', N'Chamari Wickramasinghe', N'finance@novamart.lk', N'+94771234564', 1),
    (6, N'procure_coord', N'$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', N'Roshan Senanayake', N'procurement@novamart.lk', N'+94771234565', 1);

SET IDENTITY_INSERT dbo.Users OFF;
GO

-- 3. Assign User Roles
IF NOT EXISTS (SELECT 1 FROM dbo.UserRoles WHERE UserId = 1 AND RoleId = 1)
    INSERT INTO dbo.UserRoles (UserId, RoleId) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6);
GO

-- 4. Insert Initial Audit Logs
INSERT INTO dbo.AuditLogs (UserId, Username, Action, ModuleName, IpAddress, Details, Severity)
VALUES
(1, N'admin', N'INITIALIZE_SYSTEM', N'BUSINESS_MANAGEMENT', N'127.0.0.1', N'System initialized with base roles and administrator account', N'INFO'),
(1, N'admin', N'ROLE_ASSIGNMENT', N'BUSINESS_MANAGEMENT', N'127.0.0.1', N'Assigned default operational roles to department heads', N'INFO'),
(2, N'warehouse_mgr', N'WAREHOUSE_CHECKIN', N'WAREHOUSE_OPS', N'127.0.0.1', N'Completed daily safety and bay stock verification', N'INFO');
GO

-- 5. Insert 5 Suppliers
SET IDENTITY_INSERT dbo.Supplier ON;

IF NOT EXISTS (SELECT 1 FROM dbo.Supplier WHERE SupplierId = 1)
    INSERT INTO dbo.Supplier (SupplierId, SupplierCode, SupplierName, ContactPerson, Email, PhoneNumber, Address, Rating, PaymentTerms) VALUES
    (1, N'SUP-001', N'Ceylon Agro Logistics Ltd', N'Sunil Alwis', N'contact@ceylonagro.lk', N'+94112555666', N'No 45, Peliyagoda Industrial Zone', 4.85, N'Net 30'),
    (2, N'SUP-002', N'Lanka Packaging Solutions', N'Priyani De Silva', N'sales@lankapack.lk', N'+94112444333', N'No 12, Biyagama EPZ', 4.60, N'Net 15'),
    (3, N'SUP-003', N'Apex Electronic Components', N'Dinesh Raj', N'info@apexelectronics.lk', N'+94112999888', N'No 88, Galle Road, Colombo 03', 4.90, N'Net 30'),
    (4, N'SUP-004', N'Royal Paper & Stationery Co', N'Malik Hameed', N'support@royalpaper.lk', N'+94112111222', N'No 105, Maliban St, Colombo 11', 4.25, N'Net 45'),
    (5, N'SUP-005', N'Global Consumer Imports Ltd', N'Arthur Mendis', N'orders@globalimports.lk', N'+94112777666', N'No 204, Kandy Road, Kelaniya', 4.75, N'Net 30');

SET IDENTITY_INSERT dbo.Supplier OFF;
GO

-- 6. Insert 10 Inventory Items
SET IDENTITY_INSERT dbo.InventoryItem ON;

IF NOT EXISTS (SELECT 1 FROM dbo.InventoryItem WHERE ItemId = 1)
    INSERT INTO dbo.InventoryItem (ItemId, SkuCode, ItemName, Category, UnitOfMeasure, QuantityOnHand, AllocatedQuantity, MinimumStockLevel, ReorderPoint, ReorderQuantity, UnitCost, UnitPrice) VALUES
    (1, N'SKU-ELEC-001', N'Nova Pro Smart Router AC1200', N'Electronics', N'PCS', 120, 15, 20, 35, 50, 4500.00, 7200.00),
    (2, N'SKU-ELEC-002', N'Nova USB-C Fast Charging Hub 65W', N'Electronics', N'PCS', 8, 4, 15, 25, 40, 2200.00, 3900.00), -- Low Stock
    (3, N'SKU-ELEC-003', N'Nova Wireless Barcode Scanner 2D', N'Hardware', N'PCS', 45, 5, 10, 20, 30, 8500.00, 13500.00),
    (4, N'SKU-STAT-001', N'Industrial Barcode Thermal Labels (1000s)', N'Packaging', N'ROLL', 350, 40, 50, 100, 200, 650.00, 1100.00),
    (5, N'SKU-STAT-002', N'Heavy Duty Tape Dispenser 3-inch', N'Stationery', N'PCS', 5, 2, 10, 15, 25, 1200.00, 1950.00), -- Low Stock
    (6, N'SKU-CONS-001', N'Kraft Corrugated Shipping Boxes (L)', N'Packaging', N'BUNDLE', 210, 30, 40, 80, 150, 1800.00, 2900.00),
    (7, N'SKU-CONS-002', N'Biodegradable Bubble Wrap 50m Roll', N'Packaging', N'ROLL', 85, 10, 20, 30, 50, 2100.00, 3400.00),
    (8, N'SKU-TOOL-001', N'Precision Electronic Tool Kit 32-in-1', N'Hardware', N'SET', 60, 8, 15, 25, 40, 3100.00, 5400.00),
    (9, N'SKU-SAFE-001', N'Anti-Static Safety Work Gloves (L)', N'Safety Equipment', N'PAIR', 180, 20, 30, 60, 100, 450.00, 850.00),
    (10, N'SKU-SAFE-002', N'Warehouse High-Visibility Reflective Vest', N'Safety Equipment', N'PCS', 3, 0, 10, 20, 50, 850.00, 1500.00); -- Low Stock

SET IDENTITY_INSERT dbo.InventoryItem OFF;
GO

-- 7. Insert Initial KPI Snapshot for Dashboard
INSERT INTO dbo.KpiSnapshots (SnapshotDate, TotalInventoryValue, TotalItemsCount, LowStockCount, ActiveOrdersCount, MonthlyRevenue, InventoryTurnoverRatio)
VALUES
(CAST(SYSUTCDATETIME() AS DATE), 2845300.00, 10, 3, 18, 4890000.00, 4.25);
GO

-- 8. Insert Sample Replenishment Request & PO
SET IDENTITY_INSERT dbo.ReplenishmentRequest ON;
INSERT INTO dbo.ReplenishmentRequest (RequestId, ItemId, RequestedQuantity, Priority, Status, RequestedByUserId, Remarks)
VALUES
(1, 2, 40, N'HIGH', N'PENDING', 4, N'Low stock alert triggered below reorder point of 25 units'),
(2, 5, 25, N'MEDIUM', N'PENDING', 4, N'Regular stock replenishment required');
SET IDENTITY_INSERT dbo.ReplenishmentRequest OFF;
GO
