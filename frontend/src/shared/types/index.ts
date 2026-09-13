export type UserRole =
  | 'BUSINESS_OWNER'
  | 'WAREHOUSE_MANAGER'
  | 'STORE_OPERATIONS_SUPERVISOR'
  | 'INVENTORY_CLERK'
  | 'FINANCE_MANAGER'
  | 'PROCUREMENT_COORDINATOR';

export interface User {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  roles: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

export interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

export interface BusinessKPIs {
  totalInventoryValue: number;
  totalItemsCount: number;
  lowStockCount: number;
  activeOrdersCount: number;
  monthlyRevenue: number;
  inventoryTurnoverRatio: number;
  totalUsersCount: number;
  activeSuppliersCount: number;
  calculatedAt: string;
  categoryValuation?: { category: string; value: number; itemCount: number; color: string }[];
  revenueTrend?: { month: string; revenue: number; inventoryValue: number }[];
}

export interface AuditLog {
  logId: number;
  userId?: number;
  username: string;
  action: string;
  moduleName: string;
  ipAddress?: string;
  details?: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  createdAt: string;
}

export interface DecisionReport {
  reportId: string;
  title: string;
  reportPeriod: string;
  executiveSummary: string;
  stockHealthScore: number;
  stockRiskAlerts: { sku: string; itemName: string; currentStock: number; minLevel: number; riskLevel: string }[];
  fastMovingItems: { sku: string; itemName: string; turnoverRate: string; monthlyUnitsSold: number }[];
  deadStockItems: { sku: string; itemName: string; daysInWarehouse: number; tiedCapital: number; recommendation: string }[];
  strategicRecommendations: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
