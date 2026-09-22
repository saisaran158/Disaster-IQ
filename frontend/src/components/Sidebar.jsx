import React from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from './Icons';

export const Sidebar = ({ activeTab, onSelectTab }) => {
  const { role, setRole, logout } = useApp() || {};

  // Role-specific navigation items
  const getNavItems = () => {
    switch (role) {
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'my-assignments', label: 'My assignments', icon: 'my-assignments' },
          { id: 'ai-path', label: 'AI Learning path', icon: 'ai-path' },
          { id: 'profile', label: 'Profile', icon: 'profile' }
        ];
      case 'TEACHER':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'assignment', label: 'Assignment', icon: 'assignment' },
          { id: 'students', label: 'Students', icon: 'students' },
          { id: 'approvals', label: 'Parent Approvals', icon: 'shield' },
          { id: 'profile', label: 'Profile', icon: 'profile' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ];
      case 'PARENT':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'assignment', label: 'Assignment', icon: 'assignment' },
          { id: 'my-children', label: 'My Children', icon: 'my-children' },
          { id: 'profile', label: 'Profile', icon: 'profile' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ];
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'approvals', label: 'Teacher Approvals', icon: 'shield' },
          { id: 'users', label: 'Users', icon: 'students' },
          { id: 'assignment', label: 'Assignment', icon: 'assignment' },
          { id: 'system-logs', label: 'System Logs', icon: 'file-text' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ];
      case 'DISTRICT':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'profile', label: 'Profile', icon: 'profile' },
          { id: 'settings', label: 'Settings', icon: 'settings' }
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'home' },
          { id: 'profile', label: 'Profile', icon: 'profile' }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-[#0a0512] text-white h-screen flex flex-col shrink-0 border-r border-purple-900/40 shadow-2xl z-30">
      {/* Top Brand Logo - Clicking takes back to Public Landing Page */}
      <button
        onClick={() => setRole('PUBLIC')}
        className="p-6 border-b border-purple-900/40 space-y-1.5 text-left hover:bg-purple-950/40 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-700 to-violet-500 p-2 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Icon name="logo-shield" size={24} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Disaster<span className="text-purple-400 purple-glow-text">IQ</span>
          </span>
        </div>
        <span className="text-xs text-purple-300/70 font-medium block pt-0.5">
          Prepare today, safe tomorrow
        </span>
      </button>

      {/* Nav Menu */}
      <nav className="flex-1 py-6 px-3.5 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-extrabold transition-all duration-200 text-left cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-lg shadow-purple-600/40 border border-purple-400/30 scale-[1.02]'
                  : 'text-purple-200/70 hover:bg-purple-950/50 hover:text-white hover:border hover:border-purple-800/40'
              }`}
            >
              <Icon name={item.icon} size={20} className={isActive ? 'text-white' : 'text-purple-400/80'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Sign Out Button */}
      <div className="p-4 border-t border-purple-900/40 mt-auto bg-[#07040a]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-extrabold text-rose-400 hover:bg-rose-950/30 hover:border hover:border-rose-900/40 hover:text-rose-300 transition-all text-left cursor-pointer"
        >
          <Icon name="log-out" size={20} className="text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

