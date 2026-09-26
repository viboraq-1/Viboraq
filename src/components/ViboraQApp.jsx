import React, { useEffect, useState } from 'react';
import AmbientShell from './AmbientShell.jsx';
import LandingPage from './LandingPage.jsx';
import Dashboard from './Dashboard.jsx';
import SubFeatureModal from './modals/SubFeatureModal.jsx';
import LoginModal from './modals/LoginModal.jsx';
import OnboardingModal from './modals/OnboardingModal.jsx';
import EditProfileModal from './modals/EditProfileModal.jsx';
import IcebreakerModal from './modals/IcebreakerModal.jsx';
import Toast from './common/Toast.jsx';
import { AppProvider, useApp } from '../context/AppContext.jsx';

function MobileSplash() {
  const { session, authReady } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!authReady || session) return;
    const seen = sessionStorage.getItem('vq18-splash-seen');
    if (seen) return;
    setVisible(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('vq18-splash-seen', '1');
      setVisible(false);
    }, 1050);
    return () => window.clearTimeout(timer);
  }, [authReady, session]);

  if (!visible) return null;
  return (
    <div className="vq18-splash" aria-label="ViboraQ">
      <div className="vq18-splash-orb" />
      <div className="vq18-splash-mark">♡</div>
      <strong>ViboraQ</strong>
      <span>Meaningful connections, thoughtfully designed.</span>
      <i aria-hidden="true" />
    </div>
  );
}

export default function ViboraQApp() {
  return <AppProvider>
    <AmbientShell>
      <div className="vq-mobile-app">
        <MobileSplash />
        <LandingPage />
        <Dashboard />
        <SubFeatureModal />
        <LoginModal />
        <OnboardingModal />
        <EditProfileModal />
        <IcebreakerModal />
        <Toast />
      </div>
    </AmbientShell>
  </AppProvider>;
}
