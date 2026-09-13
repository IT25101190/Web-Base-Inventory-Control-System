import { springBootClient } from './axiosClients';
import { ApiResponse, BusinessKPIs, PagedResponse, User, Role, AuditLog, DecisionReport } from '../types';

export const businessApi = {
  // Executive Dashboard KPIs
  getDashboardKpis: async (): Promise<BusinessKPIs> => {
    try {
      const res = await springBootClient.get<ApiResponse<BusinessKPIs>>('/api/business/dashboard/kpis');
      return res.data.data;
    } catch (err) {
      console.warn('Backend offline, returning mock KPIs for preview');
      return {
        totalInventoryValue: 2845300,
        totalItemsCount: 10,
        lowStockCount: 3,
        activeOrdersCount: 18,
        monthlyRevenue: 4890000,
        inventoryTurnoverRatio: 4.25,
        totalUsersCount: 6,
        activeSuppliersCount: 5,
        calculatedAt: new Date().toISOString(),
        categoryValuation: [
          { category: 'Electronics', value: 1250000, itemCount: 3, color: '#6366f1' },
          { category: 'Hardware', value: 620000, itemCount: 2, color: '#10b981' },
          { category: 'Packaging', value: 580300, itemCount: 3, color: '#f59e0b' },
          { category: 'Stationery', value: 215000, itemCount: 1, color: '#8b5cf6' },
          { category: 'Safety Equipment', value: 180000, itemCount: 1, color: '#ec4899' },
        ],
        revenueTrend: [
          { month: 'Apr', revenue: 3800000, inventoryValue: 2600000 },
          { month: 'May', revenue: 4150000, inventoryValue: 2720000 },
          { month: 'Jun', revenue: 4400000, inventoryValue: 2650000 },
          { month: 'Jul', revenue: 4200000, inventoryValue: 2790000 },
          { month: 'Aug', revenue: 4650000, inventoryValue: 2810000 },
          { month: 'Sep', revenue: 4890000, inventoryValue: 2845300 },
        ],
      };
    }
  },

  // Users Management
  getUsers: async (search = '', isActive?: boolean, page = 0, size = 10): Promise<PagedResponse<User>> => {
    try {
      const params: any = { page, size };
      if (search) params.search = search;
      if (isActive !== undefined) params.isActive = isActive;
      const res = await springBootClient.get<ApiResponse<PagedResponse<User>>>('/api/business/users', { params });
      return res.data.data;
    } catch (err) {
      return {
        content: [
          { userId: 1, username: 'admin', fullName: 'Saman Jayawardena', email: 'owner@novamart.lk', phoneNumber: '+94771234560', isActive: true, roles: ['BUSINESS_OWNER'], createdAt: '2026-09-01T08:00:00Z', lastLoginAt: '2026-09-13T10:15:00Z' },
          { userId: 2, username: 'warehouse_mgr', fullName: 'Kasun Perera', email: 'warehouse@novamart.lk', phoneNumber: '+94771234561', isActive: true, roles: ['WAREHOUSE_MANAGER'], createdAt: '2026-09-01T08:30:00Z', lastLoginAt: '2026-09-13T09:40:00Z' },
          { userId: 3, username: 'store_ops', fullName: 'Dilshan Silva', email: 'storeops@novamart.lk', phoneNumber: '+94771234562', isActive: true, roles: ['STORE_OPERATIONS_SUPERVISOR'], createdAt: '2026-09-01T08:45:00Z', lastLoginAt: '2026-09-12T16:20:00Z' },
          { userId: 4, username: 'inventory_clerk', fullName: 'Nimesha Fernando', email: 'clerk@novamart.lk', phoneNumber: '+94771234563', isActive: true, roles: ['INVENTORY_CLERK'], createdAt: '2026-09-01T09:00:00Z', lastLoginAt: '2026-09-13T08:05:00Z' },
          { userId: 5, username: 'finance_mgr', fullName: 'Chamari Wickramasinghe', email: 'finance@novamart.lk', phoneNumber: '+94771234564', isActive: true, roles: ['FINANCE_MANAGER'], createdAt: '2026-09-01T09:15:00Z', lastLoginAt: '2026-09-13T11:00:00Z' },
          { userId: 6, username: 'procure_coord', fullName: 'Roshan Senanayake', email: 'procurement@novamart.lk', phoneNumber: '+94771234565', isActive: true, roles: ['PROCUREMENT_COORDINATOR'], createdAt: '2026-09-01T09:30:00Z', lastLoginAt: '2026-09-12T14:30:00Z' },
        ],
        page: 0,
        size: 10,
        totalElements: 6,
        totalPages: 1,
        last: true,
      };
    }
  },

  createUser: async (payload: any): Promise<User> => {
    const res = await springBootClient.post<ApiResponse<User>>('/api/business/users', payload);
    return res.data.data;
  },

  updateUser: async (id: number, payload: any): Promise<User> => {
    const res = await springBootClient.put<ApiResponse<User>>(`/api/business/users/${id}`, payload);
    return res.data.data;
  },

  toggleUserStatus: async (id: number, active: boolean): Promise<void> => {
    await springBootClient.patch(`/api/business/users/${id}/status?active=${active}`);
  },

  deleteUser: async (id: number): Promise<void> => {
    await springBootClient.delete(`/api/business/users/${id}`);
  },

  getAllRoles: async (): Promise<Role[]> => {
    try {
      const res = await springBootClient.get<ApiResponse<Role[]>>('/api/business/roles');
      return res.data.data;
    } catch {
      return [
        { roleId: 1, roleName: 'BUSINESS_OWNER', description: 'Executive authority with access to dashboards, KPIs, user management, and decision reports' },
        { roleId: 2, roleName: 'WAREHOUSE_MANAGER', description: 'Oversees goods receipts, warehouse inventory allocations, and internal stock transfers' },
        { roleId: 3, roleName: 'STORE_OPERATIONS_SUPERVISOR', description: 'Supervises order fulfillment, stock availability verification, and delivery schedules' },
        { roleId: 4, roleName: 'INVENTORY_CLERK', description: 'Manages inventory master records, tracks reorder points, and requests replenishment' },
        { roleId: 5, roleName: 'FINANCE_MANAGER', description: 'Monitors purchase costs, inventory valuation, and manages supplier payment records' },
        { roleId: 6, roleName: 'PROCUREMENT_COORDINATOR', description: 'Manages supplier profiles, purchase orders, and supplier lifecycle evaluations' },
      ];
    }
  },

  // Audit Logs
  getAuditLogs: async (filters: any = {}): Promise<PagedResponse<AuditLog>> => {
    try {
      const res = await springBootClient.get<ApiResponse<PagedResponse<AuditLog>>>('/api/business/audit-logs', { params: filters });
      return res.data.data;
    } catch {
      return {
        content: [
          { logId: 101, username: 'admin', action: 'UPDATE_ROLE', moduleName: 'BUSINESS_MANAGEMENT', ipAddress: '192.168.1.10', details: 'Granted WAREHOUSE_MANAGER permissions to user kasun.p', severity: 'INFO', createdAt: new Date().toISOString() },
          { logId: 102, username: 'inventory_clerk', action: 'REPLENISHMENT_REQ', moduleName: 'INVENTORY_PLANNING', ipAddress: '192.168.1.24', details: 'Triggered replenishment request for SKU-ELEC-002 (40 units)', severity: 'INFO', createdAt: new Date(Date.now() - 1800000).toISOString() },
          { logId: 103, username: 'store_ops', action: 'ORDER_FULFILL_ALLOCATE', moduleName: 'SALES_FULFILLMENT', ipAddress: '192.168.1.18', details: 'Allocated 15 units of SKU-ELEC-001 for SO-2026-004', severity: 'INFO', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { logId: 104, username: 'system_security', action: 'FAILED_LOGIN_ATTEMPT', moduleName: 'AUTHENTICATION', ipAddress: '203.94.75.12', details: 'Repeated failed login attempt on user: admin', severity: 'WARNING', createdAt: new Date(Date.now() - 7200000).toISOString() },
          { logId: 105, username: 'warehouse_mgr', action: 'CORRECT_GRN_RECORD', moduleName: 'WAREHOUSE_OPS', ipAddress: '192.168.1.15', details: 'Corrected received quantity on GRN-2026-009 from 100 to 95 units due to transit damage', severity: 'WARNING', createdAt: new Date(Date.now() - 14400000).toISOString() },
        ],
        page: 0,
        size: 15,
        totalElements: 5,
        totalPages: 1,
        last: true,
      };
    }
  },

  // Decision Support Report
  getDecisionReport: async (): Promise<DecisionReport> => {
    try {
      const res = await springBootClient.get<ApiResponse<DecisionReport>>('/api/business/decision-reports/current');
      return res.data.data;
    } catch {
      return {
        reportId: 'REP-BM-202609',
        title: 'Executive Inventory & Operations Decision Intelligence Report',
        reportPeriod: 'September 2026',
        stockHealthScore: 87.5,
        executiveSummary: 'NovaMart Trading overall inventory turnover stands at 4.25x per annum, maintaining healthy stock liquidity. However, 3 SKUs currently breach the minimum safety threshold, requiring immediate replenishment PO execution. Electronics category drives 44% of inventory valuation, with fast stock velocity.',
        stockRiskAlerts: [
          { sku: 'SKU-SAFE-002', itemName: 'Warehouse High-Visibility Reflective Vest', currentStock: 3, minLevel: 10, riskLevel: 'CRITICAL' },
          { sku: 'SKU-STAT-002', itemName: 'Heavy Duty Tape Dispenser 3-inch', currentStock: 5, minLevel: 10, riskLevel: 'HIGH' },
          { sku: 'SKU-ELEC-002', itemName: 'Nova USB-C Fast Charging Hub 65W', currentStock: 8, minLevel: 15, riskLevel: 'HIGH' },
        ],
        fastMovingItems: [
          { sku: 'SKU-STAT-001', itemName: 'Industrial Barcode Thermal Labels (1000s)', turnoverRate: '8.2x', monthlyUnitsSold: 240 },
          { sku: 'SKU-CONS-001', itemName: 'Kraft Corrugated Shipping Boxes (L)', turnoverRate: '6.5x', monthlyUnitsSold: 180 },
          { sku: 'SKU-ELEC-001', itemName: 'Nova Pro Smart Router AC1200', turnoverRate: '5.1x', monthlyUnitsSold: 95 },
        ],
        deadStockItems: [
          { sku: 'SKU-TOOL-001', itemName: 'Precision Electronic Tool Kit 32-in-1', daysInWarehouse: 110, tiedCapital: 186000, recommendation: 'Apply 15% bundle discount to accelerate clearance' },
        ],
        strategicRecommendations: [
          'Fast-track approval of Replenishment Request #1 (USB-C Hubs) to prevent sales order fulfillment stalls.',
          'Negotiate volume-tier pricing with Lanka Packaging Solutions to capture a 6% margin improvement on shipping boxes.',
          'Transition dead-stock items (SKU-TOOL-001) into promotional electronics bundles for Q4.',
          'Review warehouse space allocation in Bay B: High-turnover packaging items should be relocated nearer to the packing dock.',
        ],
      };
    }
  },
};
