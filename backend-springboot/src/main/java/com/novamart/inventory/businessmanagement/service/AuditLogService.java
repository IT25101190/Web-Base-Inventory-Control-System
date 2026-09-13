package com.novamart.inventory.businessmanagement.service;

import com.novamart.inventory.businessmanagement.dto.AuditLogDto;
import com.novamart.inventory.common.dto.PagedResponse;

import java.util.List;

public interface AuditLogService {

    void logAction(Integer userId, String username, String action, String moduleName, String ipAddress, String details, String severity);

    PagedResponse<AuditLogDto> getAuditLogs(String moduleName, String action, String username, String severity, int page, int size);

    List<AuditLogDto> getRecentActivities();
}
