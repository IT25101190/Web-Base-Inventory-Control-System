import React, { useEffect, useState } from 'react';
import { businessApi } from '../../../shared/api/businessApi';
import { DecisionReport } from '../../../shared/types';
import { Badge } from '../../../shared/components/Badge';

export const DecisionReportsPage: React.FC = () => {
  const [report, setReport] = useState<DecisionReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await businessApi.getDecisionReport();
      setReport(data);
    } catch (err) {
      console.error('Failed to load decision report', err);
    } finally {
      setLoading(false);
    }
  };

  const formatLKR = (val: number) => {
    return 'LKR ' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  if (loading || !report) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        Generating automated business decision intelligence report...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Report Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{report.title}</h1>
            <Badge variant="info">{report.reportId}</Badge>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Comprehensive operational analysis, stock-out risk evaluation, and replenishment recommendations.
          </p>
        </div>

        <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Executive Summary & Health Score Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))',
          borderColor: 'rgba(99, 102, 241, 0.3)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Executive Summary • {report.reportPeriod}
            </div>
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', marginTop: '8px', lineHeight: 1.6 }}>
              {report.executiveSummary}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 28px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Stock Health Score
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '2px' }}>
              {report.stockHealthScore}%
            </div>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>OPTIMAL RANGE</span>
          </div>
        </div>
      </div>

      {/* Stock-Out Risk Alerts */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fda4af' }}>
              ⚠️ Immediate Stock-Out Risk Assessment
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Items currently at or below minimum threshold requiring replenishment
            </p>
          </div>
          <Badge variant="danger">{report.stockRiskAlerts.length} Critical Risks</Badge>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU Code</th>
                <th>Item Description</th>
                <th>Current Stock</th>
                <th>Safety Threshold</th>
                <th>Deficit</th>
                <th>Severity Status</th>
              </tr>
            </thead>
            <tbody>
              {report.stockRiskAlerts.map((item) => (
                <tr key={item.sku}>
                  <td>
                    <code style={{ fontWeight: 700, color: '#fff' }}>{item.sku}</code>
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.itemName}</td>
                  <td style={{ fontWeight: 700, color: item.riskLevel === 'CRITICAL' ? '#fb7185' : '#fbbf24' }}>
                    {item.currentStock} units
                  </td>
                  <td style={{ color: 'var(--text-dim)' }}>{item.minLevel} units</td>
                  <td style={{ color: '#fb7185', fontWeight: 700 }}>
                    -{item.minLevel - item.currentStock} units
                  </td>
                  <td>
                    <Badge variant={item.riskLevel === 'CRITICAL' ? 'danger' : 'warning'}>
                      {item.riskLevel}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fast Moving vs. Dead Stock Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Fast Moving */}
        <div className="card">
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              ⚡ High-Velocity Items (Fast-Moving)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Top turnover SKUs generating regular cash inflows
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {report.fastMovingItems.map((item) => (
              <div
                key={item.sku}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem' }}>{item.itemName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.sku} • {item.monthlyUnitsSold} units sold/mo</div>
                </div>
                <Badge variant="success">{item.turnoverRate}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Dead Stock / Capital At Risk */}
        <div className="card">
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
              🛑 Obsolescence & Slow-Moving Capital
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Tied capital with warehouse duration over 90 days
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {report.deadStockItems.map((item) => (
              <div
                key={item.sku}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem' }}>{item.itemName}</span>
                  <span style={{ fontWeight: 700, color: '#fbbf24' }}>{formatLKR(item.tiedCapital)}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Age: {item.daysInWarehouse} days in warehouse
                </div>
                <div style={{ fontSize: '0.775rem', color: '#cbd5e1', marginTop: '6px', fontStyle: 'italic' }}>
                  Action: {item.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="card">
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
            🎯 Decision Intelligence & Strategic Recommendations
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            System-generated operational actions for executive sign-off
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {report.strategicRecommendations.map((rec, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {rec}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
