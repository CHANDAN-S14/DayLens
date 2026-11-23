import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GearSix, 
  User, 
  Sliders, 
  Bell, 
  PaintBrush, 
  Info, 
  Check, 
  FloppyDisk, 
  Sparkle,
  Moon,
  Footprints,
  Monitor,
  Database,
  CloudCheck,
  SignIn,
  ArrowsClockwise,
  Key
} from '@phosphor-icons/react';

export default function Settings() {
  const { 
    user, 
    token, 
    isAuthenticated, 
    isBackendConnected, 
    isSyncing, 
    login, 
    register, 
    demoLogin, 
    logout, 
    syncWithBackend, 
    checkBackendHealth,
    profile, 
    updateProfile, 
    exportData 
  } = useApp();

  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const [formData, setFormData] = useState({
    name: profile.name || 'Alex Morgan',
    email: profile.email || 'alex.morgan@example.com',
    role: profile.role || 'Knowledge Worker & Track 3 Participant',
    targetSleep: profile.targetSleep || 8.0,
    targetSteps: profile.targetSteps || 9000,
    targetScreenLimit: profile.targetScreenLimit || 4.5,
    units: profile.units || 'metric',
    timeFormat: profile.timeFormat || '24h',
    theme: profile.theme || 'light'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    if (authTab === 'login') {
      const res = await login(authEmail, authPassword);
      if (!res.success) setAuthError(res.error);
    } else {
      const res = await register(authName, authEmail, authPassword);
      if (!res.success) setAuthError(res.error);
    }
    setAuthLoading(false);
  };

  const handleDemoLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    const res = await demoLogin();
    if (!res.success) setAuthError(res.error);
    setAuthLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      targetSleep: Number(formData.targetSleep),
      targetSteps: Number(formData.targetSteps),
      targetScreenLimit: Number(formData.targetScreenLimit),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="caption-3 px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-semibold border border-botanical-200">
                Configuration
              </span>
              <span className="caption-4 text-charcoal-muted">
                Persistent in LocalStorage
              </span>
            </div>
            <h2 className="heading-5 text-charcoal font-semibold">
              Personal Preferences & Goals
            </h2>
            <p className="body-5 text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
              Tailor baseline targets for sleep, steps, and device boundaries to customize comparison statistics across all dashboard charts.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="btn-primary button-sm flex-shrink-0"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved Changes</span>
              </>
            ) : (
              <>
                <FloppyDisk className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Backend & MongoDB Cloud Sync Section */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAuthenticated ? 'bg-botanical-100 text-botanical-800' : 'bg-sage-100 text-charcoal-muted'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="title-2 text-charcoal font-semibold">MongoDB Cloud Sync & Authentication</h3>
                <span className={`caption-4 px-2 py-0.5 rounded-full font-semibold border ${
                  isAuthenticated
                    ? 'bg-botanical-50 text-botanical-800 border-botanical-200'
                    : 'bg-sage-50 text-charcoal-muted border-sage-200'
                }`}>
                  {isAuthenticated ? 'Live Backend Connected' : 'Local Offline / Demo Mode'}
                </span>
              </div>
              <p className="caption-3 text-charcoal-muted mt-0.5">
                {isAuthenticated 
                  ? `Authenticated as ${user?.email || profile.email}. Live synchronization with Node.js & MongoDB Atlas API.`
                  : 'Currently operating in client-first local storage. Sign in or connect to sync data across devices.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={checkBackendHealth}
              className="btn-secondary button-sm"
              title="Ping Backend API Health"
            >
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span>{isBackendConnected ? 'API Healthy (Port 5000)' : 'Check API Status'}</span>
            </button>
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={syncWithBackend}
                  disabled={isSyncing}
                  className="btn-secondary button-sm"
                  title="Force live database sync"
                >
                  <ArrowsClockwise className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 px-3 rounded-lg border border-border text-charcoal hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors text-xs font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={authLoading}
                className="btn-primary button-sm"
                title="Log in with preloaded hackathon demo profile in MongoDB"
              >
                <CloudCheck className="w-4 h-4" />
                <span>1-Click Demo Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Auth form if unauthenticated */}
        {!isAuthenticated && (
          <div className="bg-sage-50/50 rounded-xl p-4 sm:p-5 border border-border space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`caption-2 font-semibold pb-1 border-b-2 transition-all ${authTab === 'login' ? 'border-botanical-800 text-botanical-800' : 'border-transparent text-charcoal-muted'}`}
              >
                Sign In to Existing Account
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`caption-2 font-semibold pb-1 border-b-2 transition-all ${authTab === 'register' ? 'border-botanical-800 text-botanical-800' : 'border-transparent text-charcoal-muted'}`}
              >
                Register New Account
              </button>
            </div>

            {authError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {authError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {authTab === 'register' && (
                <input
                  type="text"
                  placeholder="Your Name"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="py-1.5 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email address"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="py-1.5 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
                required
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="py-1.5 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleAuthSubmit}
                disabled={authLoading || !authEmail || !authPassword}
                className="btn-primary button-sm"
              >
                <SignIn className="w-4 h-4" />
                <span>{authLoading ? 'Authenticating...' : authTab === 'login' ? 'Sign In' : 'Create Account'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Profile Details */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <User className="w-5 h-5 text-botanical-800" />
            <h3 className="title-2 text-charcoal font-semibold">User Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block caption-1 text-charcoal mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
            </div>

            <div>
              <label className="block caption-1 text-charcoal mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
            </div>
          </div>

          <div>
            <label className="block caption-1 text-charcoal mb-1.5">
              Personal Context / Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
            />
          </div>
        </div>

        {/* 2. Biometric & Daily Targets */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Sliders className="w-5 h-5 text-botanical-800" />
            <h3 className="title-2 text-charcoal font-semibold">Biometric Target Baselines</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 caption-1 text-charcoal mb-1.5">
                <Moon className="w-4 h-4 text-botanical-800" />
                Target Sleep (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="4"
                max="12"
                value={formData.targetSleep}
                onChange={(e) => setFormData({ ...formData, targetSleep: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
              <span className="caption-5 text-charcoal-muted mt-1 block">Reference line on charts</span>
            </div>

            <div>
              <label className="flex items-center gap-1.5 caption-1 text-charcoal mb-1.5">
                <Footprints className="w-4 h-4 text-botanical-800" />
                Daily Step Target
              </label>
              <input
                type="number"
                step="500"
                min="1000"
                max="50000"
                value={formData.targetSteps}
                onChange={(e) => setFormData({ ...formData, targetSteps: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
              <span className="caption-5 text-charcoal-muted mt-1 block">Activity progress meter</span>
            </div>

            <div>
              <label className="flex items-center gap-1.5 caption-1 text-charcoal mb-1.5">
                <Monitor className="w-4 h-4 text-botanical-800" />
                Screen Limit Cap (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={formData.targetScreenLimit}
                onChange={(e) => setFormData({ ...formData, targetScreenLimit: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              />
              <span className="caption-5 text-charcoal-muted mt-1 block">Upper threshold cap</span>
            </div>
          </div>
        </div>

        {/* 3. Display Preferences */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <PaintBrush className="w-5 h-5 text-botanical-800" />
            <h3 className="title-2 text-charcoal font-semibold">Display & Formatting</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block caption-1 text-charcoal mb-1.5">
                Measurement Units
              </label>
              <select
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              >
                <option value="metric">Metric (Kilometers, Steps, Celsius)</option>
                <option value="imperial">Imperial (Miles, Steps, Fahrenheit)</option>
              </select>
            </div>

            <div>
              <label className="block caption-1 text-charcoal mb-1.5">
                Time Format
              </label>
              <select
                value={formData.timeFormat}
                onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value })}
                className="w-full py-2 px-3 rounded-lg border border-border bg-white text-charcoal body-5 focus:outline-none focus:ring-2 focus:ring-botanical-600"
              >
                <option value="24h">24-hour clock (14:30)</option>
                <option value="12h">12-hour clock (2:30 PM)</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-sage-50/50 border border-border caption-4 text-charcoal-muted">
            Theme: <span className="font-semibold text-charcoal">Botanical Warm Light</span> (Strictly aligned with SKILL.md visual guidelines).
          </div>
        </div>

        {/* 4. About DayLens */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Sparkle weight="fill" className="w-5 h-5 text-botanical-800" />
            <h3 className="title-2 text-charcoal font-semibold">About DayLens</h3>
          </div>

          <div className="space-y-2">
            <p className="title-4 font-semibold text-charcoal">
              DayLens — Your life, understood through your data.
            </p>
            <p className="caption-2 text-charcoal-muted leading-relaxed">
              Designed and engineered for <span className="font-semibold text-charcoal">wHACKiest 2026</span> under <span className="font-semibold text-botanical-800">Track 3: Know Thyself</span>.
            </p>
            <p className="caption-4 text-charcoal-muted leading-relaxed">
              DayLens bridges personal data sources (sleep, screen time, movement, focus) to discover actionable lifestyle patterns with authentic client-side statistical calculation.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
