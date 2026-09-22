import api from '../../services/api';
import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { DonutChart } from '../../components/Charts';
import { Icon } from '../../components/Icons';
import { EditProfileModal } from '../../components/EditProfileModal';
import { useApp } from '../../context/AppContext';

export const SchoolAdminPortal = () => {
  const { userProfile, theme, toggleTheme, logout, activeTab, setActiveTab, showToast } = useApp() || {};
  const [showEditModal, setShowEditModal] = useState(false);
  const [logFilter, setLogFilter] = useState('All');
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [apiUsers, setApiUsers] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [approvalMsg, setApprovalMsg] = useState('');
  const [rejectingUserId, setRejectingUserId] = useState(null);

  const fetchPendingTeachers = async () => {
    try {
      const res = await api.get('/api/admin/teachers/pending');
      setPendingTeachers(res.data);
    } catch (e) {
      console.error("Error fetching pending teachers", e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/teachers/users');
      setApiUsers(res.data);
    } catch (e) {
      console.error("Error fetching users", e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get('/api/admin/teachers/audit-logs');
      setApiLogs(res.data);
    } catch (e) {
      console.error("Error fetching audit logs", e);
    }
  };

  React.useEffect(() => {
    fetchPendingTeachers();
    fetchUsers();
    fetchLogs();
  }, []);

  const handleApproveTeacher = async (userId) => {
    try {
      await api.put(`/api/admin/teachers/${userId}/approve`);
      showToast('Teacher approved successfully!', 'success');
      fetchPendingTeachers();
      fetchUsers();
      fetchLogs();
    } catch (e) {
      showToast("Failed to approve teacher", "error");
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingUserId) return;
    try {
      await api.delete(`/api/admin/teachers/${rejectingUserId}/reject`);
      showToast('Teacher request rejected.', 'success');
      fetchPendingTeachers();
      fetchUsers();
      fetchLogs();
    } catch (e) {
      showToast("Failed to reject teacher", "error");
    } finally {
      setRejectingUserId(null);
    }
  };

  // ── Users Data ───────────────────────────────────────────────────
  const { students: dbStudents = [], teachers: dbTeachers = [], assignments: dbAssignments = [], simulations = [], dashboardMetrics } = useApp() || {};
  const studentCount = dashboardMetrics?.totalStudents ?? (apiUsers.filter(u => u.role === 'STUDENT').length || (dbStudents || []).length);
  const teacherCount = dashboardMetrics?.totalTeachers ?? (apiUsers.filter(u => u.role === 'TEACHER').length || (dbTeachers || []).length);
  const parentCount = dashboardMetrics?.totalParents ?? (apiUsers.filter(u => u.role === 'PARENT').length || 0);
  const total = (studentCount + teacherCount + parentCount) || 1;
  const userStats = [
    { label: 'Students', value: studentCount, percent: Math.round((studentCount/total)*100), color: '#2563EB', icon: '🎓', trend: 'Active' },
    { label: 'Teachers', value: teacherCount, percent: Math.round((teacherCount/total)*100), color: '#10B981', icon: '👩‍🏫', trend: 'Active' },
    { label: 'Parents',  value: parentCount,  percent: Math.round((parentCount/total)*100),  color: '#F59E0B', icon: '👨‍👩‍👧', trend: 'Active' }
  ];

  const recentUsers = apiUsers.map((u, idx) => {
    let designation = 'Profile Linked';
    if (u.role === 'TEACHER') designation = 'Educator';
    else if (u.role === 'ADMIN') designation = 'Administrator';
    else if (u.role === 'STUDENT') {
      const matchStd = dbStudents.find(s => s.email?.toLowerCase() === u.email?.toLowerCase());
      designation = matchStd ? `${matchStd.className || 'Class 6'} - ${matchStd.section || 'A'}` : 'Student Profile';
    }
    return {
      sno: idx + 1,
      name: u.fullName,
      email: u.email,
      role: u.role === 'STUDENT' ? 'Student' : (u.role === 'TEACHER' ? 'Teacher' : (u.role === 'PARENT' ? 'Parent' : 'Admin')),
      class: designation,
      joined: '01 Aug 2026',
      status: u.active ? 'Active' : 'Pending'
    };
  });

  const roleColor = { Student: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300', Teacher: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', Parent: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300', Admin: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' };

  // ── Assignments Data ─────────────────────────────────────────────
  const assignments = dbAssignments.map(a => {
    const sim = simulations.find(s => s.simulationId === a.simulationId || s.id === a.simulationId || s.id === `sim-${a.simulationId}`);
    return {
      id: a.assignmentId,
      title: sim ? sim.title : 'Disaster Preparedness Drill',
      class: a.className || 'General',
      teacher: a.teacherName || 'Educator',
      difficulty: sim ? sim.difficulty : 'Intermediate',
      dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
      assigned: a.assignedCount || 0,
      completed: a.completedCount || 0,
      status: a.status === 'COMPLETED' ? 'Closed' : 'Active'
    };
  });

  // ── System Logs Data ─────────────────────────────────────────────
  const systemLogs = apiLogs.map(log => ({
    id: log.id,
    timestamp: log.timestamp,
    user: log.user,
    role: log.role,
    event: log.event,
    detail: log.detail,
    type: log.type
  }));

  const logTypes = ['All', 'login', 'submission', 'assignment', 'profile', 'admin'];
  const filteredLogs = logFilter === 'All' ? systemLogs : systemLogs.filter(l => l.type === logFilter);

  const logBadge = {
    login:      'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    submission: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    assignment: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    profile:    'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    admin:      'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
  };

  const logIcon = { login: '🔐', submission: '📝', assignment: '📋', profile: '✏️', admin: '🛡️' };

  return (
    <div className="flex bg-[#f6f0ff] dark:bg-[#07040a] h-screen overflow-hidden text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          title={
            activeTab === 'approvals'    ? 'Teacher Registration Approvals' :
            activeTab === 'users'        ? 'User Directory' :
            activeTab === 'assignment'   ? 'Assignments Overview' :
            activeTab === 'system-logs'  ? 'System Audit Logs' :
            activeTab === 'profile'      ? 'Admin Profile' :
            activeTab === 'settings'     ? 'Admin System Settings' :
            `Welcome back, ${'Admin'}!`
          }
          subtitle={
            activeTab === 'approvals'    ? 'Review, accept, or decline pending educator account requests' :
            activeTab === 'users'        ? 'Manage platform accounts — view students, teachers, and parents' :
            activeTab === 'assignment'   ? 'All disaster drill assignments given to students across classes' :
            activeTab === 'system-logs'  ? 'Audit trail of platform events, user logins, and drill submissions' :
            activeTab === 'settings'     ? 'Configure platform settings, audit retention, and display theme' :
            "Here's what's happening on DisasterIQ today."
          }
          onOpenProfileTab={() => setActiveTab('profile')}
        />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">

          {/* ── DASHBOARD ─────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {userStats.map(s => (
                  <div key={s.label} className="purple-glass purple-glass-hover p-5 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-2xl text-purple-300">{s.icon}</div>
                    <div>
                      <span className="text-xs text-purple-300/80 font-bold uppercase tracking-wider block">{s.label}</span>
                      <span className="text-2xl font-black text-white">{s.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4">
                  <h3 className="text-sm font-extrabold text-white">User Distribution</h3>
                  <DonutChart items={userStats.map(s => ({ label: s.label, value: s.value, color: s.color }))} size={170} centerTitle={(studentCount + teacherCount + parentCount).toLocaleString()} centerSubtitle="Total Users" />
                </div>

                <div className="lg:col-span-6 purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-3">
                  <h3 className="text-sm font-extrabold text-white">Recent Activity</h3>
                  <div className="space-y-2">
                    {systemLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-900/20 transition-colors border border-transparent hover:border-purple-500/20">
                        <span className="text-base mt-0.5">{logIcon[log.type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{log.user} — {log.event}</p>
                          <p className="text-[11px] text-purple-300/70 font-medium truncate">{log.detail}</p>
                        </div>
                        <span className="text-[10px] text-purple-400/60 font-medium whitespace-nowrap">
                          {log.timestamp && log.timestamp.includes(' ') ? log.timestamp.split(' ')[1] : (log.timestamp || '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS PAGE ────────────────────────────────────────── */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fadeIn">
              {/* User count cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {userStats.map(s => (
                  <div key={s.label} className="purple-glass purple-glass-hover p-5 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-purple-500/30" style={{ backgroundColor: s.color + '20', color: s.color }}>
                        {s.percent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-white block">{s.value.toLocaleString()}</span>
                      <span className="text-xs font-bold text-purple-300/80 uppercase tracking-wider">{s.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-purple-950/60 rounded-full overflow-hidden border border-purple-900/30">
                      <div className="h-full rounded-full" style={{ width: `${s.percent}%`, backgroundColor: s.color }} />
                    </div>
                    <span className="text-[11px] font-medium text-purple-300/70">{s.trend}</span>
                  </div>
                ))}
              </div>

              {/* Recent Users Table */}
              <div className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Recently Joined Users</h3>
                    <p className="text-xs text-purple-300/70 font-medium">Showing latest users across all roles</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-purple-950/80 text-purple-200 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4 rounded-l-xl">S.No</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Class / Designation</th>
                        <th className="py-3 px-4">Joined On</th>
                        <th className="py-3 px-4 rounded-r-xl text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/30">
                      {recentUsers.map(u => (
                        <tr key={u.sno} className="hover:bg-purple-900/20 transition-colors">
                          <td className="py-3.5 px-4 text-purple-400/70 font-medium">{u.sno}.</td>
                          <td className="py-3.5 px-4 font-extrabold text-white">{u.name}</td>
                          <td className="py-3.5 px-4 text-purple-300/80 font-medium">{u.email}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-purple-950 text-purple-300 border border-purple-500/40">{u.role}</span>
                          </td>
                          <td className="py-3.5 px-4 text-purple-200 font-medium">{u.class}</td>
                          <td className="py-3.5 px-4 text-purple-300/80 font-medium">{u.joined}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                              u.status === 'Active'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                : 'bg-gray-900 text-gray-400 border-gray-700/40'
                            }`}>{u.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ASSIGNMENTS PAGE ──────────────────────────────────── */}
          {activeTab === 'assignment' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="purple-glass p-5 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300 flex items-center justify-center text-xl">📋</div>
                  <div>
                    <span className="text-xs font-bold text-purple-300/80 uppercase tracking-wider block">Total Assignments</span>
                    <span className="text-2xl font-black text-white">{assignments.length}</span>
                  </div>
                </div>
                <div className="purple-glass p-5 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl">✅</div>
                  <div>
                    <span className="text-xs font-bold text-purple-300/80 uppercase tracking-wider block">Active</span>
                    <span className="text-2xl font-black text-white">{assignments.filter(a => a.status === 'Active').length}</span>
                  </div>
                </div>
                <div className="purple-glass p-5 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-400 flex items-center justify-center text-xl">🔒</div>
                  <div>
                    <span className="text-xs font-bold text-purple-300/80 uppercase tracking-wider block">Closed</span>
                    <span className="text-2xl font-black text-white">{assignments.filter(a => a.status === 'Closed').length}</span>
                  </div>
                </div>
              </div>

              {/* Assignments Table */}
              <div className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4">
                <h3 className="text-base font-extrabold text-white">All Assignments Given to Students</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-purple-950/80 text-purple-200 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4 rounded-l-xl">Assignment Title</th>
                        <th className="py-3 px-4">Class</th>
                        <th className="py-3 px-4">Teacher</th>
                        <th className="py-3 px-4">Difficulty</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4 text-center">Assigned</th>
                        <th className="py-3 px-4 text-center">Completed</th>
                        <th className="py-3 px-4 rounded-r-xl text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/30">
                      {assignments.map(a => (
                        <tr key={a.id} className="hover:bg-purple-900/20 transition-colors">
                          <td className="py-4 px-4 font-bold text-white max-w-[200px]">{a.title}</td>
                          <td className="py-4 px-4 font-medium text-purple-300/80 whitespace-nowrap">{a.class}</td>
                          <td className="py-4 px-4 font-medium text-purple-300/80 whitespace-nowrap">{a.teacher}</td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-purple-950 text-purple-300 border border-purple-500/40">{a.difficulty}</span>
                          </td>
                          <td className="py-4 px-4 text-purple-300/80 font-medium whitespace-nowrap">{a.dueDate}</td>
                          <td className="py-4 px-4 text-center font-extrabold text-white">{a.assigned}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`font-extrabold ${a.completed === a.assigned ? 'text-emerald-400' : a.completed > 0 ? 'text-amber-400' : 'text-purple-400/60'}`}>
                              {a.completed}/{a.assigned}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                              a.status === 'Active'   ? 'bg-purple-950 text-purple-300 border-purple-500/40' :
                              a.status === 'Closed'   ? 'bg-gray-900 text-gray-400 border-gray-700/40' :
                              'bg-amber-950 text-amber-300 border-amber-500/40'
                            }`}>{a.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── SYSTEM LOGS PAGE ──────────────────────────────────── */}
          {activeTab === 'system-logs' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Filter tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-purple-300 mr-1">Filter:</span>
                {logTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setLogFilter(type)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold border transition-all capitalize ${
                      logFilter === type
                        ? 'purple-glow-btn text-white border-purple-500'
                        : 'bg-purple-950/40 text-purple-300 border-purple-800/60 hover:border-purple-500'
                    }`}
                  >
                    {type === 'All' ? '🗂 All' :
                     type === 'login' ? '🔐 Login' :
                     type === 'submission' ? '📝 Submissions' :
                     type === 'assignment' ? '📋 Assignments' :
                     type === 'profile' ? '✏️ Profile' : '🛡️ Admin'}
                  </button>
                ))}
              </div>

              {/* Logs Table */}
              <div className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Audit Trail</h3>
                    <p className="text-xs text-purple-300/70 font-medium">{filteredLogs.length} event{filteredLogs.length !== 1 ? 's' : ''} recorded</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-purple-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Live
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-purple-950/80 text-purple-200 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4 rounded-l-xl">Timestamp</th>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Event</th>
                        <th className="py-3 px-4 rounded-r-xl">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/30">
                      {filteredLogs.map(log => (
                        <tr key={log.id} className="hover:bg-purple-900/20 transition-colors">
                          <td className="py-3.5 px-4 text-purple-300/80 font-mono font-medium whitespace-nowrap">{log.timestamp}</td>
                          <td className="py-3.5 px-4 font-extrabold text-white whitespace-nowrap">{log.user}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-purple-950 text-purple-300 border border-purple-500/40">{log.role}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-purple-900/60 text-purple-200 border border-purple-500/30">
                              {logIcon[log.type]} {log.event}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-purple-200 font-medium max-w-xs">{log.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredLogs.length === 0 && (
                    <div className="py-12 text-center text-xs text-purple-400/60 font-medium">No logs found for this filter.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ADMIN PROFILE ─────────────────────────────────────── */}
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
                  <button onClick={() => setShowEditModal(true)} className="purple-glow-btn px-4 py-1.5 text-white rounded-xl text-xs font-extrabold">
                    ✏️ Edit Profile
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>
                    Sign Out
                  </button>
                  <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-purple-950 text-purple-300 border border-purple-500/40">Platform Admin</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[['Full Name', userProfile.name], ['Role', userProfile.className], ['Email Address', userProfile.email]].map(([label, val]) => (
                  <div key={label} className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-1">
                    <span className="text-xs font-bold text-purple-400 uppercase">{label}</span>
                    <span className="text-base font-extrabold text-white block">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ADMIN SETTINGS ────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="purple-glass p-8 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-6 animate-fadeIn">
              <h2 className="text-lg font-extrabold text-white pb-3 border-b border-purple-900/40">Admin Platform Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-white block">Appearance Theme</span>
                      <span className="text-xs text-purple-300/80">Current: Black & Royal Purple 🌙</span>
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
                      <span className="text-xs text-purple-300/80">Update name, designation, email</span>
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


          {/* TEACHER APPROVALS TAB */}
          {activeTab === 'approvals' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-purple-900/40">
                <div>
                  <h2 className="text-lg font-extrabold text-white">Pending Teacher Registration Requests</h2>
                  <p className="text-xs text-purple-300/70">Approve or decline new educator account requests</p>
                </div>
                <button onClick={fetchPendingTeachers} className="purple-glow-btn px-3.5 py-1.5 text-white text-xs font-bold rounded-xl">
                  🔄 Refresh
                </button>
              </div>

              {approvalMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl">
                  {approvalMsg}
                </div>
              )}

              <div className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-purple-950/80 text-purple-200 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 rounded-l-xl">Teacher Name</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">School</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/30">
                    {pendingTeachers.map(t => (
                      <tr key={t.userId} className="hover:bg-purple-900/20 transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{t.fullName}</td>
                        <td className="py-4 px-4 font-mono text-purple-300/80">{t.email}</td>
                        <td className="py-4 px-4 font-medium text-purple-300/80">{t.phone || 'N/A'}</td>
                        <td className="py-4 px-4 font-medium text-white">{t.schoolName}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                            PENDING APPROVAL
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleApproveTeacher(t.userId)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={() => setRejectingUserId(t.userId)}
                            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                          >
                            ✕ Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingTeachers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-xs text-purple-300/60 font-bold">
                          No pending teacher registration requests at this time. All accounts are approved!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}

      {rejectingUserId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#120b20] border border-purple-500/40 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-6 animate-scaleIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center text-xl shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">Confirm Rejection</h3>
                <p className="text-[10px] text-purple-300/70 font-black uppercase tracking-wider">Action cannot be undone</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-bold text-purple-200 leading-relaxed">
              Are you sure you want to reject this teacher registration request?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingUserId(null)}
                className="px-5 py-2.5 bg-purple-900/50 hover:bg-purple-800/80 text-purple-200 border border-purple-500/30 font-extrabold rounded-full text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-full text-xs shadow-sm transition-colors cursor-pointer"
              >
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
