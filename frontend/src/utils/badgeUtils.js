// Utility to manage badges earned by students for completing disaster drills (score > 50%)

export const getBadgeForSimulation = (simTitle = '') => {
  const title = (simTitle || '').toLowerCase();
  if (title.includes('earthquake')) {
    return {
      id: 'badge-earthquake',
      title: 'Earthquake Safety Master',
      icon: '🌋',
      category: 'Earthquake Preparedness',
      description: 'Awarded for scoring over 50% in Earthquake Safety Drill',
      color: 'from-amber-950/90 to-amber-900/40 border-amber-500/60 text-amber-300'
    };
  } else if (title.includes('fire')) {
    return {
      id: 'badge-fire',
      title: 'Fire Safety Hero',
      icon: '🔥',
      category: 'Fire Hazard Response',
      description: 'Awarded for scoring over 50% in Fire Preparedness Drill',
      color: 'from-rose-950/90 to-rose-900/40 border-rose-500/60 text-rose-300'
    };
  } else if (title.includes('flood')) {
    return {
      id: 'badge-flood',
      title: 'Flood Response Specialist',
      icon: '🌊',
      category: 'Flood Evacuation',
      description: 'Awarded for scoring over 50% in Flood Evacuation Drill',
      color: 'from-cyan-950/90 to-cyan-900/40 border-cyan-500/60 text-cyan-300'
    };
  } else if (title.includes('cyclone') || title.includes('storm')) {
    return {
      id: 'badge-cyclone',
      title: 'Cyclone Safety Guardian',
      icon: '🌪️',
      category: 'Storm Safety',
      description: 'Awarded for scoring over 50% in Cyclone Preparedness Drill',
      color: 'from-purple-950/90 to-indigo-900/40 border-purple-500/60 text-purple-300'
    };
  } else if (title.includes('tsunami')) {
    return {
      id: 'badge-tsunami',
      title: 'Tsunami Evacuation Expert',
      icon: '🌊',
      category: 'Coastal Safety',
      description: 'Awarded for scoring over 50% in Tsunami Evacuation Drill',
      color: 'from-teal-950/90 to-blue-900/40 border-teal-500/60 text-teal-300'
    };
  } else {
    return {
      id: `badge-${title.replace(/[^a-z0-9]/g, '-') || 'generic'}`,
      title: `${simTitle || 'Disaster Safety'} Champion`,
      icon: '🏆',
      category: 'Disaster Readiness',
      description: `Awarded for scoring over 50% in ${simTitle || 'Disaster Safety Drill'}`,
      color: 'from-emerald-950/90 to-teal-900/40 border-emerald-500/60 text-emerald-300'
    };
  }
};

export const awardBadgeToStudent = (studentEmail, simTitle, score) => {
  if (score < 50) return null;
  const badge = getBadgeForSimulation(simTitle);
  let emailKey = (studentEmail || localStorage.getItem('email') || localStorage.getItem('userEmail') || '').toLowerCase().trim();
  
  if (!emailKey) {
    try {
      const storedCreds = JSON.parse(localStorage.getItem('onboardedStudentCreds') || '[]');
      if (storedCreds.length > 0) emailKey = (storedCreds[storedCreds.length - 1].email || '').toLowerCase().trim();
    } catch(e) {}
  }

  try {
    const store = JSON.parse(localStorage.getItem('studentBadgesStore') || '{}');
    const masterBadges = JSON.parse(localStorage.getItem('permanently_earned_student_badges') || '[]');

    const newBadgeObj = {
      ...badge,
      earnedScore: Math.round(score),
      dateEarned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    if (emailKey) {
      const studentBadges = store[emailKey] || [];
      const existingIdx = studentBadges.findIndex(b => b.id === badge.id);
      if (existingIdx >= 0) {
        studentBadges[existingIdx] = newBadgeObj;
      } else {
        studentBadges.push(newBadgeObj);
      }
      store[emailKey] = studentBadges;
    }

    // Always update global earned badges list
    const globalBadges = store['global_earned_badges'] || [];
    const gIdx = globalBadges.findIndex(b => b.id === badge.id);
    if (gIdx >= 0) {
      globalBadges[gIdx] = newBadgeObj;
    } else {
      globalBadges.push(newBadgeObj);
    }
    store['global_earned_badges'] = globalBadges;

    // Master list
    const mIdx = masterBadges.findIndex(b => b.id === badge.id);
    if (mIdx >= 0) {
      masterBadges[mIdx] = newBadgeObj;
    } else {
      masterBadges.push(newBadgeObj);
    }

    localStorage.setItem('studentBadgesStore', JSON.stringify(store));
    localStorage.setItem('permanently_earned_student_badges', JSON.stringify(masterBadges));

    if (emailKey) {
      localStorage.setItem(`earned_badge_${emailKey}_${badge.id}`, JSON.stringify(newBadgeObj));
    }

    return newBadgeObj;
  } catch (e) {
    console.error('Error saving badge to store', e);
    return badge;
  }
};

export const getStudentBadges = (studentEmail) => {
  let emailKey = (studentEmail || localStorage.getItem('email') || localStorage.getItem('userEmail') || '').toLowerCase().trim();
  
  try {
    const store = JSON.parse(localStorage.getItem('studentBadgesStore') || '{}');
    const masterBadges = JSON.parse(localStorage.getItem('permanently_earned_student_badges') || '[]');

    let badgeMap = new Map();

    // 1. Check email specific store
    if (emailKey && store[emailKey] && Array.isArray(store[emailKey])) {
      store[emailKey].forEach(b => { if (b && b.id) badgeMap.set(b.id, b); });
    }

    // 2. Check global earned badges
    if (store['global_earned_badges'] && Array.isArray(store['global_earned_badges'])) {
      store['global_earned_badges'].forEach(b => { if (b && b.id && !badgeMap.has(b.id)) badgeMap.set(b.id, b); });
    }

    // 3. Check permanent master list
    if (Array.isArray(masterBadges)) {
      masterBadges.forEach(b => { if (b && b.id && !badgeMap.has(b.id)) badgeMap.set(b.id, b); });
    }

    let resultBadges = Array.from(badgeMap.values());
    return resultBadges;
  } catch (e) {
    return [];
  }
};
