import api from '../../services/api';
import React, { useState } from 'react';
import { Icon } from '../../components/Icons';
import { useApp } from '../../context/AppContext';

export const ForgotPasswordModal = ({ onClose, onPasswordResetComplete }) => {
  const [step, setStep] = useState(1); // 1: Email -> 2: OTP & New Password -> 3: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password/otp', { email });
      if (res.data && res.data.otp) {
        setGeneratedOtp(res.data.otp);
      }
      setStep(2);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to send verification code. Please verify the email is registered and is a Parent or Teacher account.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) {
      setErrorMsg('Please enter the OTP verification code');
      return;
    }
    // Verify local matching first to ensure UX speed
    if (generatedOtp && otp.trim() !== generatedOtp.trim()) {
      setErrorMsg('Invalid verification code.');
      return;
    }
    setErrorMsg('');
    setStep(3); // Move to Step 3: Change Password
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password/reset', {
        email,
        otp,
        newPassword
      });
      setStep(4); // Move to Step 4: Success
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update password. Please check the verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#120b20] text-white rounded-3xl p-8 border border-purple-800/80 shadow-[0_25px_60px_rgba(7,4,10,0.95)] space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-purple-400 hover:text-white p-1.5 rounded-full hover:bg-purple-950/60 transition-colors"
        >
          <Icon name="x" size={20} />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Icon name="logo-shield" size={20} />
          </div>
          <span className="text-xl font-black text-white tracking-tight">
            Disaster<span className="text-purple-400 purple-glow-text">IQ</span>
          </span>
        </div>

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white">Reset your password</h2>
              <p className="text-xs text-purple-300/70 font-medium mt-1">
                Enter your registered DisasterIQ email address below and we'll send a 4-digit security code.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-purple-200">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full purple-glow-btn text-white font-extrabold py-3.5 rounded-2xl transition-all text-xs tracking-wide shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send Reset Code >'}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white">OTP Verification</h2>
              <p className="text-xs text-purple-300/70 font-medium mt-1">
                We sent a security code to <strong className="text-purple-200">{email}</strong>.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-purple-200">Enter 4-Digit OTP Code</label>
              <input
                type="text"
                maxLength="4"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full bg-[#1a102e] border border-purple-800/60 text-purple-200 font-mono font-bold text-center tracking-widest rounded-2xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full purple-glow-btn text-white font-extrabold py-3.5 rounded-2xl transition-all text-xs tracking-wide shadow-md cursor-pointer"
            >
              Verify OTP &gt;
            </button>
          </form>
        )}

        {/* STEP 3: Change Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white">Create New Password</h2>
              <p className="text-xs text-purple-300/70 font-medium mt-1">
                OTP verified successfully! Please enter your new password below.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-purple-200">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 pr-12 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white focus:outline-none"
                >
                  {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-purple-200">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 pr-12 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full purple-glow-btn text-white font-extrabold py-3.5 rounded-2xl transition-all text-xs tracking-wide shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Updating...' : 'Update Password >'}
            </button>
          </form>
        )}

        {/* STEP 4: Success Confirmation */}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-purple-900/60 text-purple-300 border border-purple-500/50 rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-lg shadow-purple-900/40">
              ✓
            </div>

            <div>
              <h2 className="text-xl font-black text-white">Password Reset Successful! 🎉</h2>
              <p className="text-xs text-purple-300/70 font-medium mt-1">
                Your password has been updated. You can now sign in with your new password.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onPasswordResetComplete) onPasswordResetComplete();
              }}
              className="w-full purple-glow-btn text-white font-extrabold py-3.5 rounded-2xl transition-all text-xs tracking-wide shadow-md cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const SignInPage = ({ onSwitchToSignUp, onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { setRole } = useApp();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Enter email');
      return;
    }
    if (!password) {
      setErrorMsg('Enter password');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');

    try {
      const response = await api.post('/api/auth/login', { email: cleanEmail, password: cleanPassword });
      const { token, role, userId, fullName, studentId, teacherId, parentId } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('email', cleanEmail);
      if (studentId) localStorage.setItem('studentId', studentId);
      if (teacherId) localStorage.setItem('teacherId', teacherId);
      if (parentId) localStorage.setItem('parentId', parentId);
      setRole(role);
      
      if (onSignInSuccess) onSignInSuccess();
    } catch (error) {
      const rawMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      setErrorMsg(typeof rawMsg === 'string' ? rawMsg : 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#07040a]">
      <div className="w-full max-w-lg bg-[#120b20]/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-purple-800/60 shadow-[0_20px_50px_rgba(7,4,10,0.95)] space-y-6 animate-fadeIn">
        {/* DisasterIQ Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Icon name="logo-shield" size={24} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            Disaster<span className="text-purple-400 purple-glow-text">IQ</span>
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome back</h1>
          <p className="text-sm text-purple-300/70 mt-1 font-medium">Sign in to your DisasterIQ account</p>
        </div>

        {/* Form */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-bold rounded-xl">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-purple-200">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-purple-200">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="xxxxxxxxx"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-5 pr-12 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="text-right pt-1">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full purple-glow-btn text-white font-black py-4 rounded-2xl transition-all text-sm tracking-wide shadow-md cursor-pointer"
          >
            Sign in &gt;
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 text-xs text-purple-300/70 font-medium">
          Don’t have an account?{' '}
          <button onClick={onSwitchToSignUp} className="font-black text-purple-300 hover:text-white hover:underline cursor-pointer">
            Create one
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotModal(false)}
          onPasswordResetComplete={() => setShowForgotModal(false)}
        />
      )}
    </div>
  );
};

export const SignUpPage = ({ onSwitchToSignIn, onSignUpSuccess }) => {
  const { showToast } = useApp() || {};
  const [step, setStep] = useState(1); // 1: Choose Role, 2: Enter Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('TEACHER');
  const [age, setAge] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolDistrict, setSchoolDistrict] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !phone || !password || !confirmPassword || !age || !schoolName) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (role === 'PARENT' && (!studentName || !studentRoll)) {
      setErrorMsg("Please fill in child's name and roll number.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post('/api/auth/register', {
        fullName,
        email,
        password,
        phone,
        role,
        schoolName,
        schoolDistrict: role === 'TEACHER' ? schoolDistrict : null,
        studentName: role === 'PARENT' ? studentName : null,
        studentRoll: role === 'PARENT' ? studentRoll : null
      });

      if (role === 'TEACHER') {
        showToast("Registration Submitted Successfully! Your teacher account is pending administrator approval before you can log in.", 'success');
      } else if (role === 'PARENT') {
        showToast("Registration Submitted Successfully! Your parent account is pending teacher approval before you can log in.", 'success');
      } else {
        showToast(response.data.message || 'Registration Successful!', 'success');
      }

      try {
        const ageStore = JSON.parse(localStorage.getItem('userAgeStore') || '{}');
        ageStore[email.toLowerCase()] = age;
        localStorage.setItem('userAgeStore', JSON.stringify(ageStore));
      } catch (e) {}

      if (onSignUpSuccess) onSignUpSuccess();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#07040a]">
      <div className="w-full max-w-xl bg-[#120b20]/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-purple-800/60 shadow-[0_20px_50px_rgba(7,4,10,0.95)] space-y-6 animate-fadeIn">
        {/* Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Icon name="logo-shield" size={24} />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Disaster<span className="text-purple-400 purple-glow-text">IQ</span>
            </span>
          </div>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="text-xs font-extrabold text-purple-300 hover:text-white flex items-center gap-1 bg-purple-950/80 px-3.5 py-1.5 rounded-full border border-purple-800/60 cursor-pointer"
            >
              ← Back
            </button>
          )}
        </div>

        {step === 1 ? (
          <div className="space-y-6 text-center">
            <div>
              <h1 className="text-2xl font-black text-white">Create your account</h1>
              <p className="text-xs text-purple-300/70 font-bold mt-1">Please select your role first to continue registration:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <button
                type="button"
                onClick={() => handleSelectRole('TEACHER')}
                className="p-6 border border-purple-800/60 hover:border-purple-500 rounded-3xl bg-[#180f2b]/80 hover:bg-[#201438] text-left transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between h-48 shadow-lg shadow-purple-950/40 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-purple-950 text-purple-300 rounded-2xl border border-purple-700/50 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">👩‍🏫</div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">Educator / Teacher</h3>
                  <p className="text-[11px] text-purple-300/70 font-medium mt-1">Monitor classes, assign safety drills, and review student score analytics.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('PARENT')}
                className="p-6 border border-purple-800/60 hover:border-purple-500 rounded-3xl bg-[#180f2b]/80 hover:bg-[#201438] text-left transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between h-48 shadow-lg shadow-purple-950/40 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-fuchsia-950 text-fuchsia-300 rounded-2xl border border-fuchsia-700/50 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">👨‍👩‍👧</div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-fuchsia-300 transition-colors">Parent / Guardian</h3>
                  <p className="text-[11px] text-purple-300/70 font-medium mt-1">Link your children's profiles and trace their real-time drill completion reports.</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-black text-white">
                {role === 'TEACHER' ? 'Teacher Registration' : 'Parent Registration'}
              </h1>
              <p className="text-xs text-purple-300/70 font-bold mt-1">Enter your account and school details below:</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-purple-200">Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-purple-200">Email Address:</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-purple-200">Phone Number:</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-purple-200">Age:</label>
                  <input
                    type="number"
                    required
                    placeholder="Enter your age"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-purple-200">Password:</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="xxxxxxxxx"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-purple-200">Confirm Password:</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="xxxxxxxxx"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {role === 'TEACHER' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 border-purple-900/50">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-purple-200">School Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Greenfield High School"
                      value={schoolName}
                      onChange={e => setSchoolName(e.target.value)}
                      className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-2.5 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-purple-200">School District:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. District A"
                      value={schoolDistrict}
                      onChange={e => setSchoolDistrict(e.target.value)}
                      className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-2.5 text-xs font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 border-t pt-4 border-purple-900/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-purple-200">Child's Student Name:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Pradeep"
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-2.5 text-xs font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-purple-200">Child's Roll Number:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 10A21 or ROLL-22"
                        value={studentRoll}
                        onChange={e => setStudentRoll(e.target.value)}
                        className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-2.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-purple-200">School Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Greenfield High School"
                      value={schoolName}
                      onChange={e => setSchoolName(e.target.value)}
                      className="w-full bg-[#1a102e] border border-purple-800/60 text-white placeholder-purple-300/40 rounded-2xl px-4 py-2.5 text-xs font-medium"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full purple-glow-btn text-white font-black py-4 rounded-2xl transition-all text-xs tracking-wide shadow-md mt-4 cursor-pointer"
              >
                Submit Registration Request &gt;
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-2 text-xs text-purple-300/70 font-medium">
          Already have an account?{' '}
          <button onClick={onSwitchToSignIn} className="font-black text-purple-300 hover:text-white hover:underline cursor-pointer">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

