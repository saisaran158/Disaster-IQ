import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { LineChart, DonutChart, PreparednessGauge } from '../../components/Charts';
import { Icon } from '../../components/Icons';
import { SimulationPlayer } from '../../components/SimulationPlayer';
import { ExamWarningModal } from '../../components/ExamWarningModal';
import { ExamFullScreenRunner } from '../../components/ExamFullScreenRunner';
import { ExamResultModal } from '../../components/ExamResultModal';
import { EditProfileModal } from '../../components/EditProfileModal';
import { AIChatBox } from '../../components/AIChatBox';
import { useApp } from '../../context/AppContext';
import { getStudentBadges } from '../../utils/badgeUtils';

export const StudentPortal = () => {

  const { userProfile, theme, toggleTheme, logout, activeTab, setActiveTab, assignments: dbAssignments = [], simulations: dbSimulations = [], dashboardMetrics, loadData, showToast } = useApp() || {};
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [pendingWarningSim, setPendingWarningSim] = useState(null);
  const [activeExamSim, setActiveExamSim] = useState(null);
  const [viewResultSim, setViewResultSim] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const assignedSimulations = (dbAssignments || []).map((asg, idx) => {
    const sim = (dbSimulations || []).find(s => (s.simulationId || s.id) === (asg.simulationId || asg.id)) || {};
    // studentStatus from backend: COMPLETED, IN_PROGRESS, PENDING
    const studentStatus = asg.studentStatus || 'PENDING';
    const displayStatus = studentStatus === 'COMPLETED' ? 'Completed'
      : studentStatus === 'IN_PROGRESS' ? 'In Progress'
      : 'Not Started';
    return {
      id: asg.assignmentId || `sim-${idx}`,
      simulationId: sim.simulationId || sim.id || asg.simulationId,
      title: sim.title || asg.instructions || 'Disaster Safety Drill',
      difficulty: sim.difficulty || 'Intermediate',
      assignedOn: asg.assignedDate || '01 Aug 2026',
      dueDate: asg.dueDate || '10 Aug 2026',
      status: displayStatus,
      score: asg.score ?? null
    };
  });

  // Dynamic line chart data & preparedness score calculation from student's actual drill scores
  const completedAssignmentsWithScores = assignedSimulations
    .filter(s => s.status === 'Completed' && s.score !== null && s.score !== undefined);

  const dynamicPreparednessScore = dashboardMetrics && dashboardMetrics.preparedness !== undefined && dashboardMetrics.preparedness !== null
    ? Math.round(dashboardMetrics.preparedness)
    : (completedAssignmentsWithScores.length > 0
        ? Math.round(completedAssignmentsWithScores.reduce((acc, curr) => acc + curr.score, 0) / completedAssignmentsWithScores.length)
        : 0);

  let lineChartData = [];
  if (completedAssignmentsWithScores.length > 0) {
    lineChartData = completedAssignmentsWithScores.map((sim, idx) => ({
      label: sim.title.replace(' Simulation', '').replace(' Drill', ''),
      value: Math.round(sim.score)
    }));
  } else {
    lineChartData = [
      { label: 'Base', value: 0 },
      { label: 'Current', value: dynamicPreparednessScore }
    ];
  }

  // Calculate dynamic progress stats for Overall Progress chart
  const completedCount = assignedSimulations.filter(s => s.status === 'Completed').length;
  const inProgressCount = assignedSimulations.filter(s => s.status === 'In Progress').length;
  const notStartedCount = assignedSimulations.filter(s => s.status === 'Not Started' || (s.status !== 'Completed' && s.status !== 'In Progress')).length;
  const totalCount = assignedSimulations.length || 1;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  React.useEffect(() => {
    const autoStartSimId = localStorage.getItem('autoStartSimId');
    if (autoStartSimId && assignedSimulations.length > 0) {
      const targetSim = assignedSimulations.find(s => 
        (s.simulationId || '').toString() === autoStartSimId.toString() || 
        (s.id || '').toString() === autoStartSimId.toString()
      );
      if (targetSim) {
        localStorage.removeItem('autoStartSimId');
        setActiveExamSim(targetSim);
      }
    }
  }, [assignedSimulations]);

  const handleActionClick = (sim) => {
    if (sim.status === 'Completed') {
      setViewResultSim(sim);
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      if (sim.dueDate && sim.dueDate < todayStr && sim.assignedOn !== todayStr) {
        if (showToast) {
          showToast("This assignment has expired and can no longer be started.", "error");
        } else {
          alert("This assignment has expired and can no longer be started.");
        }
        return;
      }
      setPendingWarningSim(sim);
    }
  };

  const handleConfirmStartExam = () => {
    const sim = pendingWarningSim;
    setPendingWarningSim(null);
    setActiveExamSim(sim || assignedSimulations[0]);
  };

  const handleExamSubmitComplete = async () => {
    setActiveExamSim(null);
    try { if (loadData) await loadData(); } catch(e) {}
    setActiveTab('dashboard');
  };

  return (
    <div className="flex bg-[#f6f0ff] dark:bg-[#07040a] h-screen overflow-hidden text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          title={
            activeTab === 'ai-path' ? 'AI Adaptive Learning' :
            activeTab === 'assessments' ? 'Assessments' :
            activeTab === 'my-assignments' ? 'My Assignments' :
            activeTab === 'profile' ? 'Student Profile' :
            activeTab === 'settings' ? 'Student Settings' :
            `Welcome back, ${userProfile.name}!`
          }
          subtitle={
            activeTab === 'ai-path' ? 'Personalized learning that adapts to your performance and helps you improve.' :
            activeTab === 'assessments' ? 'Test your knowledge and improve your preparedness' :
            activeTab === 'my-assignments' ? 'All disaster drills assigned by your teacher' :
            activeTab === 'profile' ? 'View and manage your student profile details' :
            activeTab === 'settings' ? 'Manage notification preferences, display theme, and account settings' :
            'Stay prepared, Stay safe'
          }
          onOpenProfileTab={() => setActiveTab('profile')}
        />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* 1. DASHBOARD VIEW (PAGE 4) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Top Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-inner">
                    <Icon name="shield" size={28} />
                  </div>
                  <div>
                    <span className="text-xs text-purple-300/80 font-bold block uppercase tracking-wider">Preparedness Score</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300">{dynamicPreparednessScore}%</span>
                  </div>
                </div>

                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-inner">
                    <Icon name="book" size={28} />
                  </div>
                  <div>
                    <span className="text-xs text-purple-300/80 font-bold block uppercase tracking-wider">Simulations assigned</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300">{assignedSimulations.length}</span>
                  </div>
                </div>

                <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-inner">
                    <Icon name="book" size={28} />
                  </div>
                  <div>
                    <span className="text-xs text-purple-300/80 font-bold block uppercase tracking-wider">Completed simulations</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300">{completedCount}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Simulation Table Card */}
              <div className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Assigned Simulation:</h3>
                    <span className="text-xs text-purple-300/70 font-medium">Simulations assigned by your teacher</span>
                  </div>
                  <button onClick={() => setActiveTab('my-assignments')} className="text-xs font-bold text-purple-300 hover:text-white transition-colors">
                    View all assignments →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-purple-950/80 text-purple-200 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4 rounded-l-xl">Simulation</th>
                        <th className="py-3 px-4">Difficulty</th>
                        <th className="py-3 px-4">Assigned on</th>
                        <th className="py-3 px-4">Due date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/30">
                      {assignedSimulations.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-purple-300/60 font-bold">
                            No simulations assigned yet. Check back when your teacher assigns a drill!
                          </td>
                        </tr>
                      ) : (
                        assignedSimulations.map((sim) => (
                        <tr key={sim.id} className="hover:bg-purple-900/20 transition-colors">
                          <td className="py-4 px-4 font-bold text-white max-w-xs">{sim.title}</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-900/60 text-purple-200 border border-purple-500/30">
                              {sim.difficulty}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-purple-300/80 font-medium">{sim.assignedOn}</td>
                          <td className="py-4 px-4 text-purple-300/80 font-medium">{sim.dueDate}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                              sim.status === 'Completed' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                              : sim.status === 'In Progress' ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                              : 'bg-gray-900/80 text-gray-400 border-gray-700/50'
                            }`}>{sim.status}</span>
                          </td>
                          <td className="py-4 px-4 font-bold">
                            {sim.status === 'Completed' && sim.score != null
                              ? <span className={`text-sm font-black ${
                                  sim.score >= 90 ? 'text-emerald-400' :
                                  sim.score >= 70 ? 'text-purple-300' :
                                  sim.score >= 50 ? 'text-amber-400' : 'text-rose-400'
                                }`}>{Math.round(sim.score)}%</span>
                              : <span className="text-gray-500 text-xs">-</span>
                            }
                          </td>
                          <td className="py-4 px-4 text-right">
                            {(() => {
                              const todayStr = new Date().toISOString().split('T')[0];
                              const isOverdue = sim.dueDate && sim.dueDate < todayStr && sim.assignedOn !== todayStr;
                              const isCompleted = sim.status === 'Completed';

                              if (isCompleted) {
                                return (
                                  <button
                                    onClick={() => handleActionClick(sim)}
                                    className="px-4 py-1.5 border border-emerald-500/60 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 font-bold rounded-full text-xs transition-colors shadow-sm"
                                  >
                                    View result
                                  </button>
                                );
                              } else if (isOverdue) {
                                return (
                                  <button
                                    disabled
                                    className="px-4 py-1.5 border border-rose-900/40 bg-rose-950/30 text-rose-400 font-bold rounded-full text-xs cursor-not-allowed select-none"
                                  >
                                    Expired
                                  </button>
                                );
                              } else {
                                return (
                                  <button
                                    onClick={() => handleActionClick(sim)}
                                    className="purple-glow-btn px-4 py-1.5 font-bold rounded-full text-xs text-white"
                                  >
                                    Start now
                                  </button>
                                );
                              }
                            })()}
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white">Preparedness Overview</h3>
                    <select className="bg-[#120b20] border border-purple-500/30 text-xs font-bold px-3 py-1 rounded-lg text-purple-200 outline-none">
                      <option>This Month</option>
                    </select>
                  </div>
                  <LineChart data={lineChartData} height={200} color="#a855f7" />
                </div>

                <div className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 flex flex-col items-center justify-center">
                  <h3 className="text-sm font-extrabold text-white mb-4 w-full text-left">Overall Progress</h3>
                  <DonutChart
                    items={[
                      { label: 'Completed', value: completedCount, color: '#10B981' },
                      { label: 'In Progress', value: inProgressCount, color: '#8B5CF6' },
                      { label: 'Not Started', value: notStartedCount, color: '#4C1D95' }
                    ]}
                    size={160}
                    centerTitle={`${completionPercentage}%`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. MY ASSIGNMENTS VIEW */}
          {activeTab === 'my-assignments' && (
            <div className="purple-glass rounded-2xl p-6 border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4 animate-fadeIn">
              <h2 className="text-lg font-extrabold text-white">My Assigned Disaster Drills</h2>
              <div className="space-y-3">
                {assignedSimulations.map(sim => (
                  <div key={sim.id} className="p-4 border border-purple-900/40 bg-purple-950/30 rounded-xl flex items-center justify-between hover:border-purple-500/40 transition-colors">
                    <div>
                      <h4 className="font-bold text-white text-sm">{sim.title}</h4>
                      <p className="text-xs text-purple-300/70">Assigned: {sim.assignedOn} • Due: {sim.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {sim.status === 'Completed' && sim.score != null && (
                        <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                          sim.score >= 90 ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' :
                          sim.score >= 70 ? 'bg-purple-950 text-purple-300 border-purple-500/40' :
                          'bg-amber-950 text-amber-300 border-amber-500/40'
                        }`}>
                          Score: {Math.round(sim.score)}%
                        </span>
                      )}
                      <button
                        onClick={() => handleActionClick(sim)}
                        className={`px-4 py-1.5 font-bold rounded-full text-xs transition-all ${
                          sim.status === 'Completed'
                            ? 'border border-emerald-500/60 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
                            : 'purple-glow-btn text-white'
                        }`}
                      >
                        {sim.status === 'Completed' ? 'View Result' : 'Start Drill'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. AI ADAPTIVE LEARNING SCREEN */}
          {activeTab === 'ai-path' && (() => {
            const highDrills = completedAssignmentsWithScores.filter(s => s.score >= 60);
            const lowDrills = completedAssignmentsWithScores.filter(s => s.score < 60);

            const strongTopics = highDrills.length > 0
              ? highDrills.map(s => s.title.replace(' Drill', '').replace(' Simulation', '') + ' Protocols')
              : ['Complete drills to uncover strong areas'];

            const weakTopics = lowDrills.length > 0
              ? lowDrills.map(s => s.title.replace(' Drill', '').replace(' Simulation', '') + ' Preparedness')
              : ['No critical weak areas detected!'];

            return (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-white">Your Learning Intelligence</h2>
                    <p className="text-xs text-purple-300/70 font-medium">Insight based on your performance</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-xl font-black text-white shrink-0 ${
                        dynamicPreparednessScore >= 75 ? 'border-emerald-500' : dynamicPreparednessScore >= 50 ? 'border-purple-500' : 'border-amber-500'
                      }`}>
                        {dynamicPreparednessScore}%
                      </div>
                      <div>
                        <span className="text-xs font-bold text-purple-300/70 uppercase">Learning Score</span>
                        <h4 className={`text-sm font-extrabold ${
                          dynamicPreparednessScore >= 75 ? 'text-emerald-400' : dynamicPreparednessScore >= 50 ? 'text-purple-300' : 'text-amber-400'
                        }`}>
                          {dynamicPreparednessScore >= 75 ? 'Great Work!' : dynamicPreparednessScore >= 50 ? 'Good Progress!' : 'Needs Practice'}
                        </h4>
                        <p className="text-[11px] text-purple-300/70 font-medium">Based on your latest drill results.</p>
                        <span className="text-[11px] font-bold text-white mt-1 block">Live DB Metric</span>
                      </div>
                    </div>

                    <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex flex-col justify-between space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300">
                          <Icon name="brain" size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-white block">Strong Areas</span>
                          <div className="text-xs text-purple-300/80 font-medium mt-1 leading-relaxed">
                            {strongTopics.map((top, idx) => (
                              <div key={idx}>• {top}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="purple-glass purple-glass-hover p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex flex-col justify-between space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
                          <Icon name="target" size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-white block">Needs Improvement</span>
                          <div className="text-xs text-purple-300/80 font-medium mt-1 leading-relaxed">
                            {weakTopics.map((top, idx) => (
                              <div key={idx}>• {top}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Chat Box */}
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-white">Ask AI Assistant</h2>
                    <p className="text-xs text-purple-300/70 font-medium">Clarify your doubts about disaster preparedness instantly</p>
                  </div>
                  <AIChatBox />
                </div>
              </div>
            );
          })()}

          {/* 5. STUDENT PROFILE SCREEN WITH EDIT BUTTON */}
          {activeTab === 'profile' && (() => {
            const studentBadges = getStudentBadges(userProfile.email);
            const totalBadgesGained = studentBadges.length;

            return (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="purple-glass p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-purple-900/40">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-purple-900/50 border-2 border-purple-500/40 flex items-center justify-center text-white font-bold shadow-md shadow-purple-950/50">
                          <span className="text-3xl">{userProfile.avatar || '👤'}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-white">{userProfile.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                          <span>🔒 Managed by Teacher</span>
                        </div>
                        <button
                          onClick={logout}
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-colors"
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-bold text-purple-200">
                      <div className="flex gap-4">
                        <span className="text-purple-400/80 w-28">Name :</span>
                        <span>{userProfile.name}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-purple-400/80 w-28">Class :</span>
                        <span>{userProfile.className}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-purple-400/80 w-28">Age :</span>
                        <span>{userProfile.age} years</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-purple-400/80 w-28">Email :</span>
                        <span>{userProfile.email}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-purple-400/80 w-28">School :</span>
                        <span>{userProfile.school}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-purple-400/80 w-28">Phone no :</span>
                        <span>{userProfile.emergencyContact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="purple-glass p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 flex flex-col items-center justify-center">
                    <h3 className="text-sm font-extrabold text-white w-full text-left mb-2">Preparedness Overview</h3>
                    <PreparednessGauge score={dynamicPreparednessScore} size={170} />
                    <span className="text-xs font-bold text-purple-300 mt-2">Live Preparedness Score</span>
                  </div>
                </div>

                {/* Badges & Achievements Section */}
                <div className="purple-glass p-6 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-5">
                  <div className="flex items-center justify-between border-b pb-3 border-purple-900/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-400 flex items-center justify-center text-xl shadow-md">
                        🏆
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white">Badges & Achievements</h3>
                        <p className="text-xs text-purple-300/70 font-medium">Earned by clearing disaster safety drills with 50%+ score</p>
                      </div>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-950 to-purple-950 text-amber-300 border border-amber-500/50 shadow-md">
                      Total Badges Gained: {totalBadgesGained}
                    </span>
                  </div>

                  {studentBadges.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {studentBadges.map((badge, idx) => {
                        const actualScore = (badge.earnedScore && badge.earnedScore !== 85)
                          ? badge.earnedScore
                          : (dynamicPreparednessScore || 80);

                        return (
                          <div
                            key={badge.id || idx}
                            className="purple-glass p-4 rounded-2xl border border-purple-800/50 shadow-md hover:border-amber-500/60 transition-all space-y-2 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                                {badge.icon}
                              </div>
                              <div>
                                <span className="text-[10px] font-extrabold uppercase text-amber-400 block tracking-wider">{badge.category}</span>
                                <h4 className="text-sm font-extrabold text-white leading-tight">{badge.title}</h4>
                              </div>
                            </div>

                            <p className="text-xs text-purple-200/80 font-medium leading-relaxed">
                              {badge.description}
                            </p>

                            <div className="flex items-center justify-between text-[11px] font-bold text-purple-300/80 border-t pt-2 border-purple-900/40">
                              <span className="text-emerald-400 font-extrabold text-xs">Score: {actualScore}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-purple-950/30 rounded-2xl border border-purple-900/40 space-y-2">
                      <span className="text-3xl block">🛡️</span>
                      <span className="text-xs font-extrabold text-purple-200 block">No Badges Gained Yet</span>
                      <p className="text-[11px] text-purple-400/80 font-medium max-w-sm mx-auto">
                        Complete disaster preparedness drills on your dashboard with a score above 50% to gain safety badges!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 6. STUDENT SETTINGS SCREEN */}
          {activeTab === 'settings' && (
            <div className="purple-glass p-8 rounded-2xl border border-purple-900/40 shadow-lg shadow-purple-950/30 space-y-6 animate-fadeIn">
              <h2 className="text-lg font-extrabold text-white pb-3 border-b border-purple-900/40">
                Student Preferences & Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-white block">Appearance Theme</span>
                      <span className="text-xs text-purple-300/80">Current: Black & Royal Purple Theme 🌙</span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="purple-glow-btn px-4 py-2 text-white text-xs font-bold rounded-xl"
                    >
                      Toggle Mode
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-purple-950/40 rounded-xl border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-white block">Student Account Info</span>
                      <span className="text-xs text-purple-300/80">Profile details are created and managed by your teacher</span>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5">
                      🔒 Read-Only
                    </span>
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

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <EditProfileModal onClose={() => setShowEditProfileModal(false)} />
      )}

      {/* Score Result Modal */}
      {viewResultSim && (
        <ExamResultModal
          simulation={viewResultSim}
          onClose={() => setViewResultSim(null)}
        />
      )}

      {/* Exam Warning Modal */}
      {pendingWarningSim && (
        <ExamWarningModal
          simulation={pendingWarningSim}
          onClose={() => setPendingWarningSim(null)}
          onConfirmStart={handleConfirmStartExam}
        />
      )}

      {/* Full-Screen Exam Runner */}
      {activeExamSim && (
        <ExamFullScreenRunner
          simulation={activeExamSim}
          onClose={() => setActiveExamSim(null)}
          onSubmitExam={handleExamSubmitComplete}
        />
      )}

      {/* Interactive Simulation Player */}
      {activeSimulation && (
        <SimulationPlayer
          simulation={activeSimulation}
          onClose={() => setActiveSimulation(null)}
          onStartQuiz={(sim) => {
            setActiveSimulation(null);
            setPendingWarningSim(sim);
          }}
        />
      )}
    </div>
  );
};
