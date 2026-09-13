-- =============================================================
-- NovaMart Web-Based Inventory Control System
-- Database: Microsoft SQL Server (MSSQL)
-- Script 02: Foreign Key Constraints & Relationships
-- =============================================================

USE NovaMartInventoryDB;
GO

-- UserRoles Relationships
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_UserRoles_Users')
BEGIN
    ALTER TABLE dbo.UserRoles
    ADD CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_UserRoles_Roles')
BEGIN
    ALTER TABLE dbo.UserRoles
    ADD CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES dbo.Roles(RoleId) ON DELETE CASCADE;
END
GO

-- AuditLogs Relationship
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_AuditLogs_Users')
BEGIN
    ALTER TABLE dbo.AuditLogs
    ADD CONSTRAINT FK_AuditLogs_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId) ON DELETE SET NULL;
END
GO

-- Supplier -> PurchaseOrder
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PurchaseOrder_Supplier')
BEGIN
    ALTER TABLE dbo.PurchaseOrder
    ADD CONSTRAINT FK_PurchaseOrder_Supplier FOREIGN KEY (SupplierId) REFERENCES dbo.Supplier(SupplierId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PurchaseOrder_Users')
BEGIN
    ALTER TABLE dbo.PurchaseOrder
    ADD CONSTRAINT FK_PurchaseOrder_Users FOREIGN KEY (CreatedByUserId) REFERENCES dbo.Users(UserId);
END
GO

-- PurchaseOrder -> PurchaseOrderItem
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PurchaseOrderItem_PurchaseOrder')
BEGIN
    ALTER TABLE dbo.PurchaseOrderItem
    ADD CONSTRAINT FK_PurchaseOrderItem_PurchaseOrder FOREIGN KEY (PoId) REFERENCES dbo.PurchaseOrder(PoId) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PurchaseOrderItem_InventoryItem')
BEGIN
    ALTER TABLE dbo.PurchaseOrderItem
    ADD CONSTRAINT FK_PurchaseOrderItem_InventoryItem FOREIGN KEY (ItemId) REFERENCES dbo.InventoryItem(ItemId);
END
GO

-- InventoryItem -> ReplenishmentRequest
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ReplenishmentRequest_InventoryItem')
BEGIN
    ALTER TABLE dbo.ReplenishmentRequest
    ADD CONSTRAINT FK_ReplenishmentRequest_InventoryItem FOREIGN KEY (ItemId) REFERENCES dbo.InventoryItem(ItemId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ReplenishmentRequest_Users')
BEGIN
    ALTER TABLE dbo.ReplenishmentRequest
    ADD CONSTRAINT FK_ReplenishmentRequest_Users FOREIGN KEY (RequestedByUserId) REFERENCES dbo.Users(UserId);
END
GO

-- PurchaseOrder -> GoodsReceived
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_GoodsReceived_PurchaseOrder')
BEGIN
    ALTER TABLE dbo.GoodsReceived
    ADD CONSTRAINT FK_GoodsReceived_PurchaseOrder FOREIGN KEY (PoId) REFERENCES dbo.PurchaseOrder(PoId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_GoodsReceived_Users')
BEGIN
    ALTER TABLE dbo.GoodsReceived
    ADD CONSTRAINT FK_GoodsReceived_Users FOREIGN KEY (ReceivedByUserId) REFERENCES dbo.Users(UserId);
END
GO

-- GoodsReceived -> GoodsReceivedItem
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_GoodsReceivedItem_GoodsReceived')
BEGIN
    ALTER TABLE dbo.GoodsReceivedItem
    ADD CONSTRAINT FK_GoodsReceivedItem_GoodsReceived FOREIGN KEY (GrnId) REFERENCES dbo.GoodsReceived(GrnId) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_GoodsReceivedItem_InventoryItem')
BEGIN
    ALTER TABLE dbo.GoodsReceivedItem
    ADD CONSTRAINT FK_GoodsReceivedItem_InventoryItem FOREIGN KEY (ItemId) REFERENCES dbo.InventoryItem(ItemId);
END
GO

-- SalesOrder -> SalesOrderItem
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_SalesOrderItem_SalesOrder')
BEGIN
    ALTER TABLE dbo.SalesOrderItem
    ADD CONSTRAINT FK_SalesOrderItem_SalesOrder FOREIGN KEY (OrderId) REFERENCES dbo.SalesOrder(OrderId) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_SalesOrderItem_InventoryItem')
BEGIN
    ALTER TABLE dbo.SalesOrderItem
    ADD CONSTRAINT FK_SalesOrderItem_InventoryItem FOREIGN KEY (ItemId) REFERENCES dbo.InventoryItem(ItemId);
END
GO

-- SalesOrder -> DeliverySchedule
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_DeliverySchedule_SalesOrder')
BEGIN
    ALTER TABLE dbo.DeliverySchedule
    ADD CONSTRAINT FK_DeliverySchedule_SalesOrder FOREIGN KEY (OrderId) REFERENCES dbo.SalesOrder(OrderId) ON DELETE CASCADE;
END
GO

-- SalesOrder & InventoryItem -> ProductReturn
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ProductReturn_SalesOrder')
BEGIN
    ALTER TABLE dbo.ProductReturn
    ADD CONSTRAINT FK_ProductReturn_SalesOrder FOREIGN KEY (OrderId) REFERENCES dbo.SalesOrder(OrderId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ProductReturn_InventoryItem')
BEGIN
    ALTER TABLE dbo.ProductReturn
    ADD CONSTRAINT FK_ProductReturn_InventoryItem FOREIGN KEY (ItemId) REFERENCES dbo.InventoryItem(ItemId);
END
GO

-- PurchaseOrder -> SupplierPayment
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_SupplierPayment_PurchaseOrder')
BEGIN
    ALTER TABLE dbo.SupplierPayment
    ADD CONSTRAINT FK_SupplierPayment_PurchaseOrder FOREIGN KEY (PoId) REFERENCES dbo.PurchaseOrder(PoId);
END
GO
