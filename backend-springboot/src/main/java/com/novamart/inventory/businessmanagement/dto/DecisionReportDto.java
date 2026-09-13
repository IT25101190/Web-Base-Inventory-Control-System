package com.novamart.inventory.businessmanagement.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class DecisionReportDto {
    private String reportId;
    private String title;
    private LocalDate reportPeriod;
    private String executiveSummary;
    private BigDecimal stockHealthScore;
    private List<Map<String, Object>> stockRiskAlerts;
    private List<Map<String, Object>> fastMovingItems;
    private List<Map<String, Object>> deadStockItems;
    private List<String> strategicRecommendations;

    public DecisionReportDto() {}

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getReportPeriod() {
        return reportPeriod;
    }

    public void setReportPeriod(LocalDate reportPeriod) {
        this.reportPeriod = reportPeriod;
    }

    public String getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(String executiveSummary) {
        this.executiveSummary = executiveSummary;
    }

    public BigDecimal getStockHealthScore() {
        return stockHealthScore;
    }

    public void setStockHealthScore(BigDecimal stockHealthScore) {
        this.stockHealthScore = stockHealthScore;
    }

    public List<Map<String, Object>> getStockRiskAlerts() {
        return stockRiskAlerts;
    }

    public void setStockRiskAlerts(List<Map<String, Object>> stockRiskAlerts) {
        this.stockRiskAlerts = stockRiskAlerts;
    }

    public List<Map<String, Object>> getFastMovingItems() {
        return fastMovingItems;
    }

    public void setFastMovingItems(List<Map<String, Object>> fastMovingItems) {
        this.fastMovingItems = fastMovingItems;
    }

    public List<Map<String, Object>> getDeadStockItems() {
        return deadStockItems;
    }

    public void setDeadStockItems(List<Map<String, Object>> deadStockItems) {
        this.deadStockItems = deadStockItems;
    }

    public List<String> getStrategicRecommendations() {
        return strategicRecommendations;
    }

    public void setStrategicRecommendations(List<String> strategicRecommendations) {
        this.strategicRecommendations = strategicRecommendations;
    }
}
