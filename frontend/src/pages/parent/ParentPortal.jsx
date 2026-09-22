import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { LineChart, DonutChart } from '../../components/Charts';
import { Icon } from '../../components/Icons';
import { EditProfileModal } from '../../components/EditProfileModal';
import { useApp } from '../../context/AppContext';

export const ParentPortal = () => {
  const { userProfile, theme, toggleTheme, logout, assignments: dbAssignments = [], dashboardMetrics, activeTab, setActiveTab, notifications = [], markNotificationsRead } = useApp() || {};
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState('All');

  const dynamicScores = dashboardMetrics?.assessmentScores || [];
  const lineChartData = dynamicScores.length > 0
    ? dynamicScores.map((score, idx) => ({ label: `Drill ${idx + 1}`, value: Math.round(score) }))
    : [
        { label: 'Drill 1', value: 0 }
      ];

  // Resolve dynamic children data from dashboardMetrics
  const children = dashboardMetrics ? [
    {
      id: 1,
      name: dashboardMetrics.studentName || 'Student Child',
      class: dashboardMetrics.className || 'Grade 6-A',
      school: dashboardMetrics.schoolName || 'Green Valley High School',
      score: Math.round(dashboardMetrics.averageScore) || 0,
      completed: dashboardMetrics.completedAssignments || 0,
      total: dashboardMetrics.totalAssignments || 0,
      pending: dashboardMetrics.pendingAssignments || 0,
      avatar: '🧑‍🎓',
      status: (dashboardMetrics.averageScore >= 75) ? 'Good' : 'Needs Attention'
    }
  ] : [];

  // Resolve children assignments data
  const childrenAssignments = (dbAssignments && dbAssignments.length > 0) ? dbAssignments.map((a, idx) => ({
    id: idx + 1,
    childName: dashboardMetrics?.studentName || 'Student Child',
    title: a.title || 'Disaster Safety Drill',
    subject: 'Emergency Drill',
    assignedOn: a.assignedDate ? new Date(a.assignedDate).toLocaleDateString() : '01 Aug 2026',
    dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '30 Aug 2026',
    status: a.studentStatus === 'COMPLETED' ? 'Completed' : (a.studentStatus === 'IN_PROGRESS' ? 'In Progress' : 'Pending'),
    score: a.score !== null && a.score !== undefined ? `${Math.round(a.score)}%` : '-'
  })) : [];

  const filteredAssignments = selectedChild === 'All'
    ? childrenAssignments
    : childrenAssignments.filter(a => a.childName === selectedChild);

  const totalAssignments = dashboardMetrics
    ? (dashboardMetrics.totalAssignments || 0)
    : 0;

  const completedCount = dashboardMetrics
    ? (dashboardMetrics.completedAssignments || 0)
    : 0;

  const pendingCount = dashboardMetrics
    ? (dashboardMetrics.pendingAssignments || 0)
    : 0;

  const avgScoreStr = dashboardMetrics
    ? `${Math.round(dashboardMetrics.averageScore) || 0}%`
    : "0%";

  return (
    <div className="flex bg-[#f6f0ff] dark:bg-[#07040a] h-screen overflow-hidden text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          title={
            activeTab === 'my-children' ? 'My Children' :
            activeTab === 'assignment' ? "Children's Assignments" :
            activeTab === 'profile' ? 'Parent Profile' :
            activeTab === 'settings' ? 'Parent Preferences & Settings' :
            `Welcome back, ${userProfile.name}!`
          }
          subtitle={
            activeTab === 'my-children' ? 'Monitor performance and preparedness of your registered children' :
            activeTab === 'assignment' ? "Track your children's disaster drill assignments and scores" :
            activeTab === 'profile' ? 'View and manage your parent account profile' :
            activeTab === 'settings' ? 'Configure weekly email reports, SMS alerts, and theme preferences' :
            "Here's how your children are learning and progressing."
          }
          onOpenProfileTab={() => setActiveTab('profile')}
        />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">

          {/* 1. PARENT DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-purple-300/80 font-bold uppercase tracking-wider block">Total Assignments</span>
                    <span className="text-3xl font-black text-white block">{totalAssignments}</span>
                    <span className="text-xs text-purple-300 font-bold block">Live DB Metric</span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-900/40 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                    <Icon name="clipboard" size={28} />
                  </div>
                </div>

                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-purple-300/80 font-bold uppercase tracking-wider block">Completed</span>
                    <span className="text-3xl font-black text-white block">{completedCount}</span>
                    <span className="text-xs text-emerald-400 font-medium block">Based on DB</span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Icon name="check" size={28} />
                  </div>
                </div>

                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-purple-300/80 font-bold uppercase tracking-wider block">Pending</span>
                    <span className="text-3xl font-black text-white block">{pendingCount}</span>
                    <span className="text-xs text-amber-400 font-bold block">Needs attention</span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-950/50 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Icon name="clock" size={28} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white">Preparedness Overview</h3>
                    <select className="bg-[#120b20] border border-purple-500/30 text-xs font-bold px-3 py-1 rounded-lg text-purple-200 outline-none">
                      <option>This Month </option>
                    </select>
                  </div>
                  <LineChart data={lineChartData} height={210} color="#8b5cf6" />
                </div>

                <div className="lg:col-span-4 purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 flex flex-col justify-between space-y-4">
                  <h3 className="text-sm font-extrabold text-white">Overall Progress</h3>
                  <DonutChart
                    items={[
                      { label: 'Completed', value: completedCount, color: '#10B981' },
                      { label: 'In Progress', value: pendingCount, color: '#8B5CF6' },
                      { label: 'Not Started', value: 0, color: '#4C1D95' }
                    ]}
                    size={160}
                    centerTitle={avgScoreStr}
                    centerSubtitle="Overall"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. MY CHILDREN PAGE */}
          {activeTab === 'my-children' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children.map(child => (
                  <div key={child.id} className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-5">
                    {/* Child Header */}
                    <div className="flex items-center gap-4 pb-4 border-b border-purple-900/40">
                      <div className="w-14 h-14 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-3xl">
                        {child.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-extrabold text-white">{child.name}</h3>
                        <p className="text-xs text-purple-300/70 font-medium">{child.class} · {child.school}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                        child.status === 'Good'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-950 text-amber-300 border-amber-500/40'
                      }`}>
                        {child.status}
                      </span>
                    </div>

                    {/* Progress Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>Preparedness Score</span>
                        <span>{child.score}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-purple-950/60 rounded-full overflow-hidden border border-purple-900/30">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            child.score >= 75 ? 'bg-emerald-500' :
                            child.score >= 50 ? 'bg-purple-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${child.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center">
                        <span className="text-lg font-black text-emerald-400 block">{child.completed}</span>
                        <span className="text-[10px] font-bold text-emerald-300 uppercase">Done</span>
                      </div>
                      <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-center">
                        <span className="text-lg font-black text-amber-400 block">{child.pending}</span>
                        <span className="text-[10px] font-bold text-amber-300 uppercase">Pending</span>
                      </div>
                      <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-center">
                        <span className="text-lg font-black text-white block">{child.total}</span>
                        <span className="text-[10px] font-bold text-purple-300 uppercase">Total</span>
                      </div>
                    </div>

                    {/* View Assignments Link */}
                    <button
                      onClick={() => {
                        setSelectedChild(child.name);
                        setActiveTab('assignment');
                      }}
                      className="purple-glow-btn w-full py-2.5 text-white text-xs font-extrabold rounded-xl"
                    >
                      View Assignments →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ASSIGNMENTS PAGE */}
          {activeTab === 'assignment' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Filter by child */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-purple-300">Filter by child:</span>
                <button
                  onClick={() => setSelectedChild('All')}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
                    selectedChild === 'All'
                      ? 'purple-glow-btn text-white border-purple-500'
                      : 'bg-purple-950/40 text-purple-300 border-purple-800/60 hover:border-purple-500'
                  }`}
                >
                  All Children
                </button>
                {children.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChild(c.name)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
                      selectedChild === c.name
                        ? 'purple-glow-btn text-white border-purple-500'
                        : 'bg-purple-950/40 text-purple-300 border-purple-800/60 hover:border-purple-500'
                    }`}
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Assignments Table */}
              <div className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Assignment List</h3>
                    <p className="text-xs text-purple-300/70 font-medium mt-0.5">
                      {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-purple-950/80 text-purple-200 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4 rounded-l-xl">Child</th>
                        <th className="py-3 px-4">Assignment</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Assigned On</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 rounded-r-xl text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/30">
                      {filteredAssignments.map(a => (
                        <tr key={a.id} className="hover:bg-purple-900/20 transition-colors">
                          <td className="py-4 px-4 font-extrabold text-white whitespace-nowrap">
                            {a.childName.split(' ')[0]}
                          </td>
                          <td className="py-4 px-4 font-bold text-white max-w-[200px]">{a.title}</td>
                          <td className="py-4 px-4 text-purple-300/80 font-medium">{a.subject}</td>
                          <td className="py-4 px-4 text-purple-300/80 font-medium whitespace-nowrap">{a.assignedOn}</td>
                          <td className="py-4 px-4 text-purple-300/80 font-medium whitespace-nowrap">{a.dueDate}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                              a.status === 'Completed'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                : 'bg-amber-950 text-amber-300 border-amber-500/40'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-extrabold text-white">
                            {a.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredAssignments.length === 0 && (
                    <div className="py-12 text-center text-xs text-purple-400/60 font-medium">
                      No assignments found for the selected child.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. PARENT PROFILE */}
          {activeTab === 'profile' && (
            <div className="purple-glass p-8 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b pb-4 border-purple-900/40">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-purple-900/50 border-2 border-purple-500/40 flex items-center justify-center text-white font-bold shadow-md">
                    <span className="text-3xl">{userProfile.avatar || '👤'}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{userProfile.name}</h2>
                    <span className="text-xs text-purple-300/80 font-medium block mt-0.5">{userProfile.className}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="purple-glow-btn px-4 py-1.5 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5"
                  >
                    <span>✏️ Edit Profile</span>
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-1">
                  <span className="text-xs font-bold text-purple-400 uppercase">Full Name</span>
                  <span className="text-base font-extrabold text-white block">{userProfile.name}</span>
                </div>
                <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-1">
                  <span className="text-xs font-bold text-purple-400 uppercase">Class / Role</span>
                  <span className="text-base font-extrabold text-white block">{userProfile.className}</span>
                </div>
                <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-1">
                  <span className="text-xs font-bold text-purple-400 uppercase">Age</span>
                  <span className="text-base font-extrabold text-white block">{userProfile.age} years</span>
                </div>
                <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-1">
                  <span className="text-xs font-bold text-purple-400 uppercase">Email Address</span>
                  <span className="text-base font-extrabold text-white block">{userProfile.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. PARENT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="purple-glass p-8 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-6 animate-fadeIn">
              <h2 className="text-lg font-extrabold text-white pb-3 border-b border-purple-900/40">
                Parent Notification & Display Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-3">
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
                <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-white block">Edit Profile Info</span>
                      <span className="text-xs text-purple-300/80">Update name, email, phone</span>
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

      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};
