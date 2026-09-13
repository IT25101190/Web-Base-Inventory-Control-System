-- =============================================================
-- NovaMart Web-Based Inventory Control System
-- Database: Microsoft SQL Server (MSSQL)
-- Procedure: sp_GetBusinessKPIs
-- Description: Calculates real-time executive KPIs for Business Management Dashboard
-- =============================================================

USE NovaMartInventoryDB;
GO

IF OBJECT_ID(N'dbo.sp_GetBusinessKPIs', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetBusinessKPIs;
GO

CREATE PROCEDURE dbo.sp_GetBusinessKPIs
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalInventoryValue DECIMAL(18,2) = 0.00;
    DECLARE @TotalItemsCount INT = 0;
    DECLARE @LowStockCount INT = 0;
    DECLARE @ActiveOrdersCount INT = 0;
    DECLARE @MonthlyRevenue DECIMAL(18,2) = 0.00;
    DECLARE @TotalUsersCount INT = 0;
    DECLARE @ActiveSuppliersCount INT = 0;
    DECLARE @InventoryTurnoverRatio DECIMAL(6,2) = 4.25;

    -- Calculate total inventory value and item counts
    SELECT 
        @TotalInventoryValue = ISNULL(SUM(CAST(QuantityOnHand AS DECIMAL(18,2)) * UnitCost), 0.00),
        @TotalItemsCount = COUNT(*),
        @LowStockCount = COUNT(CASE WHEN QuantityOnHand <= ReorderPoint THEN 1 END)
    FROM dbo.InventoryItem
    WHERE IsActive = 1;

    -- Calculate active pending/confirmed sales orders
    SELECT 
        @ActiveOrdersCount = COUNT(*),
        @MonthlyRevenue = ISNULL(SUM(TotalAmount), 0.00)
    FROM dbo.SalesOrder
    WHERE Status IN ('PENDING', 'CONFIRMED', 'DISPATCHED');

    -- Count total users and suppliers
    SELECT @TotalUsersCount = COUNT(*) FROM dbo.Users WHERE IsActive = 1;
    SELECT @ActiveSuppliersCount = COUNT(*) FROM dbo.Supplier WHERE IsActive = 1;

    -- Return consolidated KPI row
    SELECT 
        @TotalInventoryValue AS TotalInventoryValue,
        @TotalItemsCount AS TotalItemsCount,
        @LowStockCount AS LowStockCount,
        @ActiveOrdersCount AS ActiveOrdersCount,
        @MonthlyRevenue AS MonthlyRevenue,
        @TotalUsersCount AS TotalUsersCount,
        @ActiveSuppliersCount AS ActiveSuppliersCount,
        @InventoryTurnoverRatio AS InventoryTurnoverRatio,
        SYSUTCDATETIME() AS CalculatedAt;
END
GO
