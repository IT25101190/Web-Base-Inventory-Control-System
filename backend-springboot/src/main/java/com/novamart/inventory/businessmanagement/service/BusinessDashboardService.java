package com.novamart.inventory.businessmanagement.service;

import com.novamart.inventory.businessmanagement.dto.BusinessKpiDto;

public interface BusinessDashboardService {

    BusinessKpiDto getExecutiveKpis();

    void captureKpiSnapshot();
}
