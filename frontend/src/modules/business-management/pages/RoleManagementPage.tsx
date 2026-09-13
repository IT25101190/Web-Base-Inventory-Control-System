import React from 'react';
import { Badge } from '../../../shared/components/Badge';

export const RoleManagementPage: React.FC = () => {
  const rolesMatrix = [
    {
      role: 'BUSINESS_OWNER',
      title: 'Business Owner',
      desc: 'Full operational & executive control. Access to company valuation, audit reports, decision support, and user security.',
      badge: 'Executive',
      color: '#6366f1',
      permissions: {
        dashboardKpis: true,
        userAdmin: true,
        auditTrail: true,
        decisionReports: true,
        itemMasterEdit: true,
        grnEntry: true,
        salesConfirm: true,
        replenishRequest: true,
        poApproval: true,
        financeReports: true,
      },
    },
    {
      role: 'WAREHOUSE_MANAGER',
      title: 'Warehouse Manager',
      desc: 'Controls physical goods intake (GRN), internal stock relocations, bin allocations, and GRN corrections.',
      badge: 'Operations',
      color: '#06b6d4',
      permissions: {
        dashboardKpis: false,
        userAdmin: false,
        auditTrail: false,
        decisionReports: false,
        itemMasterEdit: false,
        grnEntry: true,
        salesConfirm: false,
        replenishRequest: true,
        poApproval: false,
        financeReports: false,
      },
    },
    {
      role: 'STORE_OPERATIONS_SUPERVISOR',
      title: 'Store Operations Supervisor',
      desc: 'Manages sales order reservations, stock availability checks, customer dispatching, and return intake.',
      badge: 'Fulfillment',
      color: '#10b981',
      permissions: {
        dashboardKpis: false,
        userAdmin: false,
        auditTrail: false,
        decisionReports: false,
        itemMasterEdit: false,
        grnEntry: false,
        salesConfirm: true,
        replenishRequest: true,
        poApproval: false,
        financeReports: false,
      },
    },
    {
      role: 'INVENTORY_CLERK',
      title: 'Inventory Planning Clerk',
      desc: 'Maintains SKU master records, tracks minimum stock/reorder points, and issues replenishment requests.',
      badge: 'Planning',
      color: '#f59e0b',
      permissions: {
        dashboardKpis: false,
        userAdmin: false,
        auditTrail: false,
        decisionReports: false,
        itemMasterEdit: true,
        grnEntry: false,
        salesConfirm: false,
        replenishRequest: true,
        poApproval: false,
        financeReports: false,
      },
    },
    {
      role: 'FINANCE_MANAGER',
      title: 'Financial & Cost Manager',
      desc: 'Calculates total inventory valuation, records unit purchase costs, handles supplier payments and reports.',
      badge: 'Finance',
      color: '#8b5cf6',
      permissions: {
        dashboardKpis: true,
        userAdmin: false,
        auditTrail: true,
        decisionReports: true,
        itemMasterEdit: false,
        grnEntry: false,
        salesConfirm: false,
        replenishRequest: false,
        poApproval: false,
        financeReports: true,
      },
    },
    {
      role: 'PROCUREMENT_COORDINATOR',
      title: 'Procurement Coordinator',
      desc: 'Converts replenishment requests into Purchase Orders, tracks supplier ratings, contracts, and delivery statuses.',
      badge: 'Procurement',
      color: '#ec4899',
      permissions: {
        dashboardKpis: false,
        userAdmin: false,
        auditTrail: false,
        decisionReports: false,
        itemMasterEdit: false,
        grnEntry: false,
        salesConfirm: false,
        replenishRequest: false,
        poApproval: true,
        financeReports: false,
      },
    },
  ];

  const permissionHeaders = [
    { key: 'dashboardKpis', label: 'Executive KPIs' },
    { key: 'userAdmin', label: 'User Admin' },
    { key: 'auditTrail', label: 'Audit Trail' },
    { key: 'decisionReports', label: 'Decision Reports' },
    { key: 'itemMasterEdit', label: 'Item Master' },
    { key: 'grnEntry', label: 'Goods Receipt' },
    { key: 'salesConfirm', label: 'Sales Orders' },
    { key: 'replenishRequest', label: 'Replenishment' },
    { key: 'poApproval', label: 'Purchase Orders' },
    { key: 'financeReports', label: 'Financial Cost' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Role-Based Access Control (RBAC) Matrix</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
          Configured separation of duties for NovaMart Trading's 6 core operational roles.
        </p>
      </div>

      {/* Role Cards Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {rolesMatrix.map((r) => (
          <div key={r.role} className="card" style={{ borderLeft: `4px solid ${r.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{r.title}</h3>
                <code style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{r.role}</code>
              </div>
              <Badge variant="info">{r.badge}</Badge>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px', lineHeight: 1.5 }}>
              {r.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Permission Matrix Table */}
      <div className="card">
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>System Permission Entitlements Matrix</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Enforced by Spring Boot Method Security (`@PreAuthorize`) and frontend route guards.
          </p>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ minWidth: '220px' }}>Role Persona</th>
                {permissionHeaders.map((p) => (
                  <th key={p.key} style={{ textAlign: 'center', fontSize: '0.7rem' }}>
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rolesMatrix.map((r) => (
                <tr key={r.role}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{r.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{r.role}</div>
                  </td>
                  {permissionHeaders.map((p) => {
                    const hasPerm = (r.permissions as any)[p.key];
                    return (
                      <td key={p.key} style={{ textAlign: 'center' }}>
                        {hasPerm ? (
                          <span style={{ color: 'var(--accent-emerald)', fontWeight: 800, fontSize: '1rem' }}>✓</span>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.9rem' }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
