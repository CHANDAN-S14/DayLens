import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Plus, List, X, Sparkle, CalendarBlank, Database } from '@phosphor-icons/react';
import DemoBadge from '../common/DemoBadge';
import { useApp } from '../../context/AppContext';

const PAGE_TITLES = {
  '/overview': 'Personal Overview',
  '/': 'Personal Overview',
  '/data': 'My Personal Data',
  '/insights': 'Pattern Discovery & Insights',
  '/experiments': 'Experiment Lab',
  '/assistant': 'DayLens AI Assistant',
  '/privacy': 'Privacy & Data Ownership',
  '/settings': 'System Settings'
};

export default function Header({ onOpenAddModal, mobileMenuOpen, setMobileMenuOpen }) {
  const location = useLocation();
  const { isAuthenticated, isBackendConnected } = useApp();
  const currentTitle = PAGE_TITLES[location.pathname] || 'Personal Intelligence';

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="h-16 border-b border-border bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-sage-50 transition-colors focus:ring-2 focus:ring-botanical-600 focus:outline-none"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 transition-transform duration-300 ease-skill-base" />
          ) : (
            <List className="w-5 h-5 transition-transform duration-300 ease-skill-base" />
          )}
        </button>

        <div>
          <h1 className="title-2 text-charcoal font-semibold">{currentTitle}</h1>
          <div className="hidden sm:flex items-center gap-2 caption-5 text-charcoal-muted">
            <CalendarBlank className="w-3.5 h-3.5" />
            <span>{todayFormatted}</span>
            <span>•</span>
            <span className="text-botanical-800 font-medium">Track 3: Know Thyself</span>
          </div>
        </div>
      </div>

      {/* Right side: Demo badge, 3D world link & Add Daily Entry button */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="btn-secondary button-sm"
          title="Return to the 3D cinematic landing experience"
        >
          <Sparkle className="w-4 h-4 text-botanical-700" />
          <span className="hidden sm:inline">3D World</span>
        </Link>

        {/* Live Backend / Demo Mode Status Pill */}
        <Link
          to="/settings"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors bg-sage-50 hover:bg-sage-100 border-border"
          title={isAuthenticated ? "Authenticated with MongoDB Atlas / Local API" : "Operating in Local Browser Storage. Click to configure cloud sync"}
        >
          <span className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-emerald-500' : 'bg-botanical-600'}`} />
          <span className="text-charcoal font-medium">
            {isAuthenticated ? 'MongoDB Sync' : 'Local Mode'}
          </span>
        </Link>

        <div className="hidden lg:block">
          <DemoBadge variant="compact" />
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn-primary button-sm"
          title="Add new daily log"
        >
          <Plus className="w-4 h-4" weight="bold" />
          <span className="hidden xs:inline">Add Daily Entry</span>
        </button>
      </div>
    </header>
  );
}
