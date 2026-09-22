import React, { useState } from 'react';
import { Icon } from './Icons';

const scenarioData = {
  'sim-1': {
    title: 'Earthquake Safety & Drop-Cover-Hold',
    steps: [
      {
        id: 1,
        situation: 'You are sitting at your desk on the 2nd floor of your school building when sudden violent shaking begins!',
        question: 'What is your immediate first action?',
        options: [
          { text: 'Drop to your hands and knees, take cover under desk, and hold on tight.', score: 30, correct: true, feedback: 'EXCELLENT! Drop, Cover, and Hold On protects you from falling debris and ceiling tiles.' },
          { text: 'Run as fast as possible towards the emergency stairwell.', score: 0, correct: false, feedback: 'DANGER! Running during shaking causes falls and risks being struck by falling lights or glass.' },
          { text: 'Stand near the large glass windows to call for help.', score: 0, correct: false, feedback: 'HAZARD! Windows shatter under seismic stress, causing severe injury.' }
        ]
      },
      {
        id: 2,
        situation: 'The shaking subsides after 45 seconds. The teacher instructs the class to prepare for orderly evacuation.',
        question: 'How should you proceed out of the classroom?',
        options: [
          { text: 'Use the main elevator to get down quickly.', score: 0, correct: false, feedback: 'CRITICAL HAZARD! Elevators can lose power or get trapped between floors during aftershocks.' },
          { text: 'Protect your head with a book/bag and follow designated stairs in single file.', score: 35, correct: true, feedback: 'CORRECT! Covering head/neck and using stairs prevents panic stampedes.' },
          { text: 'Go back to grab your heavy winter jacket from your locker.', score: 0, correct: false, feedback: 'DELAY HAZARD! Never delay evacuation for personal belongings.' }
        ]
      },
      {
        id: 3,
        situation: 'You reach the ground floor and step outside into the school courtyard.',
        question: 'Where is the safest assembly location?',
        options: [
          { text: 'Underneath the tall concrete boundary wall near the street light pole.', score: 0, correct: false, feedback: 'RISK! Walls and utility poles can collapse during strong aftershocks.' },
          { text: 'In the open sports field, far away from buildings, trees, and power lines.', score: 35, correct: true, feedback: 'PERFECT! Open ground is the safest location during seismic aftershocks.' },
          { text: 'Directly under the covered entrance canopy of the main school building.', score: 0, correct: false, feedback: 'RISK! Overhanging canopies are prone to structural collapse.' }
        ]
      }
    ]
  },
  'sim-2': {
    title: 'School Fire Evacuation & P.A.S.S.',
    steps: [
      {
        id: 1,
        situation: 'A fire alarm blares in the science lab corridor, and thick black smoke starts filling the upper hallway!',
        question: 'How should you move through smoke-filled corridors?',
        options: [
          { text: 'Crawl low under the smoke on your hands and knees where air is cleaner.', score: 35, correct: true, feedback: 'GREAT DECISION! Clean air and oxygen remain lower near the floor below toxic smoke.' },
          { text: 'Run upright while holding your shirt over your nose.', score: 10, correct: false, feedback: 'HIGH RISK! Inhaling superheated toxic smoke standing up can cause rapid asphyxiation.' }
        ]
      },
      {
        id: 2,
        situation: 'You locate a Type ABC Fire Extinguisher near a small trash bin fire.',
        question: 'What is the correct P.A.S.S. sequence to operate the fire extinguisher?',
        options: [
          { text: 'Pull pin $\\rightarrow$ Aim at base $\\rightarrow$ Squeeze trigger $\\rightarrow$ Sweep side to side.', score: 35, correct: true, feedback: 'SPOT ON! P-A-S-S (Pull, Aim, Squeeze, Sweep) is the universal fire extinguisher technique.' },
          { text: 'Point at flames $\\rightarrow$ Squeeze handle $\\rightarrow$ Spray in circle $\\rightarrow$ Pull pin.', score: 0, correct: false, feedback: 'INCORRECT! Aiming at flames instead of the base will not extinguish the fuel source.' }
        ]
      },
      {
        id: 3,
        situation: 'You reach the emergency exit door, but the metal door handle feels hot to the touch.',
        question: 'What should you do?',
        options: [
          { text: 'Do NOT open the door! Fire is directly behind it. Seek alternate route or seal door.', score: 30, correct: true, feedback: 'VITAL SAFETY CHECK! A hot door handle indicates intense fire on the opposite side.' },
          { text: 'Kick the door open quickly and burst through.', score: 0, correct: false, feedback: 'EXTREME DANGER! Opening a door behind which fire rages causes a violent flashover backdraft.' }
        ]
      }
    ]
  },
  'sim-3': {
    title: 'Flash Flood Early Warning & High Ground',
    steps: [
      {
        id: 1,
        situation: 'Torrential rains cause river levels to breach safety dams, and muddy floodwaters enter the school grounds.',
        question: 'What is the immediate priority?',
        options: [
          { text: 'Evacuate vertically to upper floors or roof immediately.', score: 35, correct: true, feedback: 'EXCELLENT! Moving to vertical high ground is crucial during sudden flash floods.' },
          { text: 'Try to wade through knee-deep moving water to reach your parked bicycle.', score: 0, correct: false, feedback: 'DANGER! Just 6 inches of fast-flowing water can knock an adult off their feet.' }
        ]
      },
      {
        id: 2,
        situation: 'Water is rising near electrical junction boxes on the ground floor.',
        question: 'What electrical precaution must be taken?',
        options: [
          { text: 'Do not touch switches; notify floor warden to isolate main breaker if safe.', score: 35, correct: true, feedback: 'CORRECT! Water conducts electricity and poses electrocution hazards.' },
          { text: 'Unplug all computers while standing in shallow water.', score: 0, correct: false, feedback: 'FATAL RISK! Touching electrical appliances in water risks severe electric shock.' }
        ]
      }
    ]
  },
  'sim-4': {
    title: 'Landslide Early Signals & Slope Escape',
    steps: [
      {
        id: 1,
        situation: 'During heavy hillside rains, you hear a deep rumbling sound and notice tilting trees on the slope above school.',
        question: 'What does this warning signal indicate?',
        options: [
          { text: 'Imminent slope failure/landslide! Sound the alarm and evacuate slope path.', score: 50, correct: true, feedback: 'PERFECT SIGNAL IDENTIFICATION! Rumbling and tilting vegetation precede rapid mudflows.' },
          { text: 'Normal mountain wind noise; ignore and stay in classroom.', score: 0, correct: false, feedback: 'HAZARD! Ignoring slope instability signs leads to zero warning time.' }
        ]
      },
      {
        id: 2,
        situation: 'Debris begins flowing down the main slope channel toward the road.',
        question: 'In which direction should you run to escape a landslide?',
        options: [
          { text: 'Run PERPENDICULAR (sideways) out of the path of the flow, toward high ground.', score: 50, correct: true, feedback: 'EXCELLENT NAVIGATION! Running sideways out of the flow path is the only safe escape.' },
          { text: 'Run directly downhill ahead of the flowing debris.', score: 0, correct: false, feedback: 'FATAL ERROR! Debris flows move faster than human sprinting speed downhill.' }
        ]
      }
    ]
  }
};

export const SimulationPlayer = ({ simulation, onClose, onStartQuiz }) => {
  const simData = scenarioData[simulation.id] || scenarioData['sim-1'];
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const step = simData.steps[currentStep];

  const handleSelectOption = (opt) => {
    setSelectedOption(opt);
  };

  const handleNextStep = () => {
    if (!selectedOption) return;
    
    const newScore = totalScore + selectedOption.score;
    setTotalScore(newScore);

    if (currentStep + 1 < simData.steps.length) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#0a0512] border border-purple-900/40 rounded-2xl shadow-2xl shadow-purple-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#07040a] border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{simulation.thumbnail}</span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{simulation.title}</h2>
              <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                Interactive Simulation Mode
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-purple-400 hover:text-white rounded-lg hover:bg-purple-900/40 transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!isCompleted ? (
            <>
              {/* Progress & Meter */}
              <div className="flex items-center justify-between text-xs text-purple-300 font-medium">
                <span>Scenario Step {currentStep + 1} of {simData.steps.length}</span>
                <span className="text-emerald-400 font-semibold">Safety Score: {totalScore} pts</span>
              </div>
              <div className="w-full bg-[#120b20] border border-purple-900/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-300 shadow-sm shadow-purple-400"
                  style={{ width: `${((currentStep + 1) / simData.steps.length) * 100}%` }}
                />
              </div>

              {/* Scenario Situation Card */}
              <div className="p-4 bg-[#07040a] border border-purple-900/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Icon name="alert-triangle" size={16} />
                  <span>EMERGENCY SCENARIO SITUATION</span>
                </div>
                <p className="text-purple-100 text-sm leading-relaxed font-medium">
                  {step.situation}
                </p>
              </div>

              {/* Decision Question */}
              <div>
                <h3 className="text-base font-bold text-white mb-3">
                  {step.question}
                </h3>

                <div className="space-y-3">
                  {step.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? opt.correct
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/40'
                              : 'bg-rose-950/60 border-rose-500 text-rose-100 ring-2 ring-rose-500/40'
                            : 'bg-[#120b20] border-purple-900/40 text-purple-200 hover:bg-purple-950/60 hover:border-purple-600/50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 shrink-0 ${
                          isSelected
                            ? opt.correct ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                            : 'bg-purple-950 border border-purple-700/50 text-purple-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm font-medium leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback box */}
              {selectedOption && (
                <div className={`p-4 rounded-xl text-sm font-medium border animate-fadeIn ${
                  selectedOption.correct
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-700 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <Icon name={selectedOption.correct ? "check-circle" : "alert-triangle"} size={18} />
                    <span>{selectedOption.correct ? "Correct Response!" : "Safety Hazard Warning!"}</span>
                  </div>
                  {selectedOption.feedback}
                </div>
              )}
            </>
          ) : (
            /* Simulation Complete Summary */
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-purple-900/50 text-purple-300 rounded-full flex items-center justify-center mx-auto border border-purple-500/50 shadow-xl shadow-purple-950/50">
                <Icon name="award" size={42} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Simulation Completed!</h3>
                <p className="text-sm text-purple-300 mt-1">
                  You successfully navigated all emergency scenarios for <strong className="text-purple-400">{simulation.title}</strong>.
                </p>
              </div>

              <div className="p-4 bg-[#07040a] border border-purple-900/40 rounded-xl inline-block px-8">
                <span className="text-xs uppercase tracking-wider text-purple-400 block font-semibold">Total Scenario Score</span>
                <span className="text-3xl font-black text-emerald-400">{totalScore} Points</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onStartQuiz(simulation, totalScore)}
                  className="purple-glow-btn px-6 py-3 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 mx-auto"
                >
                  <Icon name="file-text" size={18} />
                  <span>Proceed to Timed Assessment Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isCompleted && (
          <div className="px-6 py-4 bg-[#07040a] border-t border-purple-900/40 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-purple-400 hover:text-white font-medium"
            >
              Exit Simulation
            </button>
            <button
              onClick={handleNextStep}
              disabled={!selectedOption}
              className="purple-glow-btn px-5 py-2.5 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center gap-2 text-sm shadow-md"
            >
              <span>{currentStep + 1 === simData.steps.length ? 'Finish Scenario' : 'Next Step'}</span>
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
