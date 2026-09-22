import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from './Icons';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { awardBadgeToStudent, getBadgeForSimulation } from '../utils/badgeUtils';

export const ExamFullScreenRunner = ({ simulation, onClose, onSubmitExam }) => {
  const { loadData, showToast, userProfile } = useApp() || {};
  const [questions, setQuestions] = useState([]);
  const [assessmentId, setAssessmentId] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scoreResult, setScoreResult] = useState(null);
  const [notifiedParentEmail, setNotifiedParentEmail] = useState('');
  const [loadError, setLoadError] = useState(null);

  // ─── Exit fullscreen safely ───────────────────────────────────────────────
  const exitFullscreenSafe = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        const p = document.exitFullscreen();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    } catch (e) {
      console.warn('exitFullscreen safe-fail:', e);
    }
  };

  // ─── Handle exam finish / submit ─────────────────────────────────────────
  const handleFinish = useCallback(async () => {
    if (isFinished) return;
    setLoading(true);

    const studentIdStr = localStorage.getItem('studentId');
    const studentId = studentIdStr ? parseInt(studentIdStr) : 25;
    const assignmentId = simulation?.assignmentId ? parseInt(simulation.assignmentId) : (simulation?.id ? parseInt(simulation.id) : null);

    const answers = Object.entries(userAnswers).map(([qId, selectedOptionIdx]) => {
      const q = questions.find(item => item.id === parseInt(qId));
      const selectedOptionId = q && q.optionIds ? q.optionIds[selectedOptionIdx] : null;
      return {
        questionId: parseInt(qId),
        selectedOptionId: selectedOptionId
      };
    }).filter(a => a.selectedOptionId !== null);

    const payload = { studentId, assessmentId, assignmentId, answers };
    let finalScore = 0;
    const studentEmail = userProfile?.email || localStorage.getItem('email') || localStorage.getItem('userEmail') || '';

    try {
      const submitRes = await api.post('/api/student/assessment/submit', payload);
      setScoreResult(submitRes.data);
      finalScore = submitRes.data.percentage || 0;
      
      if (finalScore >= 50) {
        awardBadgeToStudent(studentEmail, simulation?.title, finalScore);
      }
      
      // Notify parent via email if registered
      try {
        const scorePercent = submitRes.data.percentage || 0;
        console.log("Notifying parent email... studentId:", studentId, "score:", scorePercent);
        const emailRes = await api.post('/api/parent/dashboard/notify-email', {
          studentId: studentId,
          title: simulation?.title || 'Disaster Safety Drill',
          score: scorePercent
        });
        console.log("Parent notification response:", emailRes.data);
        if (emailRes.data && (emailRes.data.notified === true || emailRes.data.notified === 'true')) {
          const parentEmailVal = emailRes.data.email || 'Parent';
          setNotifiedParentEmail(parentEmailVal);
          if (showToast) showToast(`📧 Email report sent to registered parent: ${parentEmailVal}`, 'success');
        } else {
          setNotifiedParentEmail('');
          if (showToast) showToast(emailRes.data?.message || 'No registered parent linked to your profile.', 'info');
        }
      } catch (err) {
        setNotifiedParentEmail('');
        console.error('Failed to notify parent email', err);
      }
    } catch (e) {
      console.error('Failed to submit score', e);
      const localScore = answers.length;
      const total = questions.length || 1;
      finalScore = Math.round((localScore / total) * 100);
      setScoreResult({
        score: localScore,
        totalMarks: total,
        percentage: finalScore,
        passed: finalScore >= 50,
        recommendation: 'Could not connect to server. Please check your connection.'
      });
      if (finalScore >= 50) {
        awardBadgeToStudent(studentEmail, simulation?.title, finalScore);
      }
    } finally {
      setIsFinished(true);
      setLoading(false);
    }
  }, [isFinished, userAnswers, questions, assessmentId, simulation, showToast]);

  // Keep ref always up-to-date so timer closure sees latest state
  const handleFinishRef = useRef(handleFinish);
  useEffect(() => {
    handleFinishRef.current = handleFinish;
  }, [handleFinish]);

  // ─── Fetch questions on mount ─────────────────────────────────────────────
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        // simulation.simulationId is the actual simulation ID from the DB
        let simId = simulation?.simulationId;

        // Also accept numeric string
        if (simId) simId = parseInt(simId);

        // Fallback: map title keywords to known simulation IDs
        if (!simId || isNaN(simId)) {
          const title = (simulation?.title || '').toLowerCase();
          if (title.includes('earthquake')) simId = 1;
          else if (title.includes('fire')) simId = 2;
          else if (title.includes('tsunami') || title.includes('flood')) simId = 3;
          else simId = 1; // last resort default
        }

        console.log('[ExamFullScreenRunner] Fetching assessment for simulationId:', simId);

        // 1. Fetch assessment for simulation
        const assessRes = await api.get(`/api/assessments/simulation/${simId}`);
        const assessId = assessRes.data?.assessmentId;

        if (!assessId) {
          console.warn('[ExamFullScreenRunner] No assessment found for simulationId:', simId);
          setQuestions([]);
          setLoading(false);
          return;
        }

        setAssessmentId(assessId);
        console.log('[ExamFullScreenRunner] Found assessmentId:', assessId);

        // 2. Fetch questions for assessment
        const questionsRes = await api.get(`/api/questions/assessment/${assessId}`);
        const dbQs = questionsRes.data || [];

        console.log('[ExamFullScreenRunner] Questions fetched:', dbQs.length);

        // 3. Fetch options for each question
        const loadedQs = [];
        for (const q of dbQs) {
          if (!q || !q.questionId) continue;
          try {
            const optionsRes = await api.get(`/api/options/question/${q.questionId}`);
            const opts = optionsRes.data || [];
            loadedQs.push({
              id: q.questionId,
              question: q.questionText || 'Question text missing',
              options: Array.isArray(opts) ? opts.map(o => o.optionText || '') : [],
              optionIds: Array.isArray(opts) ? opts.map(o => o.optionId) : []
            });
          } catch (optErr) {
            console.error(`Error fetching options for question ${q.questionId}`, optErr);
            loadedQs.push({
              id: q.questionId,
              question: q.questionText || 'Question text missing',
              options: [],
              optionIds: []
            });
          }
        }

        setQuestions(loadedQs);
      } catch (err) {
        console.error('[ExamFullScreenRunner] Error loading questions:', err);
        setLoadError('Failed to load questions. Please check your connection and try again.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [simulation]);

  // ─── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isFinished || loading || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, loading, questions.length]);

  // ─── Keyboard navigation (Enter to move to next question) ─────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished || loading || questions.length === 0) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        setCurrentIdx(prev => {
          if (prev < questions.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, loading, questions.length]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m} : ${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (optIdx) => {
    if (questions.length === 0) return;
    const currentQ = questions[currentIdx];
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }));
  };

  const handleExitFullScreen = async () => {
    exitFullscreenSafe();
    try { if (loadData) await loadData(); } catch (e) {}
    onSubmitExam(scoreResult || userAnswers);
  };

  // ─── Loading screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#07040a] flex flex-col items-center justify-center z-50 gap-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-purple-500/50"></div>
        <div className="text-sm font-bold text-purple-200">Loading Questions...</div>
        <div className="text-xs text-purple-400/70">{simulation?.title || 'Simulation Assessment'}</div>
      </div>
    );
  }

  // ─── Error screen ─────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="fixed inset-0 bg-[#07040a] flex flex-col items-center justify-center z-50 p-6">
        <div className="bg-[#0a0512] p-8 rounded-3xl border border-rose-900/50 shadow-2xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-rose-950/80 border border-rose-700 text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✕
          </div>
          <h2 className="text-lg font-black text-white">Connection Error</h2>
          <p className="text-xs text-purple-300 leading-relaxed">{loadError}</p>
          <button
            onClick={handleExitFullScreen}
            className="purple-glow-btn w-full py-3 text-white font-bold rounded-2xl text-xs"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── No questions screen ──────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#07040a] flex flex-col items-center justify-center z-50 p-6">
        <div className="bg-[#0a0512] p-8 rounded-3xl border border-purple-900/40 shadow-2xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-amber-950/80 border border-amber-700 text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            ⚠
          </div>
          <h2 className="text-lg font-black text-white">No Questions Configured</h2>
          <p className="text-xs text-purple-300 leading-relaxed">
            There are no questions configured for this simulation assessment in the database. Please contact your teacher.
          </p>
          <button
            onClick={handleExitFullScreen}
            className="purple-glow-btn w-full py-3 text-white font-bold rounded-2xl text-xs"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── Main exam view ───────────────────────────────────────────────────────
  const currentQ = questions[currentIdx] || { question: '', options: [] };
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const questionsLeft = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 bg-[#07040a] text-purple-100 flex flex-col font-sans select-none overflow-y-auto animate-fadeIn">
      {/* Top Header */}
      <header className="px-6 py-4 bg-[#0a0512]/90 border-b border-purple-900/40 backdrop-blur-md flex items-center justify-between shadow-xl sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Icon name="logo-shield" size={32} />
          <div>
            <h1 className="text-base font-extrabold text-white leading-tight">
              {simulation?.title || 'Disaster Preparedness Exam'}
            </h1>
            <span className="text-xs text-purple-400 font-bold">
              Question {currentIdx + 1} of {totalQuestions} • ({questionsLeft} Questions Left)
            </span>
          </div>
        </div>

        {/* Timer Badge */}
        <div className="flex items-center gap-4">
          <div className={`px-5 py-2 rounded-2xl border font-mono font-black text-sm flex items-center gap-2 ${
            timeLeft < 60
              ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
              : 'bg-[#120b20] border-purple-500/30 text-purple-200'
          }`}>
            <Icon name="clock" size={18} />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={handleFinish}
            className="purple-glow-btn px-5 py-2 text-white font-extrabold rounded-full text-xs"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Main Exam Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-between space-y-8">
        {!isFinished ? (
          <>
            {/* Question Box */}
            <div className="bg-[#0a0512] p-8 rounded-3xl border border-purple-900/40 shadow-2xl shadow-purple-950/40 space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-purple-400 border-b pb-3 border-purple-900/40">
                <span className="text-white">QUESTION {currentIdx + 1} OF {totalQuestions}</span>
                <span>{userAnswers[currentQ.id] !== undefined ? '✓ Answered' : 'Unanswered'}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {currentQ.question}
              </h2>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((optText, optIdx) => {
                  const isSelected = userAnswers[currentQ.id] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-4 transition-all ${
                        isSelected
                          ? 'bg-purple-900/50 border-purple-400 text-white ring-2 ring-purple-500 shadow-md shadow-purple-950/50'
                          : 'bg-[#120b20] border-purple-900/40 text-purple-200 hover:border-purple-500/50 hover:bg-purple-950/40'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'purple-glow-btn text-white'
                          : 'bg-purple-950 border border-purple-700/50 text-purple-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{optText}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions Navigator Pills */}
            <div className="bg-[#0a0512] p-4 rounded-2xl border border-purple-900/40 flex items-center justify-center flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAns = userAnswers[q.id] !== undefined;
                const isCurr = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                      isCurr
                        ? 'purple-glow-btn text-white font-black ring-2 ring-purple-400'
                        : isAns
                        ? 'bg-purple-950 border border-purple-500 text-purple-200'
                        : 'bg-[#120b20] border border-purple-900/40 text-purple-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                className="px-6 py-3 bg-[#120b20] border border-purple-900/40 text-purple-200 font-bold rounded-2xl text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-900/40"
              >
                ← Previous
              </button>

              {currentIdx < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                  className="purple-glow-btn px-8 py-3 text-white font-extrabold rounded-2xl text-xs shadow-md"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs shadow-md"
                >
                  Submit Final Exam
                </button>
              )}
            </div>
          </>
        ) : (
          /* Finished View - Score Screen */
          <div className="bg-[#0a0512] p-10 rounded-3xl border border-purple-900/40 text-center space-y-6 my-auto shadow-2xl max-w-lg mx-auto">
            {/* Score Circle */}
            <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto text-white font-black shadow-xl ${
              (scoreResult?.percentage || 0) >= 90 ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-2 border-emerald-400' :
              (scoreResult?.percentage || 0) >= 70 ? 'bg-gradient-to-br from-purple-600 to-indigo-700 border-2 border-purple-400' :
              (scoreResult?.percentage || 0) >= 50 ? 'bg-gradient-to-br from-amber-600 to-orange-700 border-2 border-amber-400' :
              'bg-gradient-to-br from-rose-600 to-red-700 border-2 border-rose-400'
            }`}>
              <span className="text-3xl font-black">{scoreResult ? Math.round(scoreResult.percentage) : 0}%</span>
              <span className="text-xs font-bold opacity-90">
                {(scoreResult?.percentage || 0) >= 90 ? '🏆 Excellent' :
                 (scoreResult?.percentage || 0) >= 70 ? '⭐ Good' :
                 (scoreResult?.percentage || 0) >= 50 ? '📚 Fair' : '💪 Keep Trying'}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Assessment Complete! 🎉</h2>
              <p className="text-sm text-purple-300 font-semibold">
                {simulation?.title || 'Disaster Safety Drill'}
              </p>
            </div>

            {/* Score Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#120b20] p-3 rounded-2xl border border-purple-900/40">
                <div className="text-2xl font-black text-white">{scoreResult?.score ?? 0}</div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">Correct</div>
              </div>
              <div className="bg-[#120b20] p-3 rounded-2xl border border-purple-900/40">
                <div className="text-2xl font-black text-white">{totalQuestions}</div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">Total Qs</div>
              </div>
              <div className={`p-3 rounded-2xl border ${
                scoreResult?.passed
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-400'
              }`}>
                <div className="text-lg font-black">
                  {scoreResult?.passed ? '✓ Pass' : '✗ Fail'}
                </div>
                <div className="text-[10px] font-bold opacity-80 uppercase tracking-wide">Status</div>
              </div>
            </div>

            {/* Badge Earned Card */}
            {(scoreResult?.percentage || 0) >= 50 && (() => {
              const badge = getBadgeForSimulation(simulation?.title);
              return (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-amber-950/80 border-2 border-amber-500/60 shadow-xl text-left flex items-center gap-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-2xl bg-amber-900/50 border border-amber-400 flex items-center justify-center text-3xl shrink-0 shadow-md">
                    {badge.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">🎉 BADGE UNLOCKED!</span>
                    <h4 className="text-sm font-extrabold text-amber-100">{badge.title}</h4>
                    <span className="text-[11px] text-amber-200/80 font-medium block">✓ Added to your Student Profile</span>
                  </div>
                </div>
              );
            })()}

             {/* AI Recommendation */}
            {scoreResult?.recommendation && (
              <div className="p-4 bg-purple-950/50 rounded-2xl border border-purple-800/50 text-xs font-semibold text-purple-200 text-left">
                <span className="font-black block mb-1 text-purple-300">💡 AI Recommendation</span>
                {scoreResult.recommendation}
              </div>
            )}

            <button
              onClick={handleExitFullScreen}
              className="purple-glow-btn w-full py-4 text-white font-black text-sm rounded-2xl shadow-lg"
            >
              Exit & Return to Dashboard →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
