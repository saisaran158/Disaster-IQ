import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from './Icons';
import { useApp } from '../context/AppContext';

export const EditProfileModal = ({ onClose }) => {
  const { role, userProfile, updateUserProfile } = useApp();
  const profile = userProfile || {};

  const [name, setName] = useState(profile.name || '');
  const [className, setClassName] = useState(profile.className || '');
  const [age, setAge] = useState(profile.age || '');
  const [email, setEmail] = useState(profile.email || '');
  const [school, setSchool] = useState(profile.school || '');
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      name,
      className,
      age,
      email,
      school,
      emergencyContact
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0d0718] border-2 border-purple-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-white max-h-[90vh] flex flex-col my-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-6 top-6 w-9 h-9 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 hover:text-white hover:bg-purple-800 flex items-center justify-center transition-all cursor-pointer z-10"
        >
          <Icon name="x" size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pr-8 shrink-0 border-b border-purple-900/60 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 shadow-lg shadow-purple-950/50">
            <Icon name="logo-shield" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">Edit Profile Details</h2>
            <p className="text-xs text-purple-300 font-medium">Update your account information below</p>
          </div>
        </div>

        {/* Content Body */}
        {role === 'STUDENT' ? (
          <div className="py-8 text-center space-y-4 my-auto animate-fadeIn">
            <div className="w-16 h-16 bg-amber-950/80 border-2 border-amber-500/60 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-xl shadow-amber-950/50">
              🔒
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-white">Student Profile is Read-Only</h3>
              <p className="text-xs text-purple-200/80 max-w-sm mx-auto leading-relaxed font-medium">
                Student profile details (Name, Class, Email, School) are created and managed directly by your <strong>Teacher & School Administration</strong>. Students cannot edit these details directly.
              </p>
            </div>
            <div className="pt-4 border-t border-purple-900/60 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 purple-glow-btn text-white font-black rounded-2xl text-xs shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        ) : isSaved ? (
          <div className="py-12 text-center space-y-3 animate-fadeIn my-auto">
            <div className="w-16 h-16 bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-black shadow-xl shadow-emerald-950/60">
              ✓
            </div>
            <h3 className="text-lg font-extrabold text-white">Profile Saved Successfully!</h3>
            <p className="text-xs text-purple-300/80">Updating your account details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs font-bold custom-scrollbar">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-purple-200 font-extrabold text-xs">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-[#160d29] border border-purple-500/40 text-white rounded-2xl px-4 py-3 text-xs font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
                required
              />
            </div>

            {/* Class / Role & Age (grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {role !== 'ADMIN' && role !== 'DISTRICT' && (
                <div className="space-y-1.5">
                  <label className="block text-purple-200 font-extrabold text-xs">
                    {role === 'STUDENT' ? 'Class & Section' : role === 'TEACHER' ? 'Qualification / Role' : 'Role'}
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    placeholder="e.g. Grade 10A"
                    className="w-full bg-[#160d29] border border-purple-500/40 text-white rounded-2xl px-4 py-3 text-xs font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
                    required
                  />
                </div>
              )}

              {role !== 'ADMIN' && role !== 'DISTRICT' && (
                <div className="space-y-1.5">
                  <label className="block text-purple-200 font-extrabold text-xs">Age</label>
                  <input
                    type="text"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full bg-[#160d29] border border-purple-500/40 text-white rounded-2xl px-4 py-3 text-xs font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
                    required
                  />
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-purple-200 font-extrabold text-xs">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@disasteriq.edu"
                className="w-full bg-[#160d29] border border-purple-500/40 text-white rounded-2xl px-4 py-3 text-xs font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
                required
              />
            </div>

            {/* School / Institution */}
            {role !== 'ADMIN' && role !== 'DISTRICT' && (
              <div className="space-y-1.5">
                <label className="block text-purple-200 font-extrabold text-xs">School / Institution</label>
                <input
                  type="text"
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  placeholder="Enter school name"
                  className="w-full bg-[#160d29] border border-purple-500/40 text-white rounded-2xl px-4 py-3 text-xs font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
                />
              </div>
            )}

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-purple-200 font-extrabold text-xs">Phone Number</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={e => setEmergencyContact(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-[#160d29] border border-purple-500/40 text-white rounded-2xl px-4 py-3 text-xs font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-4 border-t border-purple-900/60 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-3.5 bg-[#180f2b] hover:bg-[#251745] border border-purple-700/50 text-purple-200 font-extrabold rounded-2xl text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-3.5 purple-glow-btn text-white font-black rounded-2xl text-xs shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

