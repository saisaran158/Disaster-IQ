import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from './Icons';
import { EditProfileModal } from './EditProfileModal';

export const Header = ({ title = "Welcome back!", subtitle = "Stay prepared, Stay safe", onOpenProfileTab }) => {
  const { role, setRole, theme, toggleTheme, userProfile, logout } = useApp() || {};
  const profile = userProfile || { name: 'User', email: '', className: '', avatar: '👤', age: '' };
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <header className="relative z-40 bg-[#07040a]/95 backdrop-blur-xl border-b border-purple-900/40 px-8 py-5 flex items-center justify-between transition-colors">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
        <p className="text-xs text-purple-300/70 font-medium mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        {/* User Profile Avatar with Interactive Dropdown */}
        <div className="relative z-50">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-purple-950/50 border border-transparent hover:border-purple-800/40 transition-all text-left focus:outline-none cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-purple-500/50 flex items-center justify-center bg-purple-950/80 text-purple-200 font-bold shrink-0 shadow-lg shadow-purple-900/30 group-hover:border-purple-400">
              <span className="text-lg">{profile.avatar || '👤'}</span>
            </div>
            <div className="hidden sm:block">
              <span className={`text-sm font-extrabold text-white block ${role === 'TEACHER' ? '' : 'leading-none'}`}>{profile.name}</span>
              {role !== 'TEACHER' && (
                <span className="text-xs text-purple-300/70 font-medium">{profile.className}</span>
              )}
            </div>
            <Icon name="chevron-down" size={16} className="text-purple-400 ml-1 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Interactive Profile & Settings & Theme Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-[#120b20] border-2 border-purple-500/60 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-50 p-5 space-y-4 animate-fadeIn text-white">
              {/* Profile Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-purple-900/60">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-purple-950 border border-purple-400 flex items-center justify-center text-white font-bold shadow-md shadow-purple-900/40">
                    <span className="text-xl">{profile.avatar || '👤'}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold leading-tight text-white">{profile.name}</h4>
                    <span className="text-[11px] text-purple-300 font-medium block truncate max-w-[140px] font-mono">{profile.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    setShowEditModal(true);
                  }}
                  className="px-3 py-1.5 purple-glow-btn text-white rounded-xl text-[11px] font-black shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <span>✏️ Edit</span>
                </button>
              </div>

              {/* Profile Data Details: Name, Class, Age, Email */}
              <div className="space-y-2 text-xs bg-[#180f2b] p-4 rounded-2xl border border-purple-700/50 shadow-md">
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider block mb-1">
                  Profile Details
                </span>
                {role !== 'ADMIN' && (
                  <div className="flex justify-between font-bold">
                    <span className="text-purple-300/80">Name:</span>
                    <span className="text-white font-extrabold">{profile.name}</span>
                  </div>
                )}
                {role !== 'TEACHER' && (
                  <div className="flex justify-between font-bold">
                    <span className="text-purple-300/80">Class / Role:</span>
                    <span className="text-purple-200">{profile.className}</span>
                  </div>
                )}
                {role !== 'ADMIN' && role !== 'DISTRICT' && (
                  <div className="flex justify-between font-bold">
                    <span className="text-purple-300/80">Age:</span>
                    <span className="text-white">{profile.age ? `${profile.age} years` : '-'}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span className="text-purple-300/80">Email:</span>
                  <span className="truncate max-w-[160px] text-purple-300 font-mono">{profile.email}</span>
                </div>
              </div>

              {/* Theme Selector Toggle */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider block">
                  Appearance & Theme
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-3 bg-[#180f2b] rounded-2xl border border-purple-600/60 hover:border-purple-400 transition-all cursor-pointer group shadow-md text-left"
                >
                  <div className="flex items-center gap-2.5 text-xs font-bold text-purple-200">
                    <span className="text-base">{theme === 'dark' ? '🌙' : '☀️'}</span>
                    <span>{theme === 'dark' ? 'Dark Royal Purple' : 'Light Royal Purple'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all ${
                      theme === 'dark' 
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40' 
                        : 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40'
                    }`}>
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                    <span className="text-xs text-purple-400 group-hover:translate-x-0.5 transition-transform">➔</span>
                  </div>
                </button>
              </div>

              {/* Settings Action */}
              <div className="pt-2 border-t border-purple-900/60 flex justify-between items-center text-xs font-bold">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (onOpenProfileTab) onOpenProfileTab();
                  }}
                  className="text-purple-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Icon name="settings" size={16} className="text-purple-400" />
                  <span>Go to Full Profile & Settings</span>
                </button>
              </div>

              <div className="border-t border-purple-900/60 pt-2">
                <button
                  onClick={() => { setShowProfileDropdown(false); logout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-extrabold text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </header>
  );
};

