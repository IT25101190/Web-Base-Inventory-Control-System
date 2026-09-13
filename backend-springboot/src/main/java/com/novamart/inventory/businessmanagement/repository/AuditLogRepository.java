package com.novamart.inventory.businessmanagement.repository;

import com.novamart.inventory.businessmanagement.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:moduleName IS NULL OR a.moduleName = :moduleName) AND " +
           "(:action IS NULL OR LOWER(a.action) LIKE LOWER(CONCAT('%', :action, '%'))) AND " +
           "(:username IS NULL OR LOWER(a.username) LIKE LOWER(CONCAT('%', :username, '%'))) AND " +
           "(:severity IS NULL OR a.severity = :severity) " +
           "ORDER BY a.createdAt DESC")
    Page<AuditLog> findFilteredAuditLogs(
            @Param("moduleName") String moduleName,
            @Param("action") String action,
            @Param("username") String username,
            @Param("severity") String severity,
            Pageable pageable
    );

    List<AuditLog> findTop10ByOrderByCreatedAtDesc();
}
