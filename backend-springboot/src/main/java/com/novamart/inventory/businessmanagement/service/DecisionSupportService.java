package com.novamart.inventory.businessmanagement.service;

import com.novamart.inventory.businessmanagement.dto.DecisionReportDto;

public interface DecisionSupportService {

    DecisionReportDto generateMonthlyDecisionReport();
}
