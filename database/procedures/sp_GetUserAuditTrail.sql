-- =============================================================
-- NovaMart Web-Based Inventory Control System
-- Database: Microsoft SQL Server (MSSQL)
-- Procedure: sp_GetUserAuditTrail
-- Description: Retrieves paginated and filtered audit trail for compliance and reporting
-- =============================================================

USE NovaMartInventoryDB;
GO

IF OBJECT_ID(N'dbo.sp_GetUserAuditTrail', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetUserAuditTrail;
GO

CREATE PROCEDURE dbo.sp_GetUserAuditTrail
    @ModuleName NVARCHAR(50) = NULL,
    @Action NVARCHAR(100) = NULL,
    @Username NVARCHAR(50) = NULL,
    @Severity NVARCHAR(20) = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    -- Query filtered audit logs
    SELECT 
        LogId,
        UserId,
        Username,
        Action,
        ModuleName,
        IpAddress,
        Details,
        Severity,
        CreatedAt,
        COUNT(*) OVER() AS TotalRecords
    FROM dbo.AuditLogs
    WHERE (@ModuleName IS NULL OR ModuleName = @ModuleName)
      AND (@Action IS NULL OR Action LIKE '%' + @Action + '%')
      AND (@Username IS NULL OR Username LIKE '%' + @Username + '%')
      AND (@Severity IS NULL OR Severity = @Severity)
    ORDER BY CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
