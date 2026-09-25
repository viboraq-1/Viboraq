import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase.js';

const AppContext = createContext(null);

const EMPTY_PROFILE = {
  nickname: '',
  city: '',
  meet: '',
  friend: '',
  email: '',
  bio: '',
  interests: [],
  avatarUrl: '',
};

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState('explore');
  const [activeFilter, setActiveFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    nickname: '', dob: '', gender: '', city: '', meet: '', friend: '', email: '',
    interests: [], profileFile: null, profilePreview: '',
  });

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setAuthReady(true);
    }).catch(() => mounted && setAuthReady(true));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession ?? null);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    const user = session.user;
    setProfile((current) => ({
      ...current,
      email: user.email || current.email,
      nickname: current.nickname || user.user_metadata?.nickname || user.email?.split('@')[0] || '',
      city: current.city || user.user_metadata?.city || '',
    }));
  }, [session]);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const openModal = useCallback((name, payload = {}) => {
    setModal({ name, ...payload });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const resetOnboarding = useCallback(() => {
    setOnboardingStep(1);
    setOnboardingData({
      nickname: '', dob: '', gender: '', city: '', meet: '', friend: '', email: '',
      interests: [], profileFile: null, profilePreview: '',
    });
  }, []);

  const updateOnboarding = useCallback((patch) => {
    setOnboardingData((current) => ({ ...current, ...patch }));
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return notify(error.message, 'error');
    setProfile(EMPTY_PROFILE);
    setModal(null);
    setActiveTab('explore');
    setActiveFilter('all');
    notify('Secure session terminated.', 'info');
  }, [notify]);

  const value = useMemo(() => ({
    session, authReady, activeTab, setActiveTab, activeFilter, setActiveFilter,
    modal, openModal, closeModal,
    toast, notify,
    profile, setProfile,
    onboardingStep, setOnboardingStep,
    onboardingData, updateOnboarding, resetOnboarding,
    signOut,
  }), [session, authReady, activeTab, activeFilter, modal, openModal, closeModal, toast, notify, profile,
      onboardingStep, onboardingData, updateOnboarding, resetOnboarding, signOut]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
