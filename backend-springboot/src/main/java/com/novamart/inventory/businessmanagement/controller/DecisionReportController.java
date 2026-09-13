package com.novamart.inventory.businessmanagement.controller;

import com.novamart.inventory.businessmanagement.dto.DecisionReportDto;
import com.novamart.inventory.businessmanagement.service.DecisionSupportService;
import com.novamart.inventory.common.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/business/decision-reports")
@CrossOrigin(origins = "*")
public class DecisionReportController {

    @Autowired
    private DecisionSupportService decisionSupportService;

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<DecisionReportDto>> getCurrentReport() {
        DecisionReportDto report = decisionSupportService.generateMonthlyDecisionReport();
        return ResponseEntity.ok(ApiResponse.success("Decision report generated successfully", report));
    }
}
