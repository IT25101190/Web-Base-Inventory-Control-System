import React, { useState } from 'react';
import { useAuth } from './shared/context/AuthContext';
import { Sidebar } from './shared/components/Sidebar';
import { Navbar } from './shared/components/Navbar';
import { LoginPage } from './pages/LoginPage';

// Module 1: Business Management & Decision Support Pages
import { BusinessDashboardPage } from './modules/business-management/pages/BusinessDashboardPage';
import { UserManagementPage } from './modules/business-management/pages/UserManagementPage';
import { RoleManagementPage } from './modules/business-management/pages/RoleManagementPage';
import { AuditLogsPage } from './modules/business-management/pages/AuditLogsPage';
import { DecisionReportsPage } from './modules/business-management/pages/DecisionReportsPage';

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <BusinessDashboardPage onNavigate={setActiveTab} />;
      case 'users':
        return <UserManagementPage />;
      case 'roles':
        return <RoleManagementPage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      case 'decision-reports':
        return <DecisionReportsPage />;
      default:
        return <BusinessDashboardPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Navbar currentModule={activeTab} />
        <main className="page-body">{renderActiveModule()}</main>
      </div>
    </div>
  );
};
