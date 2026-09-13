package com.novamart.inventory.businessmanagement.controller;

import com.novamart.inventory.businessmanagement.dto.NotificationDto;
import com.novamart.inventory.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"}, allowCredentials = "true")
public class NotificationController {

    private final List<NotificationDto> notifications = new CopyOnWriteArrayList<>();

    public NotificationController() {
        notifications.add(new NotificationDto(
                1L,
                "Critical Low Stock: Reflective Vest",
                "Warehouse High-Visibility Reflective Vest (SKU-SAFE-002) is at 3 units (Threshold: 10)",
                "LOW_STOCK",
                LocalDateTime.now().minusHours(1),
                false
        ));
        notifications.add(new NotificationDto(
                2L,
                "Low Stock Alert: Tape Dispenser",
                "Heavy Duty Tape Dispenser 3-inch (SKU-STAT-002) is at 5 units (Threshold: 10)",
                "LOW_STOCK",
                LocalDateTime.now().minusHours(2),
                false
        ));
        notifications.add(new NotificationDto(
                3L,
                "Low Stock Alert: USB-C Fast Charging Hub",
                "Nova USB-C Fast Charging Hub 65W (SKU-ELEC-002) is at 8 units (Threshold: 15)",
                "LOW_STOCK",
                LocalDateTime.now().minusHours(4),
                true
        ));
        notifications.add(new NotificationDto(
                4L,
                "System Audit Alert: User Status Changed",
                "Store Operations Supervisor account permissions verified by Business Owner",
                "AUDIT_ALERT",
                LocalDateTime.now().minusHours(6),
                true
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications() {
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", new ArrayList<>(notifications)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Boolean>> markAsRead(@PathVariable Long id) {
        for (NotificationDto n : notifications) {
            if (n.getId().equals(id)) {
                n.setRead(true);
                return ResponseEntity.ok(ApiResponse.success("Notification marked as read", true));
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Notification updated", true));
    }
}
