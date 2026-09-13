package com.novamart.inventory.businessmanagement.service.impl;

import com.novamart.inventory.businessmanagement.dto.DecisionReportDto;
import com.novamart.inventory.businessmanagement.service.DecisionSupportService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DecisionSupportServiceImpl implements DecisionSupportService {

    @Override
    public DecisionReportDto generateMonthlyDecisionReport() {
        DecisionReportDto report = new DecisionReportDto();
        report.setReportId("REP-BM-" + LocalDate.now().getYear() + String.format("%02d", LocalDate.now().getMonthValue()));
        report.setTitle("Executive Inventory & Operations Decision Intelligence Report");
        report.setReportPeriod(LocalDate.now());
        report.setStockHealthScore(BigDecimal.valueOf(87.5));
        report.setExecutiveSummary(
                "NovaMart Trading overall inventory turnover stands at 4.25x per annum, maintaining healthy stock liquidity. " +
                "However, 3 SKUs currently breach the minimum safety threshold, requiring immediate replenishment PO execution. " +
                "Electronics category drives 44% of inventory valuation, with fast stock velocity."
        );

        // Stock risk alerts
        List<Map<String, Object>> risks = new ArrayList<>();
        risks.add(Map.of("sku", "SKU-SAFE-002", "itemName", "Warehouse High-Visibility Reflective Vest", "currentStock", 3, "minLevel", 10, "riskLevel", "CRITICAL"));
        risks.add(Map.of("sku", "SKU-STAT-002", "itemName", "Heavy Duty Tape Dispenser 3-inch", "currentStock", 5, "minLevel", 10, "riskLevel", "HIGH"));
        risks.add(Map.of("sku", "SKU-ELEC-002", "itemName", "Nova USB-C Fast Charging Hub 65W", "currentStock", 8, "minLevel", 15, "riskLevel", "HIGH"));
        report.setStockRiskAlerts(risks);

        // Fast moving items
        List<Map<String, Object>> fastMoving = new ArrayList<>();
        fastMoving.add(Map.of("sku", "SKU-STAT-001", "itemName", "Industrial Barcode Thermal Labels (1000s)", "turnoverRate", "8.2x", "monthlyUnitsSold", 240));
        fastMoving.add(Map.of("sku", "SKU-CONS-001", "itemName", "Kraft Corrugated Shipping Boxes (L)", "turnoverRate", "6.5x", "monthlyUnitsSold", 180));
        fastMoving.add(Map.of("sku", "SKU-ELEC-001", "itemName", "Nova Pro Smart Router AC1200", "turnoverRate", "5.1x", "monthlyUnitsSold", 95));
        report.setFastMovingItems(fastMoving);

        // Dead stock / Slow moving items
        List<Map<String, Object>> deadStock = new ArrayList<>();
        deadStock.add(Map.of("sku", "SKU-TOOL-001", "itemName", "Precision Electronic Tool Kit 32-in-1", "daysInWarehouse", 110, "tiedCapital", 186000.00, "recommendation", "Apply 15% bundle discount to accelerate clearance"));
        report.setDeadStockItems(deadStock);

        // Strategic recommendations
        List<String> recommendations = new ArrayList<>();
        recommendations.add("Fast-track approval of Replenishment Request #1 (USB-C Hubs) to prevent sales order fulfillment stalls.");
        recommendations.add("Negotiate volume-tier pricing with Lanka Packaging Solutions to capture a 6% margin improvement on shipping boxes.");
        recommendations.add("Transition dead-stock items (SKU-TOOL-001) into promotional electronics bundles for Q4.");
        recommendations.add("Review warehouse space allocation in Bay B: High-turnover packaging items should be relocated nearer to the packing dock.");
        report.setStrategicRecommendations(recommendations);

        return report;
    }
}
