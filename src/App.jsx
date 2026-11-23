import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';


import Overview from './pages/Overview';
import MyData from './pages/MyData';
import Insights from './pages/Insights';
import ExperimentLab from './pages/ExperimentLab';
import VoiceAssistant from './pages/VoiceAssistant';
import PrivacyCentre from './pages/PrivacyCentre';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
         
          {/* Application Dashboard Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/data" element={<MyData />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/experiments" element={<ExperimentLab />} />
            <Route path="/assistant" element={<VoiceAssistant />} />
            <Route path="/privacy" element={<PrivacyCentre />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
