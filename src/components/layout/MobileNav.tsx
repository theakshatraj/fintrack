import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Menu, X } from 'lucide-react';

interface MobileNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
  ];

  return (
    <div className="md:hidden flex items-center justify-between px-6 py-4 bg-bg2 border-b border-border sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-accent rounded flex items-center justify-center text-bg font-bold text-sm">
          F
        </div>
        <h1 className="text-lg font-bold tracking-tight text-text">Fintrack</h1>
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="text-text">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-bg2 border-b border-border animate-fade-in shadow-xl">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-bg font-semibold shadow-lg shadow-accent/20'
                      : 'text-muted hover:bg-bg3 hover:text-text'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
