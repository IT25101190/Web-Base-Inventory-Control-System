import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentModule: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentModule }) => {
  const { user, logout, switchRolePersona } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const personas = [
    { role: 'BUSINESS_OWNER', label: 'Business Owner (Executive)', icon: '👑' },
    { role: 'WAREHOUSE_MANAGER', label: 'Warehouse Manager', icon: '📦' },
    { role: 'STORE_OPERATIONS_SUPERVISOR', label: 'Store Operations Supervisor', icon: '🛒' },
    { role: 'INVENTORY_CLERK', label: 'Inventory Clerk', icon: '📋' },
    { role: 'FINANCE_MANAGER', label: 'Finance Manager', icon: '💳' },
    { role: 'PROCUREMENT_COORDINATOR', label: 'Procurement Coordinator', icon: '🤝' },
  ];

  const currentRole = user?.roles?.[0] || 'BUSINESS_OWNER';

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', textTransform: 'capitalize' }}>
            {currentModule.replace('-', ' ')}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            NovaMart Trading (Pvt) Ltd • Inventory Control System
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Role Persona Switcher for easy testing */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-full)',
              color: '#c7d2fe',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>Persona:</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>
              {currentRole.replace(/_/g, ' ')}
            </span>
            <span style={{ fontSize: '0.65rem' }}>▼</span>
          </button>

          {showPersonaMenu && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '260px',
                background: '#151d30',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 100,
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', padding: '6px 10px', textTransform: 'uppercase', fontWeight: 700 }}>
                Switch Role Persona
              </div>
              {personas.map((p) => (
                <button
                  key={p.role}
                  onClick={() => {
                    switchRolePersona(p.role);
                    setShowPersonaMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: currentRole === p.role ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    border: 'none',
                    color: currentRole === p.role ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}
          >
            {user?.fullName?.charAt(0) || 'U'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              {user?.fullName || 'Saman Jayawardena'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              {user?.email || 'owner@novamart.lk'}
            </span>
          </div>

          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: '8px', padding: '6px 10px' }}
            title="Log Out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
