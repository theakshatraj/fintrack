import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

type Page = 'dashboard' | 'transactions' | 'insights';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const { loadFromStorage } = useStore();

  useEffect(() => {
    // Apply dark theme immediately — no flash
    document.documentElement.setAttribute('data-theme', 'dark');
    loadFromStorage();
  }, [loadFromStorage]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <DashboardPage />;
      case 'transactions': return <TransactionsPage />;
      case 'insights':     return <InsightsPage />;
      default:             return <DashboardPage />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar
        activePage={activePage}
        onNavigate={page => setActivePage(page)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <MobileNav
          activePage={activePage}
          setActivePage={page => setActivePage(page as Page)}
        />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;