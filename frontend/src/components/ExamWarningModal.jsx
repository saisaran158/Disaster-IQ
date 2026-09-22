import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from './Icons';

export const ExamWarningModal = ({ simulation, onClose, onConfirmStart }) => {
  const handleStartExam = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        const p = document.documentElement.requestFullscreen();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }
      }
    } catch (e) {
      console.warn("Fullscreen request failed safely:", e);
    }

    onConfirmStart();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto bg-[#0a0512] border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-6 relative text-white">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-purple-400 hover:text-white p-1 rounded-full hover:bg-purple-900/40 transition-colors cursor-pointer"
        >
          <Icon name="x" size={20} />
        </button>

        {/* Warning Icon Banner */}
        <div className="w-16 h-16 rounded-2xl bg-purple-950/80 text-purple-400 flex items-center justify-center mx-auto border border-purple-700/50 shadow-lg shadow-purple-950/50">
          <Icon name="shield" size={36} />
        </div>

        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-xs font-black uppercase text-purple-400 tracking-wider">
            Exam & Drill Integrity Rules
          </span>
          <h2 className="text-xl font-extrabold text-white">Examination Integrity Warning</h2>
          <p className="text-xs text-purple-300 font-medium">
            You are about to start the assessment for: <strong className="text-white">{simulation?.title || 'Disaster Preparedness Quiz'}</strong>
          </p>
        </div>

        {/* Rules Checklist */}
        <div className="space-y-3 bg-purple-950/40 p-4 rounded-2xl border border-purple-800/50 text-xs font-semibold text-purple-200">
          <div className="flex items-start gap-2.5">
            <span className="text-base shrink-0">🚫</span>
            <span><strong>No External Resources:</strong> Do NOT use external books, search engines, mobile phones, or AI assistants during the exam.</span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-base shrink-0">🖥️</span>
            <span><strong>Enforced Full-Screen Mode:</strong> The assessment will run in <strong>Full-Screen Mode</strong>. Exiting full screen will log a integrity warning.</span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-base shrink-0">⏱️</span>
            <span><strong>Strict 30-Minute Time Limit:</strong> You have exactly <strong>30 minutes (30:00)</strong> to complete all questions. Auto-submits on expiry.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-3.5 bg-[#120b20] border border-purple-900/40 text-purple-200 font-bold rounded-2xl text-xs hover:bg-purple-900/40 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStartExam}
            className="purple-glow-btn w-full sm:w-1/2 py-3.5 text-white font-extrabold rounded-2xl text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Icon name="check" size={16} />
            <span>Enter Full-Screen & Start (30 Min)</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
