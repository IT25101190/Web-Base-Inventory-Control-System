package com.novamart.inventory.businessmanagement.controller;

import com.novamart.inventory.businessmanagement.dto.AuditLogDto;
import com.novamart.inventory.businessmanagement.service.AuditLogService;
import com.novamart.inventory.common.dto.ApiResponse;
import com.novamart.inventory.common.dto.PagedResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<AuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) String moduleName,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String severity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PagedResponse<AuditLogDto> logs = auditLogService.getAuditLogs(moduleName, action, username, severity, page, size);
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved successfully", logs));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getRecentActivities() {
        List<AuditLogDto> recent = auditLogService.getRecentActivities();
        return ResponseEntity.ok(ApiResponse.success("Recent activities retrieved", recent));
    }
}
