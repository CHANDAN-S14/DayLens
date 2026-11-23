import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  SquaresFour, 
  Database, 
  Sparkle, 
  Flask, 
  ChatTeardropDots, 
  ShieldCheck, 
  GearSix,
  Info,
  UserCircle
} from '@phosphor-icons/react';

const NAV_ITEMS = [
  // { path: '/', label: '3D Experience', icon: Sparkle },
  { path: '/', label: 'Overview', icon: SquaresFour },
  { path: '/data', label: 'My Data', icon: Database },
  { path: '/insights', label: 'Insights', icon: Sparkle },
  { path: '/experiments', label: 'Experiment Lab', icon: Flask },
  { path: '/assistant', label: 'Voice Assistant', icon: ChatTeardropDots },
  { path: '/privacy', label: 'Privacy Centre', icon: ShieldCheck },
  { path: '/settings', label: 'Settings', icon: GearSix },
];

export default function Sidebar({ onCloseMobile }) {
  const { profile } = useApp();

  return (
    <aside className="w-64 h-full bg-white border-r border-border flex flex-col justify-between select-none">
      {/* Top Brand Header */}
      <div>
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-botanical-800 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 1 9 9" />
                <circle cx="12" cy="12" r="3" fill="#749682" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="title-1 font-semibold text-charcoal tracking-tight">DayLens</span>
                <span className="caption-3 px-1.5 py-0.5 rounded bg-sage-100 text-botanical-800 font-semibold border border-sage-200">
                  Track 3
                </span>
              </div>
              <p className="caption-4 text-charcoal-muted truncate">
                wHACKiest 2026 Prototype
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg title-4 transition-all duration-300 ease-skill-base ${
                    isActive
                      ? 'bg-sage-100 text-botanical-900 font-semibold shadow-xs'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-sage-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      weight={isActive ? "fill" : "regular"}
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-botanical-800" : "text-charcoal-muted"
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-botanical-800" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Demo notice & User Profile */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Demo Status Notice */}
        <div className="p-3 rounded-xl bg-sage-50/70 border border-border">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-botanical-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="caption-3 text-botanical-900">Frontend Prototype</p>
              <p className="caption-5 text-charcoal-muted mt-0.5 leading-snug">
                Data is stored in your local browser storage. No external server or API required.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sage-50/50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-botanical-800 text-white flex items-center justify-center caption-1 font-semibold flex-shrink-0">
            {profile.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="caption-1 font-semibold text-charcoal truncate">{profile.name}</p>
            <p className="caption-5 text-charcoal-muted truncate">Know Thyself</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
