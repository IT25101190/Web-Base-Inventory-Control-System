-- =============================================================
-- NovaMart Web-Based Inventory Control System
-- Database: Microsoft SQL Server (MSSQL)
-- Script 01: Table Definitions
-- =============================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'NovaMartInventoryDB')
BEGIN
    CREATE DATABASE NovaMartInventoryDB;
END
GO

USE NovaMartInventoryDB;
GO

-- -------------------------------------------------------------
-- Module 1: Business Management & Decision Support (Core Security)
-- -------------------------------------------------------------

IF OBJECT_ID(N'dbo.Roles', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Roles (
        RoleId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        RoleName NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(255) NULL,
        CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        UserId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Username NVARCHAR(50) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        FullName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        PhoneNumber NVARCHAR(20) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        LastLoginAt DATETIME2(7) NULL
    );
END
GO

IF OBJECT_ID(N'dbo.UserRoles', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.UserRoles (
        UserId INT NOT NULL,
        RoleId INT NOT NULL,
        AssignedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        PRIMARY KEY (UserId, RoleId)
    );
END
GO

IF OBJECT_ID(N'dbo.AuditLogs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.AuditLogs (
        LogId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        UserId INT NULL,
        Username NVARCHAR(50) NOT NULL,
        Action NVARCHAR(100) NOT NULL,
        ModuleName NVARCHAR(50) NOT NULL,
        IpAddress NVARCHAR(50) NULL,
        Details NVARCHAR(MAX) NULL,
        Severity NVARCHAR(20) NOT NULL DEFAULT 'INFO', -- INFO, WARNING, ERROR, CRITICAL
        CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF OBJECT_ID(N'dbo.KpiSnapshots', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.KpiSnapshots (
        SnapshotId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        SnapshotDate DATE NOT NULL,
        TotalInventoryValue DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        TotalItemsCount INT NOT NULL DEFAULT 0,
        LowStockCount INT NOT NULL DEFAULT 0,
        ActiveOrdersCount INT NOT NULL DEFAULT 0,
        MonthlyRevenue DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        InventoryTurnoverRatio DECIMAL(6,2) NOT NULL DEFAULT 0.00,
        GeneratedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- -------------------------------------------------------------
-- Module 4: Inventory Planning & Replenishment (Item Master)
-- -------------------------------------------------------------

IF OBJECT_ID(N'dbo.InventoryItem', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.InventoryItem (
        ItemId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        SkuCode NVARCHAR(50) NOT NULL UNIQUE,
        ItemName NVARCHAR(150) NOT NULL,
        Category NVARCHAR(100) NOT NULL,
        UnitOfMeasure NVARCHAR(20) NOT NULL DEFAULT 'PCS',
        QuantityOnHand INT NOT NULL DEFAULT 0,
        AllocatedQuantity INT NOT NULL DEFAULT 0,
        MinimumStockLevel INT NOT NULL DEFAULT 10,
        ReorderPoint INT NOT NULL DEFAULT 25,
        ReorderQuantity INT NOT NULL DEFAULT 50,
        UnitCost DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        UnitPrice DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- -------------------------------------------------------------
-- Module 6: Procurement & Supplier Lifecycle Management
-- -------------------------------------------------------------

IF OBJECT_ID(N'dbo.Supplier', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Supplier (
        SupplierId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        SupplierCode NVARCHAR(50) NOT NULL UNIQUE,
        SupplierName NVARCHAR(150) NOT NULL,
        ContactPerson NVARCHAR(100) NULL,
        Email NVARCHAR(100) NOT NULL,
        PhoneNumber NVARCHAR(30) NULL,
        Address NVARCHAR(255) NULL,
        Rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
        PaymentTerms NVARCHAR(50) NULL DEFAULT 'Net 30',
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF OBJECT_ID(N'dbo.PurchaseOrder', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PurchaseOrder (
        PoId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        PoNumber NVARCHAR(50) NOT NULL UNIQUE,
        SupplierId INT NOT NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'CREATED', -- CREATED, APPROVED, SENT, RECEIVED, CANCELLED
        TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        CreatedByUserId INT NOT NULL,
        OrderDate DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        ExpectedDeliveryDate DATE NULL
    );
END
GO

IF OBJECT_ID(N'dbo.PurchaseOrderItem', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PurchaseOrderItem (
        PoItemId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        PoId INT NOT NULL,
        ItemId INT NOT NULL,
        Quantity INT NOT NULL,
        UnitCost DECIMAL(18,2) NOT NULL,
        ReceivedQuantity INT NOT NULL DEFAULT 0
    );
END
GO

IF OBJECT_ID(N'dbo.ReplenishmentRequest', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ReplenishmentRequest (
        RequestId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ItemId INT NOT NULL,
        RequestedQuantity INT NOT NULL,
        Priority NVARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
        Status NVARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, CONVERTED_TO_PO
        RequestedByUserId INT NOT NULL,
        ConvertedPoId INT NULL,
        CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        Remarks NVARCHAR(255) NULL
    );
END
GO

-- -------------------------------------------------------------
-- Module 2: Warehouse & Inventory Operations Management
-- -------------------------------------------------------------

IF OBJECT_ID(N'dbo.GoodsReceived', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.GoodsReceived (
        GrnId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        GrnNumber NVARCHAR(50) NOT NULL UNIQUE,
        PoId INT NOT NULL,
        ReceivedDate DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        ReceivedByUserId INT NOT NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, CORRECTED, CANCELLED
        Remarks NVARCHAR(255) NULL
    );
END
GO

IF OBJECT_ID(N'dbo.GoodsReceivedItem', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.GoodsReceivedItem (
        GrnItemId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        GrnId INT NOT NULL,
        ItemId INT NOT NULL,
        QuantityReceived INT NOT NULL,
        BatchNumber NVARCHAR(50) NULL,
        ExpiryDate DATE NULL
    );
END
GO

IF OBJECT_ID(N'dbo.StockTransfer', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.StockTransfer (
        TransferId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        TransferNumber NVARCHAR(50) NOT NULL UNIQUE,
        SourceLocation NVARCHAR(50) NOT NULL,
        DestinationLocation NVARCHAR(50) NOT NULL,
        TransferredByUserId INT NOT NULL,
        TransferDate DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        Status NVARCHAR(30) NOT NULL DEFAULT 'COMPLETED'
    );
END
GO

-- -------------------------------------------------------------
-- Module 3: Sales Fulfillment & Distribution Management
-- -------------------------------------------------------------

IF OBJECT_ID(N'dbo.SalesOrder', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.SalesOrder (
        OrderId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        OrderNumber NVARCHAR(50) NOT NULL UNIQUE,
        CustomerName NVARCHAR(100) NOT NULL,
        CustomerEmail NVARCHAR(100) NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, DISPATCHED, DELIVERED, CANCELLED
        TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF OBJECT_ID(N'dbo.SalesOrderItem', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.SalesOrderItem (
        OrderItemId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        OrderId INT NOT NULL,
        ItemId INT NOT NULL,
        Quantity INT NOT NULL,
        UnitPrice DECIMAL(18,2) NOT NULL
    );
END
GO

IF OBJECT_ID(N'dbo.DeliverySchedule', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DeliverySchedule (
        ScheduleId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        OrderId INT NOT NULL,
        VehicleNumber NVARCHAR(50) NULL,
        DriverName NVARCHAR(100) NULL,
        ScheduledDate DATE NOT NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'SCHEDULED' -- SCHEDULED, IN_TRANSIT, DELIVERED, FAILED
    );
END
GO

IF OBJECT_ID(N'dbo.ProductReturn', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ProductReturn (
        ReturnId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        OrderId INT NOT NULL,
        ItemId INT NOT NULL,
        ReturnedQuantity INT NOT NULL,
        Reason NVARCHAR(255) NOT NULL,
        Condition NVARCHAR(50) NOT NULL, -- RESTOCKABLE, DAMAGED
        ReturnDate DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- -------------------------------------------------------------
-- Module 5: Financial & Cost Management
-- -------------------------------------------------------------

IF OBJECT_ID(N'dbo.SupplierPayment', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.SupplierPayment (
        PaymentId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        PoId INT NOT NULL,
        AmountPaid DECIMAL(18,2) NOT NULL,
        PaymentDate DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME(),
        PaymentMethod NVARCHAR(50) NOT NULL, -- BANK_TRANSFER, CHEQUE, CASH
        PaymentReference NVARCHAR(100) NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'PAID'
    );
END
GO

IF OBJECT_ID(N'dbo.FinancialReport', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.FinancialReport (
        ReportId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ReportType NVARCHAR(50) NOT NULL, -- INVENTORY_VALUATION, COGS_SUMMARY, PROFITABILITY
        PeriodStart DATE NOT NULL,
        PeriodEnd DATE NOT NULL,
        TotalValuation DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        TotalCosts DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        GeneratedByUserId INT NOT NULL,
        GeneratedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- -------------------------------------------------------------
-- Notifications Table (Shared with Node.js service)
-- -------------------------------------------------------------

IF OBJECT_ID(N'dbo.Notifications', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Notifications (
        NotificationId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        UserId INT NULL,
        Title NVARCHAR(150) NOT NULL,
        Message NVARCHAR(MAX) NOT NULL,
        Type NVARCHAR(50) NOT NULL DEFAULT 'LOW_STOCK', -- LOW_STOCK, REPLENISHMENT_REQ, PO_APPROVAL
        IsRead BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2(7) NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO
