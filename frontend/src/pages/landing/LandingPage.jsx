import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../../components/Icons';

const ROLE_LABELS = {
  STUDENT:  { label: 'Student',           emoji: '🧑‍🎓', color: '#8b5cf6' },
  TEACHER:  { label: 'Teacher',           emoji: '👩‍🏫', color: '#7c3aed' },
  PARENT:   { label: 'Parent',            emoji: '👨‍👩‍👧', color: '#c084fc' },
  ADMIN:    { label: 'School Admin',      emoji: '🏛️',  color: '#d946ef' },
  DISTRICT: { label: 'District Collector',emoji: '🏢',  color: '#6366f1' },
};

export const LandingPage = ({ onGoToSignIn, onGoToSignUp, onGoToDashboard }) => {
  const { role, logout, userProfile } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = role && role !== 'PUBLIC';
  const roleInfo = ROLE_LABELS[role] || null;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  const handleDashboard = () => {
    setDropdownOpen(false);
    onGoToDashboard();
  };

  return (
    <div className="bg-[#07040a] min-h-screen text-slate-100 font-sans pb-20 space-y-20 selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-purple-900/40 bg-[#07040a]/80 backdrop-blur-xl sticky top-0 z-30 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Icon name="logo-shield" size={24} />
          </div>
          <span className="text-xl font-black text-white tracking-tight">
            Disaster<span className="text-purple-400 purple-glow-text">IQ</span>
          </span>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-extrabold text-purple-200/80">
          <a href="#home" className="hover:text-purple-400 transition-colors">Home</a>
          <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How it Works</a>
        </nav>

        {/* Auth Area */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onGoToSignIn}
                className="text-sm font-bold text-purple-200 hover:text-white px-4 py-2 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={onGoToSignUp}
                className="text-sm font-extrabold text-white purple-glow-btn px-6 py-2.5 rounded-full shadow-lg cursor-pointer"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#130b24] border border-purple-800/60 shadow-md hover:border-purple-500/80 transition-all cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold text-white shadow-sm"
                  style={{ background: roleInfo?.color || '#7c3aed' }}
                >
                  {userProfile?.avatar || roleInfo?.emoji || '👤'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-extrabold text-white leading-tight">
                    {userProfile?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-purple-300/70 font-medium leading-tight">
                    {roleInfo?.label || role}
                  </p>
                </div>
                <Icon name="chevron-down" size={14} className="text-purple-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#120b20] border border-purple-800/80 rounded-2xl shadow-[0_15px_40px_rgba(7,4,10,0.95)] py-2 z-50 animate-fadeIn backdrop-blur-2xl">
                  <div className="px-4 py-2.5 border-b border-purple-900/50">
                    <p className="text-xs font-extrabold text-white truncate">{userProfile?.name || 'User'}</p>
                    <p className="text-[10px] text-purple-300/60 font-medium truncate font-mono">{userProfile?.email || ''}</p>
                    <span
                      className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                      style={{ background: roleInfo?.color || '#7c3aed' }}
                    >
                      {roleInfo?.label || role}
                    </span>
                  </div>
                  <button
                    onClick={handleDashboard}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-purple-200 hover:bg-purple-950/60 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>🏠</span> Go to Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="max-w-6xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-sm animate-pulse-slow">
            ⚡ Prepare Today, Safe Tomorrow
          </span>

          <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.12] tracking-tight">
            AI-Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-500 purple-glow-text">Disaster Preparedness</span> <br />
            Learning Platform
          </h1>

          <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed font-medium max-w-xl">
            Prepare students for earthquakes, floods, fires and emergencies through interactive simulations, AI-powered adaptive learning and real-time preparedness analytics.
          </p>

          <div className="pt-2 flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={onGoToDashboard}
                className="px-7 py-4 purple-glow-btn text-white font-black rounded-full shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <Icon name="arrow-right" size={16} />
              </button>
            ) : (
              <button
                onClick={onGoToSignIn}
                className="px-7 py-4 purple-glow-btn text-white font-black rounded-full shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>Get started now</span>
                <Icon name="arrow-right" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Floating Badges Visual Element */}
        <div className="lg:col-span-5 relative min-h-[340px] flex flex-wrap items-center justify-center gap-3.5 p-8 purple-glass rounded-3xl animate-float">
          <div className="px-4 py-2.5 bg-[#1e1038] border border-purple-500/40 text-purple-200 text-xs font-bold rounded-full shadow-lg flex items-center gap-2">
            <span className="text-base">⚡</span><span>Earthquake Drill</span>
          </div>
          <div className="px-4 py-2.5 bg-[#2a1240] border border-fuchsia-500/40 text-fuchsia-200 text-xs font-bold rounded-full shadow-lg flex items-center gap-2">
            <span className="text-base">🔔</span><span>Emergency Alert</span>
          </div>
          <div className="px-4 py-2.5 bg-[#280d38] border border-rose-500/40 text-rose-200 text-xs font-bold rounded-full shadow-lg flex items-center gap-2">
            <span className="text-base">🔥</span><span>Fire Evacuation</span>
          </div>
          <div className="px-5 py-3 bg-[#130b24] border border-purple-400 text-purple-300 text-xs font-black rounded-full shadow-xl flex items-center gap-2 animate-glow">
            <span className="text-base">🤖</span><span>DisasterIQ AI Engine</span>
          </div>
          <div className="px-4 py-2.5 bg-[#111638] border border-indigo-500/40 text-indigo-200 text-xs font-bold rounded-full shadow-lg flex items-center gap-2">
            <span className="text-base">🌊</span><span>Flood Response</span>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-3">
          <span className="px-4 py-1.5 bg-purple-950/80 border border-purple-500/40 rounded-full text-xs font-black uppercase tracking-wider text-purple-300 shadow-sm inline-block">
            Platform Features
          </span>
          <p className="text-xs text-purple-300/70 font-medium">
            From individual student drills to district-wide analytics — DisasterIQ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Interactive Simulations', desc: 'Immersive scenario-based drills covering earthquakes, floods, fires, and more. Students learn by doing, building real muscle memory for emergencies.', icon: 'book' },
            { title: 'AI Adaptive Learning', desc: "Our AI engine personalizes each student's learning path based on performance, gaps, and risk profiles — ensuring no child is left unprepared.", icon: 'computer' },
            { title: 'Teacher Dashboard', desc: 'A unified command center for educators. Assign simulations, track class progress, identify at-risk students, and generate compliance reports in one click.', icon: 'clipboard' },
            { title: 'Parent Reports', desc: "Automated weekly reports keep parents informed about their child's preparedness level, completed drills, and personalized improvement tips.", icon: 'printer' },
            { title: 'School Analytics', desc: 'Deep-dive into school-wide preparedness trends, drill completion rates, and AI-generated recommendations for targeted safety improvements.', icon: 'file-text' },
            { title: 'District Dashboard', desc: "District administrators get a bird's-eye view across all schools, enabling data-driven policy decisions and equitable resource allocation.", icon: 'globe' }
          ].map((f, i) => (
            <div key={i} className="purple-glass purple-glass-hover rounded-3xl p-6 border border-purple-800/40 space-y-3 relative">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-base text-white pr-4">{f.title}</h3>
                <span className="p-2.5 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-700/50 shadow-sm"><Icon name={f.icon} size={20} /></span>
              </div>
              <p className="text-xs text-purple-200/70 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-3">
          <span className="px-4 py-1.5 bg-purple-950/80 border border-purple-500/40 rounded-full text-xs font-black uppercase tracking-wider text-purple-300 shadow-sm inline-block">
            How it works
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Register Your School', desc: 'Sign up in minutes. Add your school, invite teachers, and configure your district settings with our guided onboarding wizard.', icon: 'file-text' },
            { num: '02', title: 'Assign Simulations', desc: 'Teachers browse our library of simulations and assign age-appropriate disaster scenarios to classes or individual students.', icon: 'book' },
            { num: '03', title: 'Students Practice', desc: 'Students complete interactive drills at their own pace. Gamified scenarios keep engagement high and build genuine preparedness skills.', icon: 'book' },
            { num: '04', title: 'Assess & Score', desc: 'Automated assessments measure knowledge retention and practical skill. Results are instantly available in teacher dashboards.', icon: 'clipboard' },
            { num: '05', title: 'AI Recommendations', desc: 'Our AI analyzes each student s performance gaps and generates a personalized learning plan to close weaknesses efficiently.', icon: 'computer' },
            { num: '06', title: 'Track on Dashboard', desc: 'Monitor school-wide preparedness in real time. Generate compliance reports for district officials and parent communications.', icon: 'clipboard' }
          ].map((step, i) => (
            <div key={i} className="purple-glass purple-glass-hover rounded-3xl p-6 border border-purple-800/40 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-700/50"><Icon name={step.icon} size={20} /></span>
                <span className="text-2xl font-black text-purple-400/50 font-mono">{step.num}</span>
              </div>
              <h3 className="font-black text-base text-white">{step.title}</h3>
              <p className="text-xs text-purple-200/70 leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

