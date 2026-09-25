import React, { useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../services/supabase.js';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default function HtmlFragment({ html, className = '' }) {
  const app = useApp();
  const markup = useMemo(() => {
    const user = app.session?.user;
    const profile = app.profile || {};
    const name = profile.nickname || user?.user_metadata?.nickname || user?.email?.split('@')[0] || 'ViboraQ User';
    const email = profile.email || user?.email || '';
    const city = profile.city || user?.user_metadata?.city || 'Lahore';
    const meet = profile.meet || user?.user_metadata?.meet || 'Everyone';
    const friend = profile.friend || user?.user_metadata?.friend || 'All Pakistan';
    const avatar = profile.avatarUrl || '';

    let resolved = html
      .replaceAll('{{PROFILE_NAME}}', escapeHtml(name))
      .replaceAll('{{PROFILE_EMAIL}}', escapeHtml(email))
      .replaceAll('{{PROFILE_CITY}}', escapeHtml(city))
      .replaceAll('{{PROFILE_MEET}}', escapeHtml(meet))
      .replaceAll('{{PROFILE_FRIEND}}', escapeHtml(friend));

    if (avatar) {
      const safeAvatar = avatar.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
      resolved = resolved.replaceAll('{{PROFILE_AVATAR_STYLE}}', `background-image:url("${safeAvatar}");`);
    } else {
      resolved = resolved.replaceAll('{{PROFILE_AVATAR_STYLE}}', '');
    }
    return { __html: resolved };
  }, [html, app.profile, app.session]);

  const onClick = useCallback(async (event) => {
    const el = event.target.closest('[data-vq-action]');
    if (!el || !event.currentTarget.contains(el)) return;
    const action = el.dataset.vqAction;

    if (action === 'open-login') return app.openModal('login');
    if (action === 'open-onboarding') { app.resetOnboarding(); return app.openModal('onboarding', { reset: true }); }
    if (action === 'close-modal') return app.closeModal();
    if (action === 'logout') return app.signOut();
    if (action === 'open-edit') return app.openModal('edit');
    if (action === 'open-chat') return app.openModal('icebreaker', { person: el.dataset.vqPerson });
    if (action === 'open-sub') return app.openModal('sub', { featureKey: el.dataset.vqFeature });
    if (action === 'switch-tab') {
      app.setActiveTab(el.dataset.vqTab || 'explore');
      return;
    }
    if (action === 'social-login') {
      const provider = el.dataset.vqProvider;
      if (provider === 'Google') {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
        if (error) app.notify(error.message, 'error');
      } else app.notify('Phone authentication initiated...', 'info');
      return;
    }
    if (action === 'filter-feed') {
      app.setActiveFilter(el.dataset.vqFilter || 'all');
      return;
    }
    if (action === 'vip-payment') return app.notify('VIP checkout is ready.', 'info');
    if (action === 'voice-intro') return app.notify('Voice intro playback started.', 'info');
    if (action === 'ghost-mode') return app.notify('Ghost Mode preference updated.');
    if (action === 'save-profile') return app.notify('Profile settings synchronized successfully!');
  }, [app]);

  return <div className={className} onClick={onClick} dangerouslySetInnerHTML={markup} />;
}
