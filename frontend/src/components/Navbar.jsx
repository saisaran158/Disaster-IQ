import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from './Icons';

export const Navbar = () => {
  const { role, setRole, notifications, markNotificationsRead, studentProfile } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels = {
    'PUBLIC': { label: 'Public View', icon: 'shield', color: 'bg-purple-950/60 text-purple-200 border-purple-700/50' },
    'STUDENT': { label: 'Student: Rohan Verma', icon: 'graduation-cap', color: 'bg-purple-600/30 text-purple-200 border-purple-500/60 shadow-md shadow-purple-900/30' },
    'TEACHER': { label: 'Teacher: Anita Sharma', icon: 'book-open', color: 'bg-violet-600/30 text-violet-200 border-violet-500/60 shadow-md shadow-violet-900/30' },
    'PARENT': { label: 'Parent: Rajesh Verma', icon: 'users', color: 'bg-fuchsia-600/30 text-fuchsia-200 border-fuchsia-500/60 shadow-md shadow-fuchsia-900/30' },
    'ADMIN': { label: 'Admin: Admin', icon: 'building', color: 'bg-amber-600/30 text-amber-200 border-amber-500/60 shadow-md shadow-amber-900/30' },
    'DISTRICT': { label: 'District Collector: Smt. M. Sundaram', icon: 'award', color: 'bg-indigo-600/30 text-indigo-200 border-indigo-500/60 shadow-md shadow-indigo-900/30' }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#07040a]/85 backdrop-blur-xl border-b border-purple-900/40 px-4 md:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setRole('PUBLIC')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 group-hover:shadow-purple-500/50 transition-all duration-300">
            <Icon name="shield" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-sans">Disaster<span className="text-purple-400 purple-glow-text">IQ</span></span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-sm">
                AI Platform
              </span>
            </div>
            <span className="text-[11px] text-purple-300/70 font-medium hidden sm:block">Disaster Preparedness for Schools</span>
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-3">
          {/* Role Switcher Dropdown */}
          <div className="relative flex items-center gap-2">
            <span className="text-xs text-purple-300/70 font-medium hidden md:block">Active Role:</span>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none bg-[#130b24] border border-purple-800/60 hover:border-purple-500/80 text-xs font-bold text-purple-100 py-2.5 pl-3.5 pr-8 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 shadow-md shadow-black/40"
              >
                <option value="PUBLIC">🌐 Landing / Public</option>
                <option value="STUDENT">🎓 Student Portal</option>
                <option value="TEACHER">👩‍🏫 Teacher Portal</option>
                <option value="PARENT">👨‍👩‍👧 Parent Portal</option>
                <option value="ADMIN">🏫 School Admin Portal</option>
                <option value="DISTRICT">🏛️ District Collector</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
                <Icon name="chevron-right" size={14} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Role Badge Indicator */}
          <div className={`hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-300 ${roleLabels[role]?.color}`}>
            <Icon name={roleLabels[role]?.icon} size={14} />
            <span>{roleLabels[role]?.label}</span>
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifs(!showNotifs);
                if (!showNotifs) markNotificationsRead();
              }}
              className="p-2.5 rounded-xl bg-[#130b24] border border-purple-800/60 text-purple-300 hover:text-white hover:border-purple-500/80 hover:shadow-lg hover:shadow-purple-950/50 transition-all duration-200 relative"
            >
              <Icon name="bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse shadow-md shadow-purple-500/50">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifs && (
              <div className="absolute right-0 mt-3 w-80 bg-[#120b20] border-2 border-purple-500/60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 p-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-purple-900/60">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Icon name="bell" size={14} className="text-purple-400" />
                    <span>Notifications</span>
                  </h4>
                  <span className="text-[10px] text-purple-300 font-semibold bg-purple-950 px-2 py-0.5 rounded-full border border-purple-700/50">{notifications.length} total</span>
                </div>
                <div className="py-2 space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 rounded-xl bg-[#180f2b] border border-purple-700/50 text-xs hover:border-purple-500/60 transition-colors shadow-md">
                      <p className="text-purple-100 font-medium leading-snug">{n.text}</p>
                      <span className="text-[10px] text-purple-400 mt-1.5 block font-mono">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

