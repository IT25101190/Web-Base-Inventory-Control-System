package com.novamart.inventory.businessmanagement.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "KpiSnapshots")
public class KpiSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SnapshotId")
    private Long snapshotId;

    @Column(name = "SnapshotDate", nullable = false)
    private LocalDate snapshotDate;

    @Column(name = "TotalInventoryValue", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalInventoryValue = BigDecimal.ZERO;

    @Column(name = "TotalItemsCount", nullable = false)
    private Integer totalItemsCount = 0;

    @Column(name = "LowStockCount", nullable = false)
    private Integer lowStockCount = 0;

    @Column(name = "ActiveOrdersCount", nullable = false)
    private Integer activeOrdersCount = 0;

    @Column(name = "MonthlyRevenue", nullable = false, precision = 18, scale = 2)
    private BigDecimal monthlyRevenue = BigDecimal.ZERO;

    @Column(name = "InventoryTurnoverRatio", nullable = false, precision = 6, scale = 2)
    private BigDecimal inventoryTurnoverRatio = BigDecimal.ZERO;

    @Column(name = "GeneratedAt", nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();

    public KpiSnapshot() {}

    public Long getSnapshotId() {
        return snapshotId;
    }

    public void setSnapshotId(Long snapshotId) {
        this.snapshotId = snapshotId;
    }

    public LocalDate getSnapshotDate() {
        return snapshotDate;
    }

    public void setSnapshotDate(LocalDate snapshotDate) {
        this.snapshotDate = snapshotDate;
    }

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

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
