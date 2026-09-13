import React, { useEffect, useState } from 'react';
import { businessApi } from '../../../shared/api/businessApi';
import { AuditLog } from '../../../shared/types';
import { Badge } from '../../../shared/components/Badge';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter criteria
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionSearch, setActionSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, [moduleFilter, severityFilter]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await businessApi.getAuditLogs({
        moduleName: moduleFilter || undefined,
        action: actionSearch || undefined,
        username: userSearch || undefined,
        severity: severityFilter || undefined,
      });
      setLogs(data.content);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['LogId', 'Timestamp', 'Username', 'Action', 'Module', 'Severity', 'IP_Address', 'Details'];
    const rows = logs.map((l) => [
      l.logId,
      `"${l.createdAt}"`,
      `"${l.username}"`,
      `"${l.action}"`,
      `"${l.moduleName}"`,
      `"${l.severity}"`,
      `"${l.ipAddress || ''}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NovaMart_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>System Audit Trail & Compliance</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Immutable chronological logging of all transactional events across the inventory lifecycle.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadAuditLogs} className="btn btn-secondary btn-sm">
            ↻ Refresh Log
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary btn-sm">
            📥 Export Audit CSV
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        <div style={{ flex: '1 1 200px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search action (e.g. LOGIN, UPDATE)..."
            value={actionSearch}
            onChange={(e) => setActionSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadAuditLogs()}
          />
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <select
            className="form-control"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            <option value="">All Operational Modules</option>
            <option value="BUSINESS_MANAGEMENT">Business Management</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="WAREHOUSE_OPS">Warehouse Operations</option>
            <option value="SALES_FULFILLMENT">Sales Fulfillment</option>
            <option value="INVENTORY_PLANNING">Inventory Planning</option>
            <option value="FINANCE">Finance & Cost</option>
            <option value="PROCUREMENT">Procurement</option>
          </select>
        </div>

        <div style={{ flex: '1 1 140px' }}>
          <select
            className="form-control"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        <button onClick={loadAuditLogs} className="btn btn-primary btn-sm" style={{ padding: '10px 16px' }}>
          Filter
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Log ID</th>
              <th>Date & Time</th>
              <th>Operator</th>
              <th>Action Code</th>
              <th>Module</th>
              <th>IP Address</th>
              <th>Details / Payload</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading audit logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                  No audit logs matching current filter.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.logId}>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>#{log.logId}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{log.username}</span>
                  </td>
                  <td>
                    <code
                      style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        color: '#c7d2fe',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {log.action}
                    </code>
                  </td>
                  <td style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600 }}>
                    {log.moduleName}
                  </td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                  <td style={{ color: 'var(--text-main)', fontSize: '0.825rem', maxWidth: '340px' }}>
                    {log.details}
                  </td>
                  <td>
                    <Badge
                      variant={
                        log.severity === 'CRITICAL'
                          ? 'danger'
                          : log.severity === 'ERROR'
                          ? 'danger'
                          : log.severity === 'WARNING'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {log.severity}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
