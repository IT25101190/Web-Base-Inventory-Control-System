import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navSections = [
    {
      section: 'Business Management & Support',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: '📊', badge: 'Active' },
        { id: 'users', label: 'User & Account Mgmt', icon: '👥' },
        { id: 'roles', label: 'Roles & Permissions', icon: '🛡️' },
        { id: 'audit-logs', label: 'Audit Trail & Compliance', icon: '📜' },
        { id: 'decision-reports', label: 'Decision Intelligence', icon: '💡' },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          }}
        >
          N
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.02em' }}>
            NovaMart
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.05em' }}>
            BUSINESS MANAGEMENT
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ padding: '18px 12px', flex: 1, overflowY: 'auto' }}>
        {navSections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '22px' }}>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-dim)',
                padding: '0 12px 8px 12px',
              }}
            >
              {section.section}
            </div>

            {section.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.18), rgba(99, 102, 241, 0.05))' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    textAlign: 'left',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.05rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: '#a5b4fc',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Module 1 • Spring Boot</span>
        <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>● Core API: 8080</span>
      </div>
    </aside>
  );
};
