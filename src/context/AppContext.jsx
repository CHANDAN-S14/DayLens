import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_DAILY_RECORDS, 
  INITIAL_EXPERIMENTS, 
  DEFAULT_USER_PROFILE 
} from '../data/demoData';
import authService from '../services/authService';
import recordService from '../services/recordService';
import experimentService from '../services/experimentService';
import profileService from '../services/profileService';
import assistantService from '../services/assistantService';
import apiClient from '../services/apiClient';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Authentication & Sync State
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Daily Records
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('daylens_records');
      return saved ? JSON.parse(saved) : INITIAL_DAILY_RECORDS;
    } catch (e) {
      console.error("Failed to load records from localStorage", e);
      return INITIAL_DAILY_RECORDS;
    }
  });

  // 2. Experiments
  const [experiments, setExperiments] = useState(() => {
    try {
      const saved = localStorage.getItem('daylens_experiments');
      return saved ? JSON.parse(saved) : INITIAL_EXPERIMENTS;
    } catch (e) {
      console.error("Failed to load experiments from localStorage", e);
      return INITIAL_EXPERIMENTS;
    }
  });

  // 3. User Profile & Settings
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('daylens_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch (e) {
      console.error("Failed to load profile from localStorage", e);
      return DEFAULT_USER_PROFILE;
    }
  });

  // 4. Chat history for DayLens AI
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('daylens_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load chat from localStorage", e);
    }
    return [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "Hello Alex. I am your DayLens personal intelligence assistant. I analyze your biometric data, sleep rhythms, and focus correlations. How can I help you today?",
        isDemo: true
      }
    ];
  });

  // 5. Toast / Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Check Backend Server Health
  const checkBackendHealth = useCallback(async () => {
    try {
      const res = await apiClient.get('/health', { timeout: 3000 });
      if (res.data?.status === 'healthy') {
        setIsBackendConnected(true);
        return true;
      }
    } catch (e) {
      setIsBackendConnected(false);
    }
    return false;
  }, []);

  // Sync state from Backend when authenticated
  const syncWithBackend = useCallback(async () => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const [backendUser, backendRecords, backendExperiments] = await Promise.all([
        authService.getMe().catch(() => null),
        recordService.getRecords().catch(() => null),
        experimentService.getExperiments().catch(() => null)
      ]);

      if (backendUser?.user) {
        setUser(backendUser.user);
        setProfile(prev => ({
          ...prev,
          name: backendUser.user.name,
          email: backendUser.user.email,
          role: backendUser.user.role,
          targetSleep: backendUser.user.targetSleep,
          targetSteps: backendUser.user.targetSteps,
          targetScreenLimit: backendUser.user.targetScreenLimit,
          units: backendUser.user.units,
          timeFormat: backendUser.user.timeFormat,
          theme: backendUser.user.theme,
          privacyConsent: backendUser.privacyConsent || prev.privacyConsent
        }));
      }

      if (Array.isArray(backendRecords) && backendRecords.length > 0) {
        setRecords(backendRecords);
      }

      if (Array.isArray(backendExperiments) && backendExperiments.length > 0) {
        setExperiments(backendExperiments);
      }
    } catch (err) {
      console.warn("Backend sync encountered non-fatal error:", err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [token]);

  // Initial health check & data sync on mount
  useEffect(() => {
    checkBackendHealth();
    if (token) {
      syncWithBackend();
    }
  }, [checkBackendHealth, syncWithBackend, token]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('daylens_records', JSON.stringify(records));
    } catch (e) {
      console.error("Failed to persist records", e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem('daylens_experiments', JSON.stringify(experiments));
    } catch (e) {
      console.error("Failed to persist experiments", e);
    }
  }, [experiments]);

  useEffect(() => {
    try {
      localStorage.setItem('daylens_profile', JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to persist profile", e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('daylens_chat', JSON.stringify(chatMessages));
    } catch (e) {
      console.error("Failed to persist chat", e);
    }
  }, [chatMessages]);

  // Auth Operations
  const login = async (email, password) => {
    setIsSyncing(true);
    try {
      const res = await authService.login(email, password);
      setToken(res.token);
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}`);
      await syncWithBackend();
      return { success: true, user: res.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsSyncing(false);
    }
  };

  const register = async (name, email, password, seedDemoData = true) => {
    setIsSyncing(true);
    try {
      const res = await authService.register({ name, email, password, seedDemoData });
      setToken(res.token);
      setUser(res.user);
      showToast(`Account created for ${res.user.name}`);
      await syncWithBackend();
      return { success: true, user: res.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsSyncing(false);
    }
  };

  const demoLogin = async () => {
    setIsSyncing(true);
    try {
      const res = await authService.demoLogin();
      setToken(res.token);
      setUser(res.user);
      showToast(`Logged in as Demo User (${res.user.name})`);
      await syncWithBackend();
      return { success: true, user: res.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Demo login failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsSyncing(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    showToast("Signed out. Switched to local offline mode.", "info");
  };

  // Record Actions
  const addRecord = async (newRecord) => {
    const recordWithId = {
      ...newRecord,
      id: newRecord.id || `rec-${Date.now()}`
    };

    // Update local state first for instant responsiveness
    setRecords(prev => {
      const existingIndex = prev.findIndex(r => r.date === recordWithId.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = recordWithId;
        return updated.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      return [...prev, recordWithId].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    showToast(`Saved data record for ${newRecord.date}`);

    // Sync to backend if authenticated
    if (token) {
      try {
        await recordService.saveRecord(newRecord);
      } catch (err) {
        console.warn("Background record sync error:", err.message);
      }
    }
  };

  const updateRecord = async (id, updatedFields) => {
    setRecords(prev => prev.map(r => r.id === id || r._id === id ? { ...r, ...updatedFields } : r));
    showToast("Record updated successfully");

    if (token) {
      try {
        await recordService.updateRecord(id, updatedFields);
      } catch (err) {
        console.warn("Background record update error:", err.message);
      }
    }
  };

  const deleteRecord = async (id) => {
    setRecords(prev => prev.filter(r => r.id !== id && r._id !== id));
    showToast("Record removed", "info");

    if (token) {
      try {
        await recordService.deleteRecord(id);
      } catch (err) {
        console.warn("Background record deletion error:", err.message);
      }
    }
  };

  // CSV Import Action
  const importRecordsFromCsv = async (csvText) => {
    try {
      const lines = csvText.trim().split(/\r?\n/);
      if (lines.length < 2) {
        return { success: false, error: "CSV file is empty or missing headers." };
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const dateIdx = headers.indexOf('date');
      const sleepIdx = headers.indexOf('sleephours') !== -1 ? headers.indexOf('sleephours') : headers.indexOf('sleep');
      const screenIdx = headers.indexOf('screentimehours') !== -1 ? headers.indexOf('screentimehours') : headers.indexOf('screen');
      const stepsIdx = headers.indexOf('steps');
      const exerciseIdx = headers.indexOf('exerciseduration') !== -1 ? headers.indexOf('exerciseduration') : headers.indexOf('exercise');
      const moodIdx = headers.indexOf('mood');
      const focusIdx = headers.indexOf('focus');
      const notesIdx = headers.indexOf('notes');

      if (dateIdx === -1) {
        return { success: false, error: "CSV must contain a 'date' column (YYYY-MM-DD)." };
      }

      const newRecords = [];
      let parseErrors = 0;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const dateVal = cols[dateIdx];
        if (!dateVal || isNaN(Date.parse(dateVal))) {
          parseErrors++;
          continue;
        }

        newRecords.push({
          id: `csv-${Date.now()}-${i}`,
          date: dateVal,
          sleepHours: sleepIdx !== -1 && cols[sleepIdx] ? parseFloat(cols[sleepIdx]) || 7.0 : 7.0,
          screenTimeHours: screenIdx !== -1 && cols[screenIdx] ? parseFloat(cols[screenIdx]) || 4.0 : 4.0,
          steps: stepsIdx !== -1 && cols[stepsIdx] ? parseInt(cols[stepsIdx], 10) || 7500 : 7500,
          exerciseDuration: exerciseIdx !== -1 && cols[exerciseIdx] ? parseInt(cols[exerciseIdx], 10) || 20 : 20,
          mood: moodIdx !== -1 && cols[moodIdx] ? parseFloat(cols[moodIdx]) || 7 : 7,
          focus: focusIdx !== -1 && cols[focusIdx] ? parseFloat(cols[focusIdx]) || 7 : 7,
          notes: notesIdx !== -1 && cols[notesIdx] ? cols[notesIdx] : "Imported from CSV"
        });
      }

      if (newRecords.length === 0) {
        return { success: false, error: "No valid daily rows could be parsed from the file." };
      }

      setRecords(prev => {
        const dateMap = new Map();
        prev.forEach(r => dateMap.set(r.date, r));
        newRecords.forEach(r => dateMap.set(r.date, r));
        return Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
      });

      showToast(`Successfully imported ${newRecords.length} records`);

      if (token) {
        try {
          await recordService.importCsv(csvText);
        } catch (err) {
          console.warn("Backend CSV sync notice:", err.message);
        }
      }

      return { success: true, count: newRecords.length, parseErrors };
    } catch (err) {
      console.error("CSV Parse error", err);
      return { success: false, error: err.message || "Failed to process CSV." };
    }
  };

  // Experiment Actions
  const addExperiment = async (newExp) => {
    const expWithId = {
      ...newExp,
      id: `exp-${Date.now()}`,
      currentDay: 1,
      completedDays: [],
      status: 'active'
    };
    setExperiments(prev => [expWithId, ...prev]);
    showToast(`Created experiment: "${newExp.title}"`);

    if (token) {
      try {
        const saved = await experimentService.createExperiment(newExp);
        if (saved?._id) {
          setExperiments(prev => prev.map(e => e.id === expWithId.id ? saved : e));
        }
      } catch (err) {
        console.warn("Backend experiment creation error:", err.message);
      }
    }
  };

  const toggleExperimentDay = async (experimentId, dateStr) => {
    setExperiments(prev => prev.map(exp => {
      const expId = exp._id || exp.id;
      if (expId !== experimentId) return exp;
      const days = exp.completedDays || [];
      const hasCompleted = days.includes(dateStr);
      const updatedDays = hasCompleted 
        ? days.filter(d => d !== dateStr) 
        : [...days, dateStr];

      return {
        ...exp,
        completedDays: updatedDays,
        currentDay: Math.min(exp.durationDays, Math.max(exp.currentDay, updatedDays.length))
      };
    }));

    if (token) {
      try {
        await experimentService.toggleDay(experimentId, dateStr);
      } catch (err) {
        console.warn("Backend experiment day toggle error:", err.message);
      }
    }
  };

  const updateExperimentStatus = async (experimentId, status) => {
    setExperiments(prev => prev.map(exp => {
      const expId = exp._id || exp.id;
      if (expId !== experimentId) return exp;
      return { ...exp, status };
    }));
    showToast(`Experiment status set to ${status}`);

    if (token) {
      try {
        await experimentService.updateStatus(experimentId, status);
      } catch (err) {
        console.warn("Backend experiment status update error:", err.message);
      }
    }
  };

  const deleteExperiment = async (experimentId) => {
    setExperiments(prev => prev.filter(exp => (exp._id || exp.id) !== experimentId));
    showToast("Experiment deleted", "info");

    if (token) {
      try {
        await experimentService.deleteExperiment(experimentId);
      } catch (err) {
        console.warn("Backend experiment deletion error:", err.message);
      }
    }
  };

  // Profile & Preferences
  const updateProfile = async (fields) => {
    setProfile(prev => ({ ...prev, ...fields }));
    showToast("Preferences saved");

    if (token) {
      try {
        await profileService.updateProfile(fields);
      } catch (err) {
        console.warn("Backend profile sync error:", err.message);
      }
    }
  };

  // Data Export & Reset Actions
  const exportData = (format = 'json') => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = `daylens-export-${new Date().toISOString().slice(0, 10)}`;

    if (format === 'json') {
      content = JSON.stringify({
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
        app: "DayLens (wHACKiest 2026 Track 3)",
        user: user || { name: profile.name, email: profile.email },
        records,
        experiments,
        profile
      }, null, 2);
      mimeType = 'application/json';
      filename += '.json';
    } else {
      const headers = ['date', 'sleepHours', 'screenTimeHours', 'steps', 'exerciseDuration', 'mood', 'focus', 'notes'];
      const rows = records.map(r => [
        r.date,
        r.sleepHours,
        r.screenTimeHours,
        r.steps,
        r.exerciseDuration,
        r.mood,
        r.focus,
        `"${(r.notes || '').replace(/"/g, '""')}"`
      ].join(','));
      content = [headers.join(','), ...rows].join('\n');
      mimeType = 'text/csv';
      filename += '.csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${records.length} records as ${format.toUpperCase()}`);
  };

  const resetAllData = () => {
    setRecords(INITIAL_DAILY_RECORDS);
    setExperiments(INITIAL_EXPERIMENTS);
    setProfile(DEFAULT_USER_PROFILE);
    localStorage.removeItem('daylens_records');
    localStorage.removeItem('daylens_experiments');
    localStorage.removeItem('daylens_profile');
    localStorage.removeItem('daylens_chat');
    showToast("Reset all records to default demo data", "info");
  };

  const clearAllData = () => {
    setRecords([]);
    setExperiments([]);
    localStorage.clear();
    setToken(null);
    setUser(null);
    showToast("Cleared all local records and settings", "info");
  };

  // Chat Actions
  const addChatMessage = (msg) => {
    setChatMessages(prev => [...prev, msg]);
  };

  const clearChat = async () => {
    setChatMessages([]);
    localStorage.removeItem('daylens_chat');
    if (token) {
      try {
        await assistantService.clearHistory();
      } catch (err) {
        // ignore
      }
    }
    showToast("Chat history cleared");
  };

  return (
    <AppContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isBackendConnected,
      isSyncing,
      login,
      register,
      demoLogin,
      logout,
      syncWithBackend,
      checkBackendHealth,
      records,
      experiments,
      profile,
      chatMessages,
      toast,
      showToast,
      addRecord,
      updateRecord,
      deleteRecord,
      importRecordsFromCsv,
      addExperiment,
      toggleExperimentDay,
      updateExperimentStatus,
      deleteExperiment,
      updateProfile,
      exportData,
      resetAllData,
      clearAllData,
      addChatMessage,
      clearChat
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
