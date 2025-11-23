
import React from 'react';
import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavIcon: React.FC<{ page: Page }> = ({ page }) => {
    if (page === Page.Dashboard) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"></rect>
              <rect width="7" height="5" x="14" y="3" rx="1"></rect>
              <rect width="7" height="9" x="14" y="12" rx="1"></rect>
              <rect width="7" height="5" x="3" y="16" rx="1"></rect>
            </svg>
        );
    }
    if (page === Page.Diagnostics) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
        );
    }
    return null;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { page: Page.Dashboard, label: 'Tablero' },
    { page: Page.Diagnostics, label: 'Diagnóstico' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-md border-t border-gray-700/50 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-40">
      <div className="flex justify-around max-w-lg mx-auto">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`flex-1 flex flex-col items-center justify-center pt-3 pb-2 transition-colors duration-200 ${
              currentPage === item.page ? 'text-theme' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <NavIcon page={item.page} />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
            {currentPage === item.page && (
              <div className="w-8 h-1 bg-theme rounded-full mt-1 shadow-theme"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
