package com.novamart.inventory.businessmanagement.service.impl;

import com.novamart.inventory.businessmanagement.dto.AuditLogDto;
import com.novamart.inventory.businessmanagement.model.AuditLog;
import com.novamart.inventory.businessmanagement.repository.AuditLogRepository;
import com.novamart.inventory.businessmanagement.service.AuditLogService;
import com.novamart.inventory.common.dto.PagedResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    public void logAction(Integer userId, String username, String action, String moduleName, String ipAddress, String details, String severity) {
        try {
            AuditLog log = new AuditLog(userId, username, action, moduleName, ipAddress, details, severity);
            auditLogRepository.save(log);
        } catch (Exception ex) {
            // Log failure should not break critical transactions
            System.err.println("Failed to write audit log: " + ex.getMessage());
        }
    }

    @Override
    public PagedResponse<AuditLogDto> getAuditLogs(String moduleName, String action, String username, String severity, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<AuditLog> logPage = auditLogRepository.findFilteredAuditLogs(
                (moduleName != null && !moduleName.trim().isEmpty()) ? moduleName.trim() : null,
                (action != null && !action.trim().isEmpty()) ? action.trim() : null,
                (username != null && !username.trim().isEmpty()) ? username.trim() : null,
                (severity != null && !severity.trim().isEmpty()) ? severity.trim() : null,
                pageRequest
        );

        List<AuditLogDto> dtos = logPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                logPage.getNumber(),
                logPage.getSize(),
                logPage.getTotalElements(),
                logPage.getTotalPages(),
                logPage.isLast()
        );
    }

    @Override
    public List<AuditLogDto> getRecentActivities() {
        return auditLogRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private AuditLogDto convertToDto(AuditLog entity) {
        AuditLogDto dto = new AuditLogDto();
        dto.setLogId(entity.getLogId());
        dto.setUserId(entity.getUserId());
        dto.setUsername(entity.getUsername());
        dto.setAction(entity.getAction());
        dto.setModuleName(entity.getModuleName());
        dto.setIpAddress(entity.getIpAddress());
        dto.setDetails(entity.getDetails());
        dto.setSeverity(entity.getSeverity());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
