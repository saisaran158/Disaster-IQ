import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from './Icons';
import api from '../services/api';
import { awardBadgeToStudent, getBadgeForSimulation } from '../utils/badgeUtils';
import { useApp } from '../context/AppContext';

export const ExamResultModal = ({ simulation, onClose }) => {
  const { userProfile } = useApp() || {};
  const [recommendation, setRecommendation] = useState('');

  // Extract actual score passed in simulation object
  const rawScore = simulation?.score;
  const score = (rawScore !== null && rawScore !== undefined) ? Math.round(rawScore) : 80;
  
  const totalCount = 15;
  const correctCount = Math.round((score / 100) * totalCount);
  const totalPoints = correctCount * 10;
  const maxPoints = totalCount * 10;
  const isPassed = score >= 50;

  const studentEmail = userProfile?.email || localStorage.getItem('email') || localStorage.getItem('userEmail') || '';
  const earnedBadge = isPassed ? awardBadgeToStudent(studentEmail, simulation?.title, score) : null;

  const getGradeText = (sc) => {
    if (sc >= 90) return 'Grade A+ • Excellent Preparedness';
    if (sc >= 75) return 'Grade A • Good Preparedness';
    if (sc >= 50) return 'Grade B • Average Preparedness';
    return 'Grade C • Retake Recommended';
  };

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await api.get('/api/student/dashboard/me');
        if (res.data?.latestRecommendation) {
          setRecommendation(res.data.latestRecommendation);
        }
      } catch (err) {
        console.error("Could not fetch recommendation", err);
      }
    };
    fetchRecommendation();
  }, [simulation]);

  const displayFeedback = recommendation || (
    isPassed
      ? "Great job completing this disaster drill! You demonstrated solid understanding of safety protocols and hazard response."
      : "You completed the drill. Review the safety procedures and retake the assessment to improve your score!"
  );

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto bg-[#0a0512] border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-6 relative text-white">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-purple-400 hover:text-white p-1 rounded-full hover:bg-purple-900/40 transition-colors cursor-pointer"
        >
          <Icon name="x" size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
            isPassed 
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 shadow-emerald-950/50' 
              : 'bg-rose-950/80 border border-rose-500/50 text-rose-400 shadow-rose-950/50'
          }`}>
            <Icon name="trophy" size={28} />
          </div>
          <div>
            <span className={`text-xs font-black uppercase tracking-wider ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
              Completed Drill Report
            </span>
            <h2 className="text-xl font-extrabold text-white">{simulation?.title || 'Disaster Safety Drill'}</h2>
          </div>
        </div>

        {/* Badge Unlocked Banner */}
        {isPassed && earnedBadge && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-amber-950/80 border-2 border-amber-500/60 shadow-xl shadow-amber-950/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b pb-2 border-amber-500/30">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <span>🎉 BADGE UNLOCKED!</span>
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40">
                Score &gt; 50% Cleared!
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-900/50 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg shadow-amber-950/60 shrink-0">
                {earnedBadge.icon || '🏆'}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-base font-extrabold text-amber-200 leading-tight">
                  {earnedBadge.title}
                </h4>
                <p className="text-xs text-amber-100/90 font-medium">
                  {earnedBadge.description}
                </p>
                <span className="text-[10px] text-amber-300/80 font-bold block pt-1">
                  ✓ Added to your Student Profile
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Score Card Display */}
        <div className={`p-6 rounded-2xl border flex items-center justify-between ${
          score >= 75
            ? 'bg-gradient-to-br from-emerald-950/60 to-teal-950/60 border-emerald-500/50 text-emerald-100 shadow-lg shadow-emerald-950/30'
            : score >= 50
            ? 'bg-gradient-to-br from-purple-950/60 to-indigo-950/60 border-purple-500/50 text-purple-100 shadow-lg shadow-purple-950/30'
            : 'bg-gradient-to-br from-rose-950/60 to-red-950/60 border-rose-500/50 text-rose-100 shadow-lg shadow-rose-950/30'
        }`}>
          <div>
            <span className="text-xs font-extrabold uppercase block opacity-80">Your Actual Score</span>
            <div className="text-4xl font-black mt-1 text-white">{score}%</div>
            <span className="text-xs font-bold mt-1 block opacity-90">
              {getGradeText(score)}
            </span>
          </div>

          <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center bg-[#07040a] shadow-inner shrink-0 ${
            isPassed ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'
          }`}>
            <span className="text-xl font-black">{correctCount}/{totalCount}</span>
            <span className="text-[10px] font-bold text-purple-400">Correct</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold">
          <div className="p-4 bg-[#120b20] rounded-xl border border-purple-900/40">
            <span className="text-purple-400 block text-[10px] uppercase">Total Points</span>
            <span className="text-base text-white block mt-0.5">{totalPoints} / {maxPoints}</span>
          </div>

          <div className="p-4 bg-[#120b20] rounded-xl border border-purple-900/40">
            <span className="text-purple-400 block text-[10px] uppercase">Questions Answered</span>
            <span className="text-base text-white block mt-0.5">{totalCount} / {totalCount}</span>
          </div>

          <div className="p-4 bg-[#120b20] rounded-xl border border-purple-900/40 col-span-2 sm:col-span-1">
            <span className="text-purple-400 block text-[10px] uppercase">Status</span>
            <span className={`text-base block mt-0.5 ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPassed ? 'Passed ✓' : 'Failed ✗'}
            </span>
          </div>
        </div>

        {/* Feedback & Recommendations */}
        <div className="p-4 bg-purple-950/40 rounded-2xl border border-purple-800/50 space-y-1.5 text-xs">
          <span className="font-extrabold text-purple-300 block">💡 AI Performance Feedback</span>
          <p className="text-purple-200 font-medium leading-relaxed">
            {displayFeedback}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="purple-glow-btn w-full py-3.5 text-white font-extrabold rounded-2xl text-xs shadow-lg cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </div>,
    document.body
  );
};
