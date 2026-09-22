import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icons';
import { BarChart } from '../../components/Charts';
import { EditProfileModal } from '../../components/EditProfileModal';
import { useApp } from '../../context/AppContext';

export const DistrictCollectorPortal = () => {
  const { userProfile, theme, toggleTheme, logout, schools = [], activeTab, setActiveTab } = useApp() || {};
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const districtSchools = schools.map((sch, idx) => {
    const score = sch.averageScore || 0;
    const risk = score >= 75 ? 'Low Risk' : (score >= 50 ? 'Medium Risk' : 'High Risk');
    return {
      sno: idx + 1,
      name: sch.schoolName,
      block: sch.address || sch.district || 'District block',
      students: sch.studentsCount || 0,
      teachers: sch.teachersCount || 0,
      score: score,
      risk: risk
    };
  });

  // Live filtered list
  const filteredSchools = districtSchools.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.risk.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Bar chart data — school name (short) vs preparedness score
  const barChartData = districtSchools.map(s => ({
    label: s.name.split(' ')[0],   // first word as short label
    value: s.score,
    color: s.score >= 75 ? '#10B981' : s.score >= 50 ? '#F59E0B' : '#EF4444'
  }));

  const riskBadge = {
    'Low Risk':    'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40',
    'Medium Risk': 'bg-amber-950/80 text-amber-300 border border-amber-500/40',
    'High Risk':   'bg-rose-950/80 text-rose-300 border border-rose-500/40'
  };

  return (
    <div className="flex bg-[#f6f0ff] dark:bg-[#07040a] h-screen overflow-hidden text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          title={
            activeTab === 'profile'  ? 'District Collector Profile' :
            activeTab === 'settings' ? 'District Administration Settings' :
            `Welcome back, ${userProfile.name || 'Collector'}!`
          }
          subtitle={
            activeTab === 'profile'  ? 'Jurisdiction and magistrate profile credentials' :
            activeTab === 'settings' ? 'Configure district risk thresholds, emergency broadcast channels, and theme' :
            "Here's the district disaster preparedness overview."
          }
          onOpenProfileTab={() => setActiveTab('profile')}
        />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">

          {/* ── DASHBOARD ─────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300 flex items-center justify-center text-xl">🏫</div>
                  <div>
                    <span className="text-xs text-purple-300/80 font-bold uppercase tracking-wider block">Total Schools</span>
                    <span className="text-3xl font-black text-white">{districtSchools.length}</span>
                  </div>
                </div>

                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl">📊</div>
                  <div>
                    <span className="text-xs text-purple-300/80 font-bold uppercase tracking-wider block">Avg. Score</span>
                    <span className="text-3xl font-black text-white">
                      {districtSchools.length > 0 ? Math.round(districtSchools.reduce((a, s) => a + s.score, 0) / districtSchools.length) : 0}%
                    </span>
                  </div>
                </div>

                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-4 col-span-1 sm:col-span-1 lg:col-span-1">
                  <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-400 flex items-center justify-center text-xl">⚠️</div>
                  <div className="flex-1">
                    <span className="text-xs text-purple-300/80 font-bold uppercase tracking-wider block">School Risk Levels</span>
                    <div className="flex items-center gap-3 mt-1.5 text-xs font-black">
                      <span className="text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full">{districtSchools.filter(s => s.risk === 'High Risk').length} High</span>
                      <span className="text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">{districtSchools.filter(s => s.risk === 'Medium Risk').length} Mid</span>
                      <span className="text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">{districtSchools.filter(s => s.risk === 'Low Risk').length} Low</span>
                    </div>
                  </div>
                </div>

                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300 flex items-center justify-center text-xl">🎓</div>
                  <div>
                    <span className="text-xs text-purple-300/80 font-bold uppercase tracking-wider block">Total Students</span>
                    <span className="text-3xl font-black text-white">
                      {districtSchools.reduce((a, s) => a + s.students, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bar chart + schools table side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Bar Chart */}
                <div className="lg:col-span-5 purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">School Preparedness Scores</h3>
                    <p className="text-xs text-purple-300/70 font-medium mt-0.5">Preparedness % by school</p>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-[11px] font-bold">
                    <span className="flex items-center gap-1.5 text-purple-200"><span className="w-3 h-3 rounded bg-emerald-500 inline-block shadow-sm" /> ≥75% Good</span>
                    <span className="flex items-center gap-1.5 text-purple-200"><span className="w-3 h-3 rounded bg-amber-500 inline-block shadow-sm" /> 50–74% Medium</span>
                    <span className="flex items-center gap-1.5 text-purple-200"><span className="w-3 h-3 rounded bg-rose-500 inline-block shadow-sm" /> &lt;50% Risk</span>
                  </div>

                  {/* Custom styled progress bars */}
                  <div className="w-full space-y-3 pt-2">
                    {districtSchools.map((school) => (
                      <div key={school.sno} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-white">
                          <span className="truncate max-w-[60%]">{school.name.split(' ').slice(0, 2).join(' ')}</span>
                          <span className="text-purple-300">{school.score}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-purple-950/60 rounded-full overflow-hidden border border-purple-900/30">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${school.score}%`,
                              backgroundColor: school.score >= 75 ? '#10B981' : school.score >= 50 ? '#F59E0B' : '#EF4444'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schools table */}
                <div className="lg:col-span-7 purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-white">Schools List</h3>
                      <p className="text-xs text-purple-300/70 font-medium">
                        {filteredSchools.length} of {districtSchools.length} schools
                      </p>
                    </div>

                    {/* Search box */}
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Search by school, block, risk..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-[#120b20] border border-purple-500/30 text-xs font-medium text-white px-8 py-2 rounded-full shadow-inner focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-purple-400/50"
                      />
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400">
                        <Icon name="search" size={16} />
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-purple-950/80 text-purple-200 font-bold uppercase tracking-wider">
                          <th className="py-3 px-3 rounded-l-xl">No.</th>
                          <th className="py-3 px-3">School Name</th>
                          <th className="py-3 px-3">Block</th>
                          <th className="py-3 px-3 text-center">Students</th>
                          <th className="py-3 px-3 text-center">Score</th>
                          <th className="py-3 px-3 rounded-r-xl">Risk Level</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-900/30">
                        {filteredSchools.map(sch => (
                          <tr key={sch.sno} className="hover:bg-purple-900/20 transition-colors">
                            <td className="py-3.5 px-3 text-purple-400/70 font-medium">{sch.sno}.</td>
                            <td className="py-3.5 px-3 font-bold text-white max-w-[140px] truncate">{sch.name}</td>
                            <td className="py-3.5 px-3 text-purple-300/80 font-medium whitespace-nowrap">{sch.block}</td>
                            <td className="py-3.5 px-3 font-bold text-white text-center">{sch.students}</td>
                            <td className="py-3.5 px-3 text-center">
                              <span className={`font-extrabold ${
                                sch.score >= 75 ? 'text-emerald-400' :
                                sch.score >= 50 ? 'text-amber-400' : 'text-rose-400'
                              }`}>
                                {sch.score}%
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${riskBadge[sch.risk]}`}>
                                {sch.risk}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {filteredSchools.length === 0 && (
                          <tr>
                            <td colSpan="6" className="py-10 text-center text-xs text-purple-400/60 font-medium">
                              No schools found matching "<strong>{searchQuery}</strong>"
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE ───────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="purple-glass p-8 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b pb-4 border-purple-900/40">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-purple-900/50 border-2 border-purple-500/40 flex items-center justify-center text-white font-bold shadow-md">
                    <span className="text-3xl">{userProfile.avatar || '👤'}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{userProfile.name}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="purple-glow-btn px-4 py-1.5 text-white rounded-xl text-xs font-extrabold"
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>
                    Sign Out
                  </button>
                  <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-purple-950 text-purple-300 border border-purple-500/40">
                    Magistrate & Collector
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ['Full Name', userProfile.name],
                  ['Age', `${userProfile.age} years`],
                  ['Official Email', userProfile.email]
                ].map(([label, val]) => (
                  <div key={label} className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-1">
                    <span className="text-xs font-bold text-purple-400 uppercase">{label}</span>
                    <span className="text-base font-extrabold text-white block">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ──────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="purple-glass p-8 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-6 animate-fadeIn">
              <h2 className="text-lg font-extrabold text-white pb-3 border-b border-purple-900/40">
                District Administration Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-white block">Appearance Theme</span>
                      <span className="text-xs text-purple-300/80">Current Theme: Black & Royal Purple 🌙</span>
                    </div>
                    <button onClick={toggleTheme} className="purple-glow-btn px-4 py-2 text-white text-xs font-bold rounded-xl">
                      Toggle Mode
                    </button>
                  </div>
                </div>
                <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-white block">Edit Profile Info</span>
                      <span className="text-xs text-purple-300/80">Update name, jurisdiction, email</span>
                    </div>
                    <button onClick={() => setShowEditModal(true)} className="purple-glow-btn px-4 py-2 text-white text-xs font-bold rounded-xl">
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-rose-950/30 rounded-xl border border-rose-900/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-rose-400 block">Sign Out</span>
                      <span className="text-xs text-rose-400/70">Log out from your DisasterIQ account</span>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
};
