package com.novamart.inventory.businessmanagement.repository;

import com.novamart.inventory.businessmanagement.model.KpiSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KpiSnapshotRepository extends JpaRepository<KpiSnapshot, Long> {

    Optional<KpiSnapshot> findTopByOrderByGeneratedAtDesc();

    @Query("SELECT k FROM KpiSnapshot k ORDER BY k.snapshotDate DESC")
    List<KpiSnapshot> findRecentSnapshots();
}
