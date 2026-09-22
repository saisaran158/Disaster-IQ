import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/landing/LandingPage';
import { SignInPage, SignUpPage } from './pages/auth/AuthPages';
import { StudentPortal } from './pages/student/StudentPortal';
import { TeacherPortal } from './pages/teacher/TeacherPortal';
import { ParentPortal } from './pages/parent/ParentPortal';
import { SchoolAdminPortal } from './pages/admin/SchoolAdminPortal';
import { DistrictCollectorPortal } from './pages/district/DistrictCollectorPortal';

const AppContent = () => {
  const { role, logout } = useApp();
  const [authView, setAuthView] = useState(null);
  const [showPortal, setShowPortalState] = useState(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    const savedShow = localStorage.getItem('showPortal');
    if (savedShow === 'false') return false;
    return !!(token && savedRole && savedRole !== 'PUBLIC');
  });

  const setShowPortal = (val) => {
    setShowPortalState(val);
    localStorage.setItem('showPortal', val ? 'true' : 'false');
  };

  const renderContent = () => {
    if (authView === 'signin') {
      return (
        <SignInPage
          onSwitchToSignUp={() => setAuthView('signup')}
          onSignInSuccess={() => {
            setAuthView(null);
            setShowPortal(true);
          }}
        />
      );
    }

    if (authView === 'signup') {
      return (
        <SignUpPage
          onSwitchToSignIn={() => setAuthView('signin')}
          onSignUpSuccess={() => setAuthView(null)}
        />
      );
    }

    if (showPortal && role !== 'PUBLIC') {
      switch (role) {
        case 'STUDENT':   return <StudentPortal onBackToHome={() => setShowPortal(false)} />;
        case 'TEACHER':   return <TeacherPortal onBackToHome={() => setShowPortal(false)} />;
        case 'PARENT':    return <ParentPortal onBackToHome={() => setShowPortal(false)} />;
        case 'ADMIN':     return <SchoolAdminPortal onBackToHome={() => setShowPortal(false)} />;
        case 'DISTRICT':  return <DistrictCollectorPortal onBackToHome={() => setShowPortal(false)} />;
        default:          return <StudentPortal onBackToHome={() => setShowPortal(false)} />;
      }
    }

    return (
      <LandingPage
        onGoToSignIn={() => setAuthView('signin')}
        onGoToSignUp={() => setAuthView('signup')}
        onGoToDashboard={() => setShowPortal(true)}
      />
    );
  };

  const { toast } = useApp() || {};

  return (
    <>
      {renderContent()}

      {toast && (
        <div className="fixed top-6 right-6 z-[9999] max-w-sm w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-4 flex items-start gap-3 select-none animate-slideIn">
          <div className={`p-2 rounded-xl shrink-0 text-sm flex items-center justify-center ${
            toast.type === 'error'
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
              : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
          }`}>
            {toast.type === 'error' ? '⚠️' : '✅'}
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              {toast.type === 'error' ? 'System Notification' : 'Success Notification'}
            </h4>
            <p className="text-xs font-extrabold text-black dark:text-white leading-relaxed">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 text-3xl shadow-xl">
            ⚠️
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-extrabold text-white">Application Render Error</h2>
            <p className="text-xs text-gray-400 leading-relaxed font-mono bg-gray-900 p-3 rounded-xl border border-gray-800 text-left overflow-x-auto">
              {this.state.error?.toString() || 'An unexpected rendering error occurred.'}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            🔄 Reset Session & Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
