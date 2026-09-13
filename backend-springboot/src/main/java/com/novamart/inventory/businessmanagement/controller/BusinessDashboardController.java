package com.novamart.inventory.businessmanagement.controller;

import com.novamart.inventory.businessmanagement.dto.BusinessKpiDto;
import com.novamart.inventory.businessmanagement.service.BusinessDashboardService;
import com.novamart.inventory.common.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business/dashboard")
@CrossOrigin(origins = "*")
public class BusinessDashboardController {

    @Autowired
    private BusinessDashboardService businessDashboardService;

    @GetMapping("/kpis")
    public ResponseEntity<ApiResponse<BusinessKpiDto>> getDashboardKpis() {
        BusinessKpiDto kpis = businessDashboardService.getExecutiveKpis();
        return ResponseEntity.ok(ApiResponse.success("Executive KPIs retrieved successfully", kpis));
    }

    @PostMapping("/kpis/snapshot")
    public ResponseEntity<ApiResponse<String>> triggerSnapshot() {
        businessDashboardService.captureKpiSnapshot();
        return ResponseEntity.ok(ApiResponse.success("KPI snapshot captured successfully", "SUCCESS"));
    }
}
