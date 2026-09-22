import api from '../../services/api';
import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icons';
import { EditProfileModal } from '../../components/EditProfileModal';
import { useApp } from '../../context/AppContext';

export const TeacherPortal = () => {
  const { 
    userProfile, 
    theme, 
    toggleTheme, 
    logout,
    students: dbStudents = [], 
    assignments: dbAssignments = [], 
    classes: dbClasses = [], 
    simulations: dbSimulations = [], 
    dashboardMetrics, 
    loadData,
    activeTab,
    setActiveTab,
    showToast
  } = useApp() || {};
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Student Onboarding States
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStdName, setNewStdName] = useState('');
  const [newStdEmail, setNewStdEmail] = useState('');
  const [newStdPhone, setNewStdPhone] = useState('');
  const [newStdRollNo, setNewStdRollNo] = useState('');
  const [newStdClass, setNewStdClass] = useState('Class 6');
  const [newStdSection, setNewStdSection] = useState('A');
  const [newStdAge, setNewStdAge] = useState('');
  const [generatedCreds, setGeneratedCreds] = useState(null);
  const [onboardError, setOnboardError] = useState('');

  const [selectedClass, setSelectedClass] = useState('Class 6A');
  const [selectedSim, setSelectedSim] = useState('Earthquake Safety Drill');
  const [difficulty, setDifficulty] = useState('Easy');
  const [dueDate, setDueDate] = useState('2026-08-30');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSimId, setSelectedSimId] = useState('');
  const [filterRosterClassId, setFilterRosterClassId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [pendingParents, setPendingParents] = useState([]);
  const [deletingAsgId, setDeletingAsgId] = useState(null);

  const fetchPendingParents = async () => {
    try {
      const res = await api.get('/api/teacher/parents/pending');
      setPendingParents(res.data);
    } catch (e) {
      console.error("Error fetching pending parents", e);
    }
  };

  const handleApproveParent = async (userId) => {
    try {
      await api.put(`/api/teacher/parents/${userId}/approve`);
      showToast('Parent approved successfully!', 'success');
      fetchPendingParents();
    } catch (e) {
      showToast("Failed to approve parent", "error");
    }
  };

  const handleRejectParent = async (userId) => {
    try {
      await api.delete(`/api/teacher/parents/${userId}/reject`);
      showToast('Parent request rejected.', 'success');
      fetchPendingParents();
    } catch (e) {
      showToast("Failed to reject parent", "error");
    }
  };

  // Remove duplicates in simulations list
  const uniqueSimulations = [];
  const seenTitles = new Set();
  (dbSimulations || []).forEach(s => {
    if (s && s.title && !seenTitles.has(s.title)) {
      seenTitles.add(s.title);
      uniqueSimulations.push(s);
    }
  });

  React.useEffect(() => {
    fetchPendingParents();
    if (dbClasses && dbClasses.length > 0) {
      const firstClass = dbClasses[0];
      const classIdVal = (firstClass.classId || firstClass.id || '').toString();
      setSelectedClassId(classIdVal);
      setSelectedClass((firstClass.className || '') + " " + (firstClass.section || ''));
      if (firstClass.className) setNewStdClass(firstClass.className);
      if (firstClass.section) setNewStdSection(firstClass.section);
    }
    if (uniqueSimulations && uniqueSimulations.length > 0) {
      const firstSim = uniqueSimulations[0];
      const simIdVal = firstSim.simulationId || firstSim.id || '';
      setSelectedSimId(simIdVal);
      setSelectedSim(firstSim.title || '');
    }
  }, [dbClasses, dbSimulations]);

  const [passThreshold, setPassThreshold] = useState('80%');
  const [autoReminder, setAutoReminder] = useState(true);
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(true);

  const handleOnboardStudent = async (e) => {
    e.preventDefault();
    setOnboardError('');
    const genPassword = 'std' + Math.floor(1000 + Math.random() * 9000);
    try {
      await api.post('/api/auth/register', {
        fullName: newStdName,
        email: newStdEmail,
        password: genPassword,
        phone: newStdPhone,
        role: 'STUDENT',
        schoolName: userProfile?.school,
        studentRoll: newStdRollNo,
        className: newStdClass,
        section: newStdSection,
        age: newStdAge ? parseInt(newStdAge) : 15,
        teacherId: userProfile?.teacherId || localStorage.getItem('teacherId') ? parseInt(userProfile?.teacherId || localStorage.getItem('teacherId')) : null,
        teacherEmail: userProfile?.email || localStorage.getItem('email') || ''
      });
      setGeneratedCreds({
        name: newStdName,
        email: newStdEmail,
        phone: newStdPhone || '9876543210',
        password: genPassword,
        rollNo: newStdRollNo || ('ROLL-' + Math.floor(100 + Math.random() * 900)),
        className: newStdClass + " " + newStdSection,
        age: newStdAge || '15'
      });
      setNewStdPhone('');
      setNewStdClass('Class 6');
      setNewStdSection('A');

      // Save generated credential & age to local store for persistent profile lookup
      try {
        const stored = JSON.parse(localStorage.getItem('onboardedStudentCreds') || '[]');
        stored.push({
          email: newStdEmail.toLowerCase(),
          password: genPassword,
          name: newStdName,
          rollNo: newStdRollNo,
          phone: newStdPhone,
          age: newStdAge || '15',
          className: newStdClass + " " + newStdSection,
          rawClassName: newStdClass,
          rawSection: newStdSection,
          teacherEmail: (userProfile?.email || localStorage.getItem('email') || '').toLowerCase()
        });
        localStorage.setItem('onboardedStudentCreds', JSON.stringify(stored));

        const userAgeStore = JSON.parse(localStorage.getItem('userAgeStore') || '{}');
        userAgeStore[newStdEmail.toLowerCase()] = newStdAge || '15';
        localStorage.setItem('userAgeStore', JSON.stringify(userAgeStore));
      } catch (e) {}
      await loadData();
      setNewStdRollNo('');
      setNewStdName('');
      setNewStdEmail('');
      setNewStdAge('');
    } catch (err) {
      setOnboardError(err.response?.data?.message || 'Failed to create student account.');
    }
  };

  let onboardedCreds = [];
  try {
    const rawCreds = localStorage.getItem('onboardedStudentCreds');
    const parsed = JSON.parse(rawCreds || '[]');
    if (Array.isArray(parsed)) onboardedCreds = parsed;
  } catch (e) {}

  const currentTeacherEmail = (userProfile?.email || localStorage.getItem('email') || '').toLowerCase();
  const mergedStudentSource = [...(dbStudents || [])];
  onboardedCreds.forEach(cread => {
    if (!cread || !cread.email) return;
    const creadEmail = (cread.email || '').toLowerCase();
    const isTeacherMatch = cread.teacherEmail ? (cread.teacherEmail || '').toLowerCase() === currentTeacherEmail : false;
    if (isTeacherMatch && !mergedStudentSource.some(s => (s.email || s.user?.email || '').toLowerCase() === creadEmail)) {
      let stdCls = 'Class 6';
      let stdSec = 'A';
      if (cread.rawClassName) {
        stdCls = cread.rawClassName;
        stdSec = cread.rawSection || 'A';
      } else if (cread.className) {
        const parts = cread.className.trim().split(/\s+/);
        if (parts.length > 1) {
          stdSec = parts.pop();
          stdCls = parts.join(' ');
        } else {
          stdCls = cread.className;
        }
      }
      mergedStudentSource.push({
        studentId: Date.now() + Math.floor(Math.random() * 1000),
        studentName: cread.name,
        fullName: cread.name,
        email: cread.email,
        phone: cread.phone,
        rollNumber: cread.rollNo,
        className: stdCls,
        section: stdSec,
        password: cread.password
      });
    }
  });

  const sampleStudents = (mergedStudentSource || []).map((std, idx) => {
    if (!std) return null;
    const stdEmail = (std.email || std.user?.email || '').toLowerCase();
    const stdName = std.studentName || std.fullName || std.user?.fullName || 'Student';
    const matched = onboardedCreds.find(c => c && c.email && (c.email || '').toLowerCase() === stdEmail);
    let pwd = std.password || (matched ? matched.password : null);
    if (!pwd) {
      if (stdEmail === 'saisaran158@gmail.com') pwd = 'password123';
      else if (stdEmail === 'test_1062@gmail.com') pwd = 'password123';
      else if (stdEmail === 'sai@disasteriq.com') pwd = 'student123';
      else pwd = 'std' + (std.studentId ? (1000 + std.studentId) : (100 + idx));
    }

    return {
      sno: idx + 1,
      studentId: std.studentId,
      classId: std.classId ? std.classId.toString() : (std.schoolClass?.classId ? std.schoolClass.classId.toString() : ''),
      className: std.className || std.schoolClass?.className || '',
      section: std.section || std.schoolClass?.section || '',
      name: stdName,
      email: std.email || std.user?.email || '',
      phone: std.phone || std.user?.phone || '',
      rollNo: std.rollNumber || std.rollNo || std.user?.rollNumber || `0${idx+1}`,
      password: pwd,
      completion: std.completionRate || '0/0',
      score: std.averageScore > 0 ? `${Math.round(std.averageScore)}%` : '0%',
      avgScore: std.averageScore
    };
  }).filter(Boolean);

  // Group all classes dynamically from dbClasses AND sampleStudents (Class-wise & Section-wise)
  const classMap = new Map();

  // 1. First add classes from dbClasses
  (dbClasses || []).forEach(c => {
    if (!c) return;
    const clsName = (c.className || 'Class 6').trim();
    const secName = (c.section || 'A').trim();
    const key = `${clsName.toLowerCase()}___${secName.toLowerCase()}`;
    const cIdStr = (c.classId || c.id || '').toString();

    if (!classMap.has(key)) {
      classMap.set(key, {
        classId: cIdStr,
        cls: clsName,
        sec: secName,
        avgScoreSum: 0,
        avgScoreCount: 0,
        dbAvg: c.averageScore > 0 ? c.averageScore : 0,
        studentCount: 0
      });
    }
  });

  // 2. Aggregate students from sampleStudents into matching class/section rows, and update class average scores dynamically
  (sampleStudents || []).forEach(s => {
    if (!s) return;
    const clsName = (s.className || 'Class 6').trim();
    const secName = (s.section || 'A').trim();
    const key = `${clsName.toLowerCase()}___${secName.toLowerCase()}`;

    let numScore = 0;
    if (typeof s.avgScore === 'number' && s.avgScore > 0) {
      numScore = s.avgScore;
    } else if (typeof s.score === 'string' && s.score.includes('%')) {
      numScore = parseFloat(s.score.replace('%', '')) || 0;
    }

    if (!classMap.has(key)) {
      classMap.set(key, {
        classId: (s.classId || ('cls_' + key)).toString(),
        cls: clsName,
        sec: secName,
        avgScoreSum: numScore,
        avgScoreCount: numScore > 0 ? 1 : 0,
        dbAvg: 0,
        studentCount: 1
      });
    } else {
      const entry = classMap.get(key);
      entry.studentCount += 1;
      if (numScore > 0) {
        entry.avgScoreSum += numScore;
        entry.avgScoreCount += 1;
      }
      if (!entry.classId && s.classId) entry.classId = s.classId.toString();
    }
  });

  // Convert map to displayClasses array with dynamically calculated average score
  const displayClasses = Array.from(classMap.values()).map(item => {
    let finalAvgStr = '0%';
    if (item.avgScoreCount > 0) {
      finalAvgStr = `${Math.round(item.avgScoreSum / item.avgScoreCount)}%`;
    } else if (item.dbAvg > 0) {
      finalAvgStr = `${Math.round(item.dbAvg)}%`;
    }

    return {
      classId: item.classId || `cls_${item.cls}_${item.sec}`,
      cls: item.cls,
      sec: item.sec,
      st: item.studentCount,
      avg: finalAvgStr
    };
  });

  // Fallback if no classes exist
  if (displayClasses.length === 0) {
    displayClasses.push({
      classId: '21',
      cls: 'Class 6',
      sec: 'A',
      st: 0,
      avg: '0%'
    });
  }

  // Resolve upcoming due dates
  const upcomingDueDates = (dbAssignments || [])
    .filter(asg => asg && asg.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0))
    .slice(0, 3);

  const handleExportCSV = (list) => {
    if (!list || list.length === 0) {
      showToast('No students to export!', 'error');
      return;
    }
    const activeClassObj = displayClasses.find(c => (c.classId || '').toString() === filterRosterClassId?.toString());
    const classNameStr = activeClassObj ? `${activeClassObj.cls || 'Class'}_${activeClassObj.sec || ''}`.trim().replace(/\s+/g, '_') : 'All_Classes';
    
    const headers = ['S.No', 'Student Name', 'Email', 'Roll No', 'Class Name', 'Password', 'Completion', 'Average Score'];
    const rows = list.map((s, idx) => [
      idx + 1,
      s.name || '-',
      s.email || '-',
      s.rollNo || '-',
      `${s.className || ''} ${s.section || ''}`.trim() || '-',
      s.password || '-',
      s.completion || '0/0',
      s.score || '0%'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_Safety_Report_${classNameStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Report downloaded successfully!', 'success');
  };

  return (
    <div className="flex bg-[#F4F5F7] dark:bg-gray-950 h-screen overflow-hidden text-gray-900 dark:text-gray-100 font-sans transition-colors">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          title={
            activeTab === 'assignment' ? 'Create Assignment' :
            activeTab === 'students' ? 'Students viewing' :
            activeTab === 'approvals' ? 'Parent Registration Approvals' :
            activeTab === 'profile' ? 'Educator Profile' :
            activeTab === 'settings' ? 'Teacher Settings & Preferences' :
            `Welcome back, ${userProfile?.name || 'Educator'}!`
          }
          subtitle={
            activeTab === 'assignment' ? 'Select the details below to assign simulation to your students' :
            activeTab === 'students' ? 'view and monitor your student’s performance' :
            activeTab === 'approvals' ? 'Review, accept, or decline pending parent account requests' :
            activeTab === 'profile' ? 'View and manage your teacher profile information' :
            activeTab === 'settings' ? 'Configure gradebook rules, automated reminders, and display theme' :
            "Here's an overview of your classes"
          }
          onOpenProfileTab={() => setActiveTab('profile')}
        />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* 1. TEACHER DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-black dark:text-white">
                    <Icon name="shield" size={28} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold block uppercase tracking-wider">Total Student</span>
                    <span className="text-3xl font-black text-black dark:text-white">
                      {Math.max(dashboardMetrics?.totalStudents || 0, (displayClasses || []).reduce((acc, c) => acc + (c?.st || 0), 0), (sampleStudents || []).length)}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-black dark:text-white">
                    <Icon name="book" size={28} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold block uppercase tracking-wider">Assigned simulations</span>
                    <span className="text-3xl font-black text-black dark:text-white">
                      {dashboardMetrics && dashboardMetrics.totalSimulations !== undefined ? dashboardMetrics.totalSimulations : (dbAssignments ? dbAssignments.length : 0)}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-black dark:text-white">
                    <Icon name="book" size={28} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold block uppercase tracking-wider">Completed assignments</span>
                    <span className="text-3xl font-black text-black dark:text-white">{dashboardMetrics ? dashboardMetrics.completedAssignments : 0}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-black dark:text-white">My classes</h3>
                      <span className="text-xs text-gray-500 font-medium">Onboard students & generate physical login credentials</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowAddStudentModal(true)}
                        className="px-4 py-2 bg-black dark:bg-blue-600 text-white rounded-xl text-xs font-extrabold shadow-md hover:opacity-90 flex items-center gap-1.5"
                      >
                        <span>+ Generate Student Credentials</span>
                      </button>
                      <button onClick={() => setActiveTab('students')} className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white">
                        View all
                      </button>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold uppercase">
                        <th className="py-2.5 px-3">Class</th>
                        <th className="py-2.5 px-3">section</th>
                        <th className="py-2.5 px-3">students</th>
                        <th className="py-2.5 px-3">avg.score</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {displayClasses.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-3 font-bold text-black dark:text-white">{row.cls}</td>
                          <td className="py-3 px-3 font-medium text-gray-700 dark:text-gray-300">{row.sec}</td>
                          <td className="py-3 px-3 font-medium text-gray-700 dark:text-gray-300">{row.st}</td>
                          <td className="py-3 px-3 font-bold text-black dark:text-white">{row.avg}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setActiveTab('students')}
                              className="px-4 py-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-black dark:text-white font-bold rounded-full text-xs"
                            >
                              view
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="lg:col-span-4 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-black dark:text-white">Upcoming Due dates</h3>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">View all</span>
                  </div>

                  <div className="space-y-4 text-xs font-medium text-gray-800 dark:text-gray-200">
                    {upcomingDueDates.length === 0 ? (
                      <div className="text-xs text-gray-400 text-center py-4 font-bold">
                        No upcoming due dates
                      </div>
                    ) : (
                      upcomingDueDates.map((asg, idx) => (
                        <div key={asg.assignmentId || idx} className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl space-y-1">
                          <span className="font-bold text-black dark:text-white block">{idx + 1}. {asg.instructions || 'Disaster Safety Drill'}</span>
                          <span className="text-gray-500 dark:text-gray-400">Due date: {asg.dueDate}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. CREATE ASSIGNMENT SCREEN */}
          {activeTab === 'assignment' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
                  <h3 className="text-base font-extrabold text-black dark:text-white pb-2 border-b dark:border-gray-800">Assignment Details:</h3>

                  <div className="space-y-4 text-xs font-bold text-black dark:text-white">
                    <div className="space-y-1.5">
                      <label className="block">Select class:</label>
                      <div className="relative">
                        <select
                          value={selectedClassId}
                          onChange={e => {
                            setSelectedClassId(e.target.value);
                            const matched = displayClasses.find(c => (c.classId || c.id || '').toString() === e.target.value.toString());
                            if (matched) setSelectedClass((matched.className || '') + " " + (matched.section || ''));
                          }}
                          className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-2xl px-5 py-3.5 text-xs font-bold appearance-none cursor-pointer"
                        >
                          {displayClasses.map(c => {
                            const cid = c.classId || c.id || '';
                            return (
                              <option key={cid} value={cid}>
                                {c.cls || ''} {c.sec || ''}
                              </option>
                            );
                          })}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                          <Icon name="chevron-down" size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block">Select simulation:</label>
                      <div className="relative">
                        <select
                          value={selectedSimId}
                          onChange={e => {
                            setSelectedSimId(e.target.value);
                            const matched = uniqueSimulations.find(s => (s.simulationId || s.id || '').toString() === e.target.value.toString());
                            if (matched) setSelectedSim(matched.title || '');
                          }}
                          className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-2xl px-5 py-3.5 text-xs font-bold appearance-none cursor-pointer"
                        >
                          {uniqueSimulations.map(s => {
                            const sid = s.simulationId || s.id || '';
                            return (
                              <option key={sid} value={sid}>
                                {s.title || ''}
                              </option>
                            );
                          })}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                          <Icon name="chevron-down" size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block">Difficulty level:</label>
                      <div className="relative">
                        <select
                          value={difficulty}
                          onChange={e => setDifficulty(e.target.value)}
                          className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-2xl px-5 py-3.5 text-xs font-bold appearance-none cursor-pointer"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                          <Icon name="chevron-down" size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block">Due date:</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={dueDate}
                          onChange={e => setDueDate(e.target.value)}
                          className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-2xl px-5 py-3.5 text-xs font-bold [color-scheme:light] dark:[color-scheme:dark]"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                          <Icon name="calendar" size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block">Instruction(optional):</label>
                      <textarea
                        rows="4"
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                        className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-2xl p-4 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6 flex flex-col">
                  {/* Active Creation Preview */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold text-black dark:text-white pb-2 border-b dark:border-gray-800 uppercase tracking-wider">New Assignment Preview</h3>
                    <div className="space-y-2.5 text-xs font-bold text-black dark:text-white">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Class:</span>
                        <span>{selectedClass}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Simulation:</span>
                        <span className="truncate max-w-[180px]">{selectedSim}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Due Date:</span>
                        <span>{dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Existing Assignments (Assignment summary) */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col flex-1 min-h-[300px]">
                    <h3 className="text-sm font-extrabold text-black dark:text-white pb-2 border-b dark:border-gray-800 uppercase tracking-wider mb-3">Assignment Summary</h3>
                    
                    <div className="space-y-3 overflow-y-auto max-h-[320px] pr-1 flex-1">
                      {dbAssignments.length === 0 ? (
                        <div className="text-center py-12 text-xs text-gray-400 dark:text-gray-500 font-bold">
                          No simulations assigned yet.
                        </div>
                      ) : (
                        dbAssignments.map((asg) => (
                          <div key={asg.assignmentId || asg.id} className="p-3.5 bg-gray-50 dark:bg-gray-800/40 border border-gray-150 dark:border-gray-800/80 rounded-xl flex items-center justify-between gap-3 hover:shadow-sm transition-shadow">
                            <div className="min-w-0 flex-1 space-y-1">
                              <h4 className="text-xs font-extrabold text-black dark:text-white truncate">
                                {asg.simulationTitle || asg.title || 'Disaster Safety Drill'}
                              </h4>
                              <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                                <span>👥 {asg.className || 'Class'}</span>
                                <span>•</span>
                                <span>📅 Due: {asg.dueDate}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setDeletingAsgId(asg.assignmentId || asg.id)}
                              className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/45 dark:text-rose-400 flex items-center justify-center text-sm shrink-0 transition-colors cursor-pointer"
                              title="Delete Assignment"
                            >
                              🗑️
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-black dark:text-white font-extrabold rounded-full text-xs">
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const teacherId = userProfile?.teacherId || localStorage.getItem('teacherId') || 21;
                    
                    // 1. Resolve selected class object from displayClasses
                    const selectedObj = displayClasses.find(c => (c.classId || '').toString() === selectedClassId?.toString()) || displayClasses[0];

                    let numericClassId = null;
                    if (selectedObj) {
                      // Check if selectedObj.classId is already a number
                      if (selectedObj.classId && !isNaN(parseInt(selectedObj.classId))) {
                        numericClassId = parseInt(selectedObj.classId);
                      } else {
                        // Find matching class in dbClasses
                        const dbMatch = (dbClasses || []).find(dbc => {
                          const cName = (dbc.className || '').trim().toLowerCase();
                          const sName = (dbc.section || '').trim().toLowerCase();
                          return cName === (selectedObj.cls || '').trim().toLowerCase() && sName === (selectedObj.sec || '').trim().toLowerCase();
                        });
                        if (dbMatch && dbMatch.classId) {
                          numericClassId = dbMatch.classId;
                        }
                      }
                    }

                    // 2. If still null or invalid, query GET /api/classes to find existing matching class or POST /api/classes
                    if (!numericClassId && selectedObj) {
                      try {
                        const freshRes = await api.get('/api/classes');
                        const freshClasses = freshRes.data || [];
                        const freshMatch = freshClasses.find(dbc => {
                          const cName = (dbc.className || '').trim().toLowerCase();
                          const sName = (dbc.section || '').trim().toLowerCase();
                          return cName === (selectedObj.cls || '').trim().toLowerCase() && sName === (selectedObj.sec || '').trim().toLowerCase();
                        });
                        if (freshMatch && freshMatch.classId) {
                          numericClassId = freshMatch.classId;
                        } else {
                          const classRes = await api.post('/api/classes', {
                            className: selectedObj.cls,
                            section: selectedObj.sec,
                            schoolId: 1,
                            academicYear: '2025-2026',
                            teacherId: parseInt(teacherId)
                          });
                          if (classRes.data && classRes.data.classId) {
                            numericClassId = classRes.data.classId;
                          }
                        }
                      } catch (err) {
                        console.warn("Could not create/fetch class via API", err);
                      }
                    }

                    if (!numericClassId) {
                      showToast("Selected class does not exist in backend database.", "error");
                      return;
                    }

                    const payload = {
                      teacherId: parseInt(teacherId),
                      classId: parseInt(numericClassId),
                      simulationId: parseInt(selectedSimId || (uniqueSimulations[0]?.simulationId || 1)),
                      assignedDate: new Date().toISOString().split('T')[0],
                      dueDate: dueDate || '2026-08-30',
                      status: 'PENDING',
                      instructions: instructions || 'Please complete this simulation drill.'
                    };
                    try {
                      await api.post('/api/assignments', payload);
                      showToast('Simulation assigned successfully to the class!', 'success');
                      if (loadData) await loadData();
                      setInstructions('');
                      setActiveTab('dashboard');
                    } catch (e) {
                      console.error("Failed to assign", e);
                      showToast(e.response?.data?.message || "Error assigning simulation. Verify class/simulation exist in DB.", "error");
                    }
                  }}
                  className="px-10 py-3 bg-black dark:bg-blue-600 hover:opacity-90 text-white font-extrabold rounded-full text-xs transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          {/* 3. STUDENTS ROSTER VIEW */}
          {activeTab === 'students' && (() => {
            // Filter students strictly by selected class in dropdown
            const classFilteredStudents = sampleStudents.filter(std => {
              if (!filterRosterClassId) return true;
              if (std.classId && std.classId.toString() === filterRosterClassId.toString()) {
                return true;
              }
              // Fallback: match by class name string if classId is missing on student
              const selClassObj = displayClasses.find(c => (c.classId || '').toString() === filterRosterClassId.toString());
              if (selClassObj) {
                const targetClassStr = `${selClassObj.cls || ''}${selClassObj.sec || ''}`.toLowerCase().replace(/\s+/g, '');
                const stdClassStr = `${std.className || ''}${std.section || ''}`.toLowerCase().replace(/\s+/g, '');
                if (stdClassStr) return stdClassStr.includes(targetClassStr) || targetClassStr.includes(stdClassStr);
              }
              return false;
            });

            const rosterDisplayList = classFilteredStudents.filter(s =>
              s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="text-sm font-extrabold text-black dark:text-white block">Select the class you want to see:</label>
                  <div className="relative max-w-sm">
                    <select
                      value={filterRosterClassId}
                      onChange={e => setFilterRosterClassId(e.target.value)}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-2xl px-5 py-3 text-xs font-bold appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="">All Classes</option>
                      {displayClasses.length > 0 && (
                        displayClasses.map((c, i) => {
                          const cId = (c.classId || i).toString();
                          const label = `${c.cls || 'Class'} ${c.sec || ''}`.trim();
                          return (
                            <option key={cId} value={cId}>
                              {label}
                            </option>
                          );
                        })
                      )}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                      <Icon name="chevron-down" size={18} />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-black dark:text-white">Student List</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleExportCSV(rosterDisplayList)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <span>📊 Export CSV Report</span>
                      </button>
                      <div className="relative w-64">
                        <input
                          type="text"
                          placeholder="Search student..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs font-medium text-black dark:text-white px-8 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500"
                        />
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <Icon name="search" size={16} />
                        </div>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold uppercase">
                        <th className="py-3 px-3">S.no</th>
                        <th className="py-3 px-3">Student_name</th>
                        <th className="py-3 px-3">Roll_no</th>
                        <th className="py-3 px-3">Password</th>
                        <th className="py-3 px-3">Completion</th>
                        <th className="py-3 px-3">Avg.score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {rosterDisplayList.map((s, idx) => (
                        <tr key={s.studentId || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 font-bold text-black dark:text-white">
                          <td className="py-3.5 px-3 font-normal text-gray-500 dark:text-gray-400">{idx + 1}.</td>
                          <td className="py-3.5 px-3">{s.name}</td>
                          <td className="py-3.5 px-3 font-mono">{s.rollNo}</td>
                          <td className="py-3.5 px-3 font-mono text-emerald-600 dark:text-emerald-400">{s.password}</td>
                          <td className="py-3.5 px-3 text-gray-700 dark:text-gray-300">{s.completion}</td>
                          <td className="py-3.5 px-3 font-extrabold">{s.score}</td>
                        </tr>
                      ))}
                      {rosterDisplayList.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-xs text-gray-400 font-medium">
                            No students enrolled in the selected class matching "<strong>{searchQuery || 'criteria'}</strong>"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* 4. TEACHER PROFILE VIEW WITH EDIT BUTTON */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 font-bold">
                    <span className="text-3xl">{userProfile?.avatar || '👤'}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-black dark:text-white">{userProfile?.name || 'Educator'}</h2>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mt-0.5">{userProfile?.className || ''}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-1.5 bg-black dark:bg-blue-600 text-white rounded-xl text-xs font-extrabold shadow-sm hover:opacity-90 flex items-center gap-1.5"
                  >
                    <span>✏️ Edit Profile</span>
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5"
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>
                    Sign Out
                  </button>
                  <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Senior Educator
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700/80 space-y-1">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Full Name</span>
                  <span className="text-base font-extrabold text-black dark:text-white block">{userProfile?.name || '-'}</span>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700/80 space-y-1">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Age</span>
                  <span className="text-base font-extrabold text-black dark:text-white block">{userProfile?.age ? `${userProfile.age} years` : '-'}</span>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700/80 space-y-1">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Email Address</span>
                  <span className="text-base font-extrabold text-black dark:text-white block">{userProfile?.email || '-'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. DEDICATED TEACHER SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 animate-fadeIn">
              <h2 className="text-lg font-extrabold text-black dark:text-white pb-3 border-b border-gray-200 dark:border-gray-800">
                Teacher Preferences & Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-black dark:text-white block">Appearance Theme</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Current Theme: {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}</span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="px-4 py-2 bg-black dark:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-black dark:text-white block">Edit Account Info</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Update name, designation, email, age</span>
                    </div>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-4 py-2 bg-black dark:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-rose-700 dark:text-rose-400 block">Sign Out</span>
                      <span className="text-xs text-rose-500 dark:text-rose-400/70">Log out from your DisasterIQ account</span>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. DEDICATED TEACHER PARENT APPROVALS VIEW */}
          {activeTab === 'approvals' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b dark:border-gray-800">
                <div>
                  <h2 className="text-lg font-extrabold text-black dark:text-white">Pending Parent Registration Requests</h2>
                  <p className="text-xs text-gray-500 font-medium">Approve or decline new parent account requests</p>
                </div>
                <button onClick={fetchPendingParents} className="px-3.5 py-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-black dark:text-white text-xs font-bold rounded-xl shadow-sm">
                  🔄 Refresh
                </button>
              </div>


              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 font-bold uppercase">
                      <th className="py-3 px-4 rounded-l-xl">Parent Name</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">School</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {pendingParents.map(p => (
                      <tr key={p.userId} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50">
                        <td className="py-4 px-4 font-bold text-black dark:text-white">{p.fullName}</td>
                        <td className="py-4 px-4 font-mono text-gray-600 dark:text-gray-400">{p.email}</td>
                        <td className="py-4 px-4 font-medium text-gray-600 dark:text-gray-400">{p.phone || 'N/A'}</td>
                        <td className="py-4 px-4 font-medium text-black dark:text-white">{p.schoolName}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            PENDING APPROVAL
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleApproveParent(p.userId)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={() => handleRejectParent(p.userId)}
                            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                          >
                            ✕ Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingParents.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-xs text-gray-500 dark:text-gray-400 font-bold">
                          No pending parent registration requests at this time. All accounts are approved!
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

      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}

      {/* Onboard Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl space-y-5">
            {!generatedCreds ? (
              <>
                <div className="flex justify-between items-center pb-3 border-b dark:border-gray-800">
                  <h3 className="text-lg font-extrabold text-black dark:text-white">🎓 Onboard New Student</h3>
                  <button onClick={() => setShowAddStudentModal(false)} className="text-gray-400 hover:text-black dark:hover:text-white font-bold text-lg">✕</button>
                </div>
                
                {onboardError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                    {onboardError}
                  </div>
                )}
                
                <form onSubmit={handleOnboardStudent} className="space-y-4 text-xs font-bold">
                  <div className="space-y-1">
                    <label className="block text-gray-700 dark:text-gray-300">Student Full Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anish Kumar"
                      value={newStdName}
                      onChange={e => setNewStdName(e.target.value)}
                      className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-gray-300">Roll Number:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 10A05 or ROLL-101"
                        value={newStdRollNo}
                        onChange={e => setNewStdRollNo(e.target.value)}
                        className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-gray-300">Student Age:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 15"
                        value={newStdAge}
                        onChange={e => setNewStdAge(e.target.value)}
                        className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700 dark:text-gray-300">Phone Number:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543210"
                      value={newStdPhone}
                      onChange={e => setNewStdPhone(e.target.value)}
                      className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700 dark:text-gray-300">Student Email Address:</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. anish@school.edu"
                      value={newStdEmail}
                      onChange={e => setNewStdEmail(e.target.value)}
                      className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-gray-300">Class:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Class 6"
                        value={newStdClass}
                        onChange={e => setNewStdClass(e.target.value)}
                        className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white font-medium text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-gray-700 dark:text-gray-300">Section:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. A"
                        value={newStdSection}
                        onChange={e => setNewStdSection(e.target.value)}
                        className="w-full bg-[#E0E2E7] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-black dark:text-white font-medium text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black dark:bg-blue-600 text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-all text-xs"
                  >
                    Generate Credentials & Create Student
                  </button>
                </form>
              </>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                  ✓
                </div>
                <h3 className="text-base font-extrabold text-black dark:text-white">Credentials Generated!</h3>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-left space-y-2 text-xs font-bold text-gray-800 dark:text-gray-200">
                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Student Name:</span>
                    <span>{generatedCreds.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Login Email:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{generatedCreds.email}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Generated Password:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm font-black">{generatedCreds.password}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500">Student Age:</span>
                    <span>{generatedCreds.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assigned Class:</span>
                    <span>{generatedCreds.className}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 font-medium">
                  Pass this login email and password physically to the student so they can log in directly.
                </p>

                <button
                  onClick={() => {
                    setGeneratedCreds(null);
                    setShowAddStudentModal(false);
                  }}
                  className="w-full py-2.5 bg-black dark:bg-gray-700 text-white rounded-xl font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {deletingAsgId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-6 animate-scaleIn">
            <div className="flex items-center gap-3 text-black dark:text-white">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-extrabold leading-tight">Delete Assignment</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-wider">Action cannot be undone</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
              Are you sure you want to delete this assignment? It will be permanently removed from all students in the class.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingAsgId(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-extrabold rounded-full text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = deletingAsgId;
                  setDeletingAsgId(null);
                  try {
                    await api.delete(`/api/assignments/${id}`);
                    showToast('Assignment deleted successfully!', 'success');
                    if (loadData) await loadData();
                  } catch (e) {
                    showToast("Failed to delete assignment", "error");
                  }
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-full text-xs shadow-sm transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
