import api from '../services/api';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const initialSimulations = [
  {
    id: 'sim-1',
    title: 'Earthquake Safety & Drop-Cover-Hold',
    category: 'Earthquake',
    categoryIcon: 'mountain',
    difficulty: 'Intermediate',
    duration: '10 mins',
    thumbnail: '🌋',
    description: 'Learn the immediate life-saving steps during a seismic tremor in a multi-story school building.',
    topics: ['Earthquake Preparedness', 'Structural Safety', 'Evacuation Drill']
  },
  {
    id: 'sim-2',
    title: 'School Fire Evacuation & P.A.S.S.',
    category: 'Fire Safety',
    categoryIcon: 'flame',
    difficulty: 'Beginner',
    duration: '8 mins',
    thumbnail: '🚨',
    description: 'Master smoke navigation, fire extinguisher operation (PASS), and emergency assembly protocol.',
    topics: ['Fire Evacuation', 'Emergency Contacts', 'Smoke Safety']
  },
  {
    id: 'sim-3',
    title: 'Flash Flood Early Warning & High Ground',
    category: 'Flood Response',
    categoryIcon: 'waves',
    difficulty: 'Advanced',
    duration: '12 mins',
    thumbnail: '🌊',
    description: 'Navigate rising water hazards, electrical isolation, and safe evacuation to designated vertical shelters.',
    topics: ['Flood Electrical Hazards', 'Emergency Rescue', 'High Ground Shelter']
  },
  {
    id: 'sim-4',
    title: 'Landslide Early Signals & Slope Escape',
    category: 'Landslide',
    categoryIcon: 'alert-triangle',
    difficulty: 'Intermediate',
    duration: '10 mins',
    thumbnail: '⛰️',
    description: 'Identify slope instability warning signs, rumble sounds, and rapid perpendicular escape routes.',
    topics: ['Landslide Signal Identification', 'Slope Hazard Escape', 'Community Alarm']
  }
];

export const initialAssignments = [
  {
    id: 'asg-101',
    simulationId: 'sim-1',
    title: 'Earthquake Safety & Drop-Cover-Hold',
    category: 'Earthquake',
    className: 'Class 8-A',
    teacherName: 'Anita Sharma',
    difficulty: 'Intermediate',
    assignedDate: '2026-09-10',
    dueDate: '2026-09-25',
    status: 'Completed',
    score: 85,
    instructions: 'Complete all interactive scenario choices and achieve at least 80% on the linked quiz.'
  },
  {
    id: 'asg-102',
    simulationId: 'sim-2',
    title: 'School Fire Evacuation & P.A.S.S.',
    category: 'Fire Safety',
    className: 'Class 8-A',
    teacherName: 'Anita Sharma',
    difficulty: 'Beginner',
    assignedDate: '2026-09-12',
    dueDate: '2026-09-28',
    status: 'Completed',
    score: 92,
    instructions: 'Focus on smoke crawling and extinguisher operation.'
  },
  {
    id: 'asg-103',
    simulationId: 'sim-3',
    title: 'Flash Flood Early Warning & High Ground',
    category: 'Flood Response',
    className: 'Class 8-A',
    teacherName: 'Anita Sharma',
    difficulty: 'Advanced',
    assignedDate: '2026-09-14',
    dueDate: '2026-09-30',
    status: 'In Progress',
    score: null,
    instructions: 'Pay attention to electrical safety guidelines during rising water levels.'
  },
  {
    id: 'asg-104',
    simulationId: 'sim-4',
    title: 'Landslide Early Signals & Slope Escape',
    category: 'Landslide',
    className: 'Class 8-A',
    teacherName: 'Anita Sharma',
    difficulty: 'Intermediate',
    assignedDate: '2026-09-15',
    dueDate: '2026-10-05',
    status: 'Not Started',
    score: null,
    instructions: 'Study slope warning indicators carefully.'
  }
];

export const initialDistrictSchools = [
  { id: 'sch-1', name: 'Govt Model Senior Secondary School, Sector 4', block: 'Block A (Central)', students: 1240, teachers: 48, score: 88, riskLevel: 'Low Risk' },
  { id: 'sch-2', name: 'St. Xavier Public Academy', block: 'Block A (Central)', students: 980, teachers: 42, score: 85, riskLevel: 'Low Risk' },
  { id: 'sch-3', name: 'PM SHRI School, Vasant Kunj', block: 'Block B (South)', students: 1450, teachers: 56, score: 82, riskLevel: 'Low Risk' },
  { id: 'sch-4', name: 'Kendriya Vidyalaya No. 2, Cantonment', block: 'Block B (South)', students: 1120, teachers: 45, score: 79, riskLevel: 'Low Risk' },
  { id: 'sch-5', name: 'Sarvodaya Kanya Vidyalaya, Malviya Nagar', block: 'Block B (South)', students: 860, teachers: 36, score: 76, riskLevel: 'Low Risk' },
  { id: 'sch-6', name: 'Bhavan Vidya Mandir, Okhla Phase 1', block: 'Block C (East)', students: 920, teachers: 38, score: 71, riskLevel: 'Medium Risk' },
  { id: 'sch-7', name: 'Govt Boys High School, Badarpur', block: 'Block C (East)', students: 1050, teachers: 40, score: 68, riskLevel: 'Medium Risk' },
  { id: 'sch-8', name: 'City Public Convent, Mehrauli', block: 'Block B (South)', students: 740, teachers: 28, score: 64, riskLevel: 'Medium Risk' },
  { id: 'sch-9', name: 'Govt Senior Secondary School, Sangam Vihar', block: 'Block C (East)', students: 1680, teachers: 50, score: 58, riskLevel: 'Medium Risk' },
  { id: 'sch-10', name: 'Navodaya Model School, Neb Sarai', block: 'Block B (South)', students: 620, teachers: 25, score: 53, riskLevel: 'Medium Risk' },
  { id: 'sch-11', name: 'Govt High School, Lalkuan Rural', block: 'Block D (Rural Border)', students: 510, teachers: 18, score: 44, riskLevel: 'High Risk' },
  { id: 'sch-12', name: 'Adarsh Secondary Vidyalaya, Tuglakabad', block: 'Block D (Rural Border)', students: 690, teachers: 22, score: 41, riskLevel: 'High Risk' }
];

export const defaultUserProfiles = {
  STUDENT: {
    name: 'Sai S.',
    className: 'Grade 10A',
    age: '15',
    email: 'sai.grade10@disasteriq.edu',
    school: 'Greenfield High School',
    emergencyContact: '+91 9876543210',
    avatar: '🧑‍🎓'
  },
  TEACHER: {
    name: 'Anita Sharma',
    className: 'Class 6A Teacher',
    age: '34',
    email: 'anita.sharma@disasteriq.edu',
    school: 'Greenfield High School',
    emergencyContact: '+91 9812345606',
    avatar: '👩‍🏫'
  },
  PARENT: {
    name: 'Pradeep',
    className: 'Parent (Rohan & Priya)',
    age: '42',
    email: 'pradeep.parent@gmail.com',
    school: 'Govt Model School & SKV',
    emergencyContact: '+91 9876500112',
    avatar: '👨‍👩‍👧'
  },
  ADMIN: {
    name: 'Admin',
    className: 'School Administrator',
    age: '48',
    email: 'vkrao.admin@disasteriq.gov.in',
    school: 'Govt Model Senior Secondary',
    emergencyContact: '+91 9811122334',
    avatar: '🛡️'
  },
  DISTRICT: {
    name: 'Smt. Meenakshi Sundaram, IAS',
    className: 'District Magistrate & Collector',
    age: '45',
    email: 'collector.district@gov.in',
    school: 'South Delhi Jurisdiction (14 Schools)',
    emergencyContact: '+91 9800011122',
    avatar: '🏛️'
  }
};

export const AppProvider = ({ children }) => {
  const [role, setRoleState] = useState(() => {
    const saved = localStorage.getItem('role');
    return saved === 'COLLECTOR' ? 'DISTRICT' : (saved || 'PUBLIC');
  });
  const setRole = (newRole) => {
    const normalized = newRole === 'COLLECTOR' ? 'DISTRICT' : newRole;
    setRoleState(normalized);
    localStorage.setItem('role', normalized);
  };
  const [activeTab, setActiveTabState] = useState(() => {
    const savedRole = localStorage.getItem('role') || 'PUBLIC';
    return localStorage.getItem(`activeTab_${savedRole}`) || 'dashboard';
  });
  const setActiveTab = (tab) => {
    const savedRole = localStorage.getItem('role') || 'PUBLIC';
    setActiveTabState(tab);
    localStorage.setItem(`activeTab_${savedRole}`, tab);
  };
  useEffect(() => {
    if (role) {
      const tab = localStorage.getItem(`activeTab_${role}`) || 'dashboard';
      setActiveTabState(tab);
    }
  }, [role]);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = React.useRef(null);
  const showToast = React.useCallback((message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [profiles, setProfiles] = useState(defaultUserProfiles);
  const [assignments, setAssignments] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [simulations, setSimulations] = useState(initialSimulations);
  const [districtSchools, setDistrictSchools] = useState(initialDistrictSchools);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      try {
        const stored = localStorage.getItem(`notifications_${email.toLowerCase()}`);
        if (stored) {
          setNotifications(JSON.parse(stored));
          return;
        }
      } catch (e) {}
    }
    setNotifications([
      { id: 1, text: 'New Simulation Assigned: Landslide Early Signals', time: '10 mins ago', read: false },
      { id: 2, text: 'Teacher Anita Sharma updated Class 8-A due dates', time: '2 hours ago', read: false },
      { id: 3, text: 'Preparedness Score updated: +4% this week', time: '1 day ago', read: true }
    ]);
  }, [role]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email && role !== 'PUBLIC') {
      try {
        localStorage.setItem(`notifications_${email.toLowerCase()}`, JSON.stringify(notifications));
      } catch (e) {}
    }
  }, [notifications, role]);

  const [activeSimulation, setActiveSimulation] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);

  const activeUserProfile = profiles[role] || profiles.STUDENT;

  // Persists profile changes to the database, then updates local state
  const updateUserProfile = async (updatedFields) => {
    const roleKey = role === 'PUBLIC' ? 'STUDENT' : role;

    // Optimistic local update immediately for good UX
    setProfiles(prev => ({
      ...prev,
      [roleKey]: {
        ...prev[roleKey],
        ...updatedFields
      }
    }));

    // Persist to backend if user is logged in
    const token = localStorage.getItem('token');
    if (token && role !== 'PUBLIC') {
      try {
        const payload = {};
        if (updatedFields.name)             payload.fullName = updatedFields.name;
        if (updatedFields.emergencyContact) payload.phone    = updatedFields.emergencyContact;

        if (Object.keys(payload).length > 0) {
          const res = await api.put('/api/auth/profile', payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Sync local state with server response
          if (res.data) {
            setProfiles(prev => ({
              ...prev,
              [roleKey]: {
                ...prev[roleKey],
                name: res.data.fullName || prev[roleKey].name,
                email: res.data.email || prev[roleKey].email,
                emergencyContact: res.data.phone || prev[roleKey].emergencyContact
              }
            }));
            // Update localStorage too
            if (res.data.fullName) localStorage.setItem('fullName', res.data.fullName);
          }
        }
      } catch (err) {
        console.error('Profile update failed:', err?.response?.data || err.message);
        // Roll back optimistic update on failure
        setProfiles(prev => ({
          ...prev,
          [roleKey]: { ...prev[roleKey] }
        }));
      }
    }
  };


  const logout = () => {
    setRole('PUBLIC');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('studentId');
    localStorage.removeItem('teacherId');
    localStorage.removeItem('parentId');
    localStorage.removeItem('role');
    localStorage.removeItem('showPortal');
    localStorage.removeItem('activeTab_STUDENT');
    localStorage.removeItem('activeTab_TEACHER');
    localStorage.removeItem('activeTab_PARENT');
    localStorage.removeItem('activeTab_ADMIN');
    localStorage.removeItem('activeTab_DISTRICT');
    setActiveTabState('dashboard');
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(null);
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#07040a';
      document.body.style.color = '#f8fafc';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f6f0ff';
      document.body.style.color = '#1e1b4b';
    }
  }, [theme]);

  const completedAsgs = assignments.filter(a => a.status === 'Completed' && a.score !== null);
  const avgPreparednessScore = completedAsgs.length > 0
    ? Math.round(completedAsgs.reduce((acc, curr) => acc + curr.score, 0) / completedAsgs.length)
    : 82;

  const addAssignment = (newAsg) => {
    const created = {
      id: `asg-${Date.now()}`,
      status: 'Not Started',
      score: null,
      assignedDate: new Date().toISOString().split('T')[0],
      ...newAsg
    };
    setAssignments(prev => [created, ...prev]);

    setNotifications(prev => [
      { id: Date.now(), text: `New Assignment Created: ${created.title} for ${created.className}`, time: 'Just now', read: false },
      ...prev
    ]);
  };

  const submitQuizScore = (assignmentId, score) => {
    setAssignments(prev => prev.map(asg => {
      if ((asg.assignmentId || asg.id)?.toString() === assignmentId?.toString()) {
        return { ...asg, studentStatus: 'COMPLETED', status: 'Completed', score };
      }
      return asg;
    }));

    setNotifications(prev => [
      { id: Date.now(), text: `Assessment Submitted! Score: ${score}%`, time: 'Just now', read: false },
      ...prev
    ]);

    // Parent notification simulator engine
    try {
      const studentName = localStorage.getItem('fullName') || 'Your child';
      const studentEmail = localStorage.getItem('email') || '';
      
      const targetAsg = assignments.find(a => (a.assignmentId || a.id)?.toString() === assignmentId?.toString());
      const title = targetAsg?.title || 'Disaster Safety Drill';
      
      const parentEmailKey = 'notifications_parent@gmail.com'; 
      let parentNotifications = [];
      try {
        const existing = localStorage.getItem(parentEmailKey);
        if (existing) parentNotifications = JSON.parse(existing);
      } catch (e) {}
      
      const newNotif = {
        id: Date.now(),
        text: `📧 Parent Report: ${studentName} completed "${title}" with a score of ${score}%!`,
        time: 'Just now',
        read: false
      };
      
      localStorage.setItem(parentEmailKey, JSON.stringify([newNotif, ...parentNotifications]));
      
      // Also notify any custom parent accounts
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('notifications_') && key !== parentEmailKey) {
          try {
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            localStorage.setItem(key, JSON.stringify([newNotif, ...list]));
          } catch(e) {}
        }
      }
    } catch(e) {
      console.error('Error generating simulated parent notification:', e);
    }
  };

  const loadData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const [sch, cls, std, tch, sim, asg] = await Promise.allSettled([
        api.get('/api/schools'),
        api.get('/api/classes'),
        api.get('/api/students'),
        api.get('/api/teachers'),
        api.get('/api/simulations'),
        role === 'STUDENT' ? api.get('/api/assignments/student/me') : role === 'TEACHER' ? api.get('/api/assignments/teacher/me') : api.get('/api/assignments')
      ]);
      if (sch.status === 'fulfilled') setSchools(sch.value.data);
      if (cls.status === 'fulfilled') setClasses(cls.value.data);
      if (std.status === 'fulfilled') setStudents(std.value.data);
      if (tch.status === 'fulfilled') setTeachers(tch.value.data);
      if (sim.status === 'fulfilled') setSimulations(sim.value.data || []);
      if (asg.status === 'fulfilled') setAssignments(asg.value.data || []);
      else if (asg.status === 'rejected' && role === 'STUDENT') {
        // Fallback to generic assignments endpoint
        try { const fallbackAsg = await api.get('/api/assignments'); setAssignments(fallbackAsg.data || []); } catch(e) {}
      }


      // Secure dynamic fetch of user-specific metrics
      try {
        let metricsRes = null;
        if (role === 'STUDENT') {
          metricsRes = await api.get('/api/student/dashboard/me');
        } else if (role === 'TEACHER') {
          metricsRes = await api.get('/api/teacher/dashboard/me');
        } else if (role === 'PARENT') {
          metricsRes = await api.get('/api/parent/dashboard/me');
        } else if (role === 'ADMIN') {
          metricsRes = await api.get('/api/admin/dashboard');
        }
        if (metricsRes && metricsRes.data) {
          setDashboardMetrics(metricsRes.data);
        }
      } catch (err) {
        console.error("Error loading secure dashboard metrics", err);
      }

    } catch (e) {
      console.error("Error loading dashboard data:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, [role]);

  // Update profiles dynamically from logged-in user credentials
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');
    if (userId && fullName && email && role !== 'PUBLIC') {
      let resolvedAge = role === 'TEACHER' ? '34' : (role === 'PARENT' ? '42' : '15');
      try {
        const ageStore = JSON.parse(localStorage.getItem('userAgeStore') || '{}');
        if (ageStore[email.toLowerCase()]) {
          resolvedAge = ageStore[email.toLowerCase()];
        }
      } catch (e) {}

      let resolvedName = fullName;
      const lower = (fullName || '').toLowerCase().trim();
      if (['parent', 'student', 'teacher', 'admin', 'collector', 'district'].includes(lower)) {
        resolvedName = defaultUserProfiles[role]?.name || (fullName.charAt(0).toUpperCase() + fullName.slice(1));
      } else {
        resolvedName = fullName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }

      setProfiles(prev => ({
        ...prev,
        [role]: {
          ...prev[role],
          name: resolvedName,
          email: email,
          age: resolvedAge
        }
      }));
    }
  }, [role]);

  // Load student profile details dynamically if role is STUDENT
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    if (role === 'STUDENT') {
      let resolvedAge = '15';
      let resolvedName = localStorage.getItem('fullName') || '';
      let resolvedEmail = email || '';
      let resolvedClass = 'Grade 10A';
      let resolvedPhone = '+91 9876543210';
      let resolvedSchool = 'Greenfield High School';

      // Check onboardedStudentCreds
      try {
        const onboarded = JSON.parse(localStorage.getItem('onboardedStudentCreds') || '[]');
        if (email) {
          const match = onboarded.find(c => c.email === email.toLowerCase());
          if (match) {
            if (match.name) resolvedName = match.name;
            if (match.className) resolvedClass = match.className;
            if (match.age) resolvedAge = match.age;
            if (match.phone) resolvedPhone = match.phone;
            if (match.school) resolvedSchool = match.school;
          }
        }
      } catch (e) {}

      // Check userAgeStore
      try {
        const ageStore = JSON.parse(localStorage.getItem('userAgeStore') || '{}');
        if (email && ageStore[email.toLowerCase()]) {
          resolvedAge = ageStore[email.toLowerCase()];
        }
      } catch (e) {}

      if (userId) {
        api.get('/api/students')
          .then(res => {
            const studentProfile = res.data.find(s => s.userId === parseInt(userId) || (email && s.email?.toLowerCase() === email.toLowerCase()));
            if (studentProfile) {
              updateUserProfile({
                name: studentProfile.studentName || studentProfile.fullName || resolvedName,
                email: studentProfile.email || resolvedEmail,
                school: studentProfile.schoolName || resolvedSchool,
                className: (studentProfile.className ? `${studentProfile.className} ${studentProfile.section || ''}` : resolvedClass).trim(),
                studentId: studentProfile.studentId,
                age: resolvedAge,
                emergencyContact: studentProfile.phone || resolvedPhone
              });
            } else {
              updateUserProfile({
                name: resolvedName,
                email: resolvedEmail,
                school: resolvedSchool,
                className: resolvedClass,
                age: resolvedAge,
                emergencyContact: resolvedPhone
              });
            }
          })
          .catch(() => {
            updateUserProfile({
              name: resolvedName,
              email: resolvedEmail,
              school: resolvedSchool,
              className: resolvedClass,
              age: resolvedAge,
              emergencyContact: resolvedPhone
            });
          });
      } else {
        updateUserProfile({
          name: resolvedName,
          email: resolvedEmail,
          school: resolvedSchool,
          className: resolvedClass,
          age: resolvedAge,
          emergencyContact: resolvedPhone
        });
      }
    }
  }, [role]);

  // Load teacher details dynamically
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (role === 'TEACHER' && userId) {
      api.get('/api/teachers')
        .then(res => {
          const teacherProfile = res.data.find(t => t.userId === parseInt(userId));
          if (teacherProfile) {
            updateUserProfile({
              name: teacherProfile.teacherName,
              email: teacherProfile.email,
              school: teacherProfile.schoolName || 'Greenwood High School',
              className: teacherProfile.qualification || 'Educator',
              teacherId: teacherProfile.teacherId
            });
          }
        })
        .catch(err => console.error("Error loading teacher profile", err));
    }
  }, [role]);

  // Load parent details dynamically
  useEffect(() => {
    if (role === 'PARENT' && dashboardMetrics) {
      updateUserProfile({
        school: dashboardMetrics.schoolName || 'Greenwood High School',
        className: 'Parent'
      });
    }
  }, [role, dashboardMetrics]);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        toast,
        showToast,
        theme,
        toggleTheme,
        userProfile: activeUserProfile,
        updateUserProfile,
        dashboardMetrics,
        assignments,
        simulations,
        schools,
        classes,
        students,
        teachers,
        districtSchools,
        notifications,
        avgPreparednessScore,
        activeSimulation,
        setActiveSimulation,
        activeQuiz,
        setActiveQuiz,
        addAssignment,
        submitQuizScore,
        logout,
        loadData,
        markNotificationsRead: () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
