package com.novamart.inventory.businessmanagement.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class BusinessKpiDto {
    private BigDecimal totalInventoryValue;
    private Integer totalItemsCount;
    private Integer lowStockCount;
    private Integer activeOrdersCount;
    private BigDecimal monthlyRevenue;
    private BigDecimal inventoryTurnoverRatio;
    private Integer totalUsersCount;
    private Integer activeSuppliersCount;
    private LocalDateTime calculatedAt;
    private List<Map<String, Object>> categoryValuation;
    private List<Map<String, Object>> revenueTrend;

    public BusinessKpiDto() {}

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(BigDecimal totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public Integer getTotalItemsCount() {
        return totalItemsCount;
    }

    public void setTotalItemsCount(Integer totalItemsCount) {
        this.totalItemsCount = totalItemsCount;
    }

    public Integer getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(Integer lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public Integer getActiveOrdersCount() {
        return activeOrdersCount;
    }

    public void setActiveOrdersCount(Integer activeOrdersCount) {
        this.activeOrdersCount = activeOrdersCount;
    }

    public BigDecimal getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(BigDecimal monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public BigDecimal getInventoryTurnoverRatio() {
        return inventoryTurnoverRatio;
    }

    public void setInventoryTurnoverRatio(BigDecimal inventoryTurnoverRatio) {
        this.inventoryTurnoverRatio = inventoryTurnoverRatio;
    }

    public Integer getTotalUsersCount() {
        return totalUsersCount;
    }

    public void setTotalUsersCount(Integer totalUsersCount) {
        this.totalUsersCount = totalUsersCount;
    }

    public Integer getActiveSuppliersCount() {
        return activeSuppliersCount;
    }

    public void setActiveSuppliersCount(Integer activeSuppliersCount) {
        this.activeSuppliersCount = activeSuppliersCount;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }

    public List<Map<String, Object>> getCategoryValuation() {
        return categoryValuation;
    }

    public void setCategoryValuation(List<Map<String, Object>> categoryValuation) {
        this.categoryValuation = categoryValuation;
    }

    public List<Map<String, Object>> getRevenueTrend() {
        return revenueTrend;
    }

    public void setRevenueTrend(List<Map<String, Object>> revenueTrend) {
        this.revenueTrend = revenueTrend;
    }
}
