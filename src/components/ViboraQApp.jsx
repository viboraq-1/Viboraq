import React from 'react';
import AmbientShell from './AmbientShell.jsx';
import LandingPage from './LandingPage.jsx';
import Dashboard from './Dashboard.jsx';
import SubFeatureModal from './modals/SubFeatureModal.jsx';
import LoginModal from './modals/LoginModal.jsx';
import OnboardingModal from './modals/OnboardingModal.jsx';
import EditProfileModal from './modals/EditProfileModal.jsx';
import IcebreakerModal from './modals/IcebreakerModal.jsx';
import Toast from './common/Toast.jsx';
import { AppProvider } from '../context/AppContext.jsx';

export default function ViboraQApp() {
  return (
    <AppProvider>
      <AmbientShell>
        <LandingPage />
        <Dashboard />
        <SubFeatureModal />
        <LoginModal />
        <OnboardingModal />
        <EditProfileModal />
        <IcebreakerModal />
        <Toast />
      </AmbientShell>
    </AppProvider>
  );
}
