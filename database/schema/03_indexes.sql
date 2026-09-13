-- =============================================================
-- NovaMart Web-Based Inventory Control System
-- Database: Microsoft SQL Server (MSSQL)
-- Script 03: Performance Indexes
-- =============================================================

USE NovaMartInventoryDB;
GO

-- Index on Users
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Username')
    CREATE NONCLUSTERED INDEX IX_Users_Username ON dbo.Users(Username);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email')
    CREATE NONCLUSTERED INDEX IX_Users_Email ON dbo.Users(Email);
GO

-- Indexes on AuditLogs for Business Management & Auditing
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AuditLogs_CreatedAt')
    CREATE NONCLUSTERED INDEX IX_AuditLogs_CreatedAt ON dbo.AuditLogs(CreatedAt DESC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AuditLogs_ModuleName')
    CREATE NONCLUSTERED INDEX IX_AuditLogs_ModuleName ON dbo.AuditLogs(ModuleName, Action);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AuditLogs_UserId')
    CREATE NONCLUSTERED INDEX IX_AuditLogs_UserId ON dbo.AuditLogs(UserId);
GO

-- Indexes on InventoryItem for fast stock lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_InventoryItem_SkuCode')
    CREATE NONCLUSTERED INDEX IX_InventoryItem_SkuCode ON dbo.InventoryItem(SkuCode);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_InventoryItem_Category')
    CREATE NONCLUSTERED INDEX IX_InventoryItem_Category ON dbo.InventoryItem(Category);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_InventoryItem_LowStock')
    CREATE NONCLUSTERED INDEX IX_InventoryItem_LowStock ON dbo.InventoryItem(QuantityOnHand, ReorderPoint);
GO

-- Indexes on SalesOrder
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SalesOrder_Status')
    CREATE NONCLUSTERED INDEX IX_SalesOrder_Status ON dbo.SalesOrder(Status);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SalesOrder_CreatedAt')
    CREATE NONCLUSTERED INDEX IX_SalesOrder_CreatedAt ON dbo.SalesOrder(CreatedAt DESC);
GO

-- Indexes on PurchaseOrder
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PurchaseOrder_Status')
    CREATE NONCLUSTERED INDEX IX_PurchaseOrder_Status ON dbo.PurchaseOrder(Status);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PurchaseOrder_SupplierId')
    CREATE NONCLUSTERED INDEX IX_PurchaseOrder_SupplierId ON dbo.PurchaseOrder(SupplierId);
GO

-- Indexes on Notifications
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Notifications_UserId_IsRead')
    CREATE NONCLUSTERED INDEX IX_Notifications_UserId_IsRead ON dbo.Notifications(UserId, IsRead, CreatedAt DESC);
GO
