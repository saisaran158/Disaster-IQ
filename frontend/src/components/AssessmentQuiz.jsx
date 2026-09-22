import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

const quizQuestionsData = {
  'sim-1': [
    {
      id: 1,
      question: 'What does the acronym "DCH" stand for during an earthquake evacuation drill?',
      options: ['Drop, Cover, Hold On', 'Doorway, Corridor, Hallway', 'Direction, Caution, Hazard', 'Direct, Control, Help'],
      correct: 0,
      topic: 'Earthquake Preparedness'
    },
    {
      id: 2,
      question: 'Which of the following locations inside a classroom is UNSAFE during heavy seismic shaking?',
      options: ['Under a heavy wooden desk', 'Beside an interior load-bearing wall', 'Directly under a large glass window pane', 'Covered under a study table'],
      correct: 2,
      topic: 'Structural Safety'
    },
    {
      id: 3,
      question: 'Why must elevators NEVER be used during an earthquake evacuation?',
      options: ['Elevators use too much electrical voltage', 'Elevators can lose power or get jammed between floors', 'Elevators move too slowly', 'Elevators are reserved for fire wardens only'],
      correct: 1,
      topic: 'Evacuation Drill'
    },
    {
      id: 4,
      question: 'After tremors stop, what is the safest open-air assembly point on school campus?',
      options: ['Under the tall concrete school boundary wall', 'Directly under the covered entrance porch', 'In the middle of the open sports playground', 'Beside the main electrical transformer booth'],
      correct: 2,
      topic: 'Earthquake Preparedness'
    },
    {
      id: 5,
      question: 'What should you do if an aftershock occurs while you are evacuating down the stairwell?',
      options: ['Run down the stairs faster', 'Immediately stop, crouch low, protect head/neck against inner wall', 'Turn back and run up to the classroom', 'Jump down the last flight of stairs'],
      correct: 1,
      topic: 'Evacuation Drill'
    }
  ],
  'sim-2': [
    {
      id: 1,
      question: 'When navigating a smoke-filled corridor, why is it vital to crawl low to the floor?',
      options: ['Clean oxygen remains near floor level below rising toxic smoke', 'It allows you to move faster', 'Smoke only affects adults standing up', 'The floor is cooler to touch'],
      correct: 0,
      topic: 'Smoke Safety'
    },
    {
      id: 2,
      question: 'In the P.A.S.S. fire extinguisher method, what does the letter "A" stand for?',
      options: ['Activate alarm', 'Aim nozzle at the base of the fire', 'Apply water stream', 'Avoid breathing smoke'],
      correct: 1,
      topic: 'Fire Evacuation'
    },
    {
      id: 3,
      question: 'If a closed door handle feels hot to the touch during a fire evacuation, you should:',
      options: ['Kick the door open immediately', 'Do NOT open the door, seek an alternate escape route', 'Open the door slightly to look inside', 'Use a wet cloth to turn the handle anyway'],
      correct: 1,
      topic: 'Fire Evacuation'
    },
    {
      id: 4,
      question: 'Which emergency number is universally dialed for Fire Services in India?',
      options: ['100', '101', '102', '108'],
      correct: 1,
      topic: 'Emergency Contacts'
    }
  ]
};

export const AssessmentQuiz = ({ simulation, assignmentId, onClose, onSubmitScore }) => {
  const questions = quizQuestionsData[simulation.id] || quizQuestionsData['sim-1'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes timer
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectAnswer = (qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setFinalScore(calculatedScore);
    setIsSubmitted(true);
    if (onSubmitScore) {
      onSubmitScore(assignmentId || 'asg-103', calculatedScore);
    }
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#0a0512] border border-purple-900/40 rounded-2xl shadow-2xl shadow-purple-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#07040a] border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-purple-900/50 text-purple-300 border border-purple-700/40 flex items-center justify-center font-bold text-sm shadow-md">
              Quiz
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Assessment: {simulation.title}</h2>
              <span className="text-xs text-purple-400">Total Questions: {questions.length} | Points: 20 each</span>
            </div>
          </div>

          {!isSubmitted && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${
              timeLeft < 60 ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse' : 'bg-[#120b20] border-purple-500/30 text-purple-200'
            }`}>
              <Icon name="clock" size={16} />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!isSubmitted ? (
            <>
              {/* Question Navigator Pills */}
              <div className="flex items-center gap-2 pb-3 border-b border-purple-900/30 overflow-x-auto">
                <span className="text-xs font-semibold text-purple-400 mr-2 shrink-0">Questions:</span>
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = currentIdx === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        isCurrent
                          ? 'purple-glow-btn text-white ring-2 ring-purple-400/50'
                          : isAnswered
                          ? 'bg-purple-950/80 border border-purple-500 text-purple-200'
                          : 'bg-[#120b20] border border-purple-900/40 text-purple-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Box */}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-2">
                  <span>Topic: {currentQ.topic}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug mb-4">
                  Q{currentIdx + 1}. {currentQ.question}
                </h3>

                {/* Multiple choice options */}
                <div className="space-y-3">
                  {currentQ.options.map((optText, optIdx) => {
                    const isSelected = answers[currentQ.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-purple-900/40 border-purple-400 text-white ring-1 ring-purple-400 shadow-md shadow-purple-950/40'
                            : 'bg-[#120b20] border-purple-900/40 text-purple-200 hover:bg-purple-950/60 hover:text-white hover:border-purple-600/50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'purple-glow-btn text-white' : 'bg-purple-950 border border-purple-700/50 text-purple-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-sm font-medium">{optText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Quiz Score Summary Screen */
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border shadow-xl ${
                finalScore >= 75
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400 shadow-emerald-950/50'
                  : finalScore >= 50
                  ? 'bg-amber-950/60 border-amber-500/60 text-amber-400 shadow-amber-950/50'
                  : 'bg-rose-950/60 border-rose-500/60 text-rose-400 shadow-rose-950/50'
              }`}>
                <span className="text-3xl font-black">{finalScore}%</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Assessment Complete</h3>
                <p className="text-sm text-purple-300 mt-1">
                  Your assessment score has been recorded and updated into your <strong className="text-purple-400">Preparedness Score</strong>!
                </p>
              </div>

              {/* Topic Performance Breakdown */}
              <div className="p-4 bg-[#07040a] border border-purple-900/40 rounded-xl text-left max-w-md mx-auto space-y-3">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Topic Performance Breakdown</h4>
                {questions.map((q, idx) => {
                  const isRight = answers[q.id] === q.correct;
                  return (
                    <div key={q.id} className="flex items-center justify-between text-xs py-1 border-b border-purple-900/30 last:border-none">
                      <span className="text-purple-200 truncate max-w-[240px]">Q{idx + 1}: {q.topic}</span>
                      <span className={`font-bold ${isRight ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isRight ? '+20 Pts (Correct)' : '0 Pts (Incorrect)'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={onClose}
                className="purple-glow-btn px-6 py-3 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        {!isSubmitted && (
          <div className="px-6 py-4 bg-[#07040a] border-t border-purple-900/40 flex items-center justify-between">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 text-xs font-semibold text-purple-400 hover:text-white disabled:opacity-40"
            >
              Previous Question
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="purple-glow-btn px-5 py-2 text-white text-xs font-bold rounded-lg transition-all"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg shadow-lg transition-all flex items-center gap-1.5"
              >
                <Icon name="check-circle" size={16} />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
