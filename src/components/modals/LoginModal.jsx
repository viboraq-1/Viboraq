import React, { useEffect, useState } from 'react';
import ReactModal from '../common/ReactModal.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { login } from '../../services/auth.js';
import { supabase } from '../../services/supabase.js';

export default function LoginModal() {
  const { openModal, closeModal, notify, modal } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modal?.name !== 'login') return;
    setEmail(''); setPassword(''); setShow(false); setError(''); setLoading(false);
  }, [modal?.name]);

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    const em = email.trim().toLowerCase();
    if (!em) return setError('Please enter your email address.');
    if (!/^\S+@\S+\.\S+$/.test(em)) return setError('Please enter a valid email address.');
    if (!password) return setError('Please enter your password.');
    setLoading(true);
    const { error: loginError } = await login(em, password);
    setLoading(false);
    if (loginError) return setError(loginError.message || 'We could not sign you in. Please check your details.');
    closeModal();
    notify('Welcome back. Your private space is ready.');
  };

  const google = async () => {
    if (loading) return;
    setLoading(true);
    const { error: googleError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    if (googleError) { setLoading(false); setError(googleError.message || 'Google sign-in could not start.'); }
  };

  const reset = async () => {
    const em = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(em)) return setError('Enter your email first, then choose Forgot password.');
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(em, { redirectTo: window.location.origin });
    setLoading(false);
    if (resetError) return setError(resetError.message);
    notify('If that account exists, a reset link has been sent.', 'info');
  };

  return (
    <ReactModal name="login" className="v16-auth-modal">
      <div className="v16-auth-layout">
        <aside className="v16-auth-art">
          <div className="v16-auth-art-glow" />
          <div className="v16-auth-art-photo" />
          <div className="v16-auth-art-content"><span>♡ VIBORAQ</span><h3>Good connections<br /><em>feel different.</em></h3><p>A calmer place to meet people through personality, interests and conversation.</p></div>
        </aside>
        <div className="v16-auth-panel">
          <div className="v16-auth-heading"><div className="v16-auth-icon">✦</div><span>WELCOME BACK</span><h2>Sign in to your<br /><em>ViboraQ space.</em></h2><p>Continue discovering people and conversations that feel natural.</p></div>
          <form onSubmit={submit} autoComplete="off" className="v16-auth-form">
            <label>Email address</label>
            <div className="v16-input-wrap"><span>✉</span><input value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} type="email" autoComplete="off" placeholder="you@example.com" /></div>
            <div className="v16-auth-label-row"><label>Password</label><button type="button" onClick={reset}>Forgot password?</button></div>
            <div className="v16-input-wrap"><span>⌁</span><input value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} type={show ? 'text' : 'password'} autoComplete="new-password" placeholder="Your password" /><button type="button" onClick={() => setShow((value) => !value)}>{show ? 'Hide' : 'Show'}</button></div>
            {error && <div className="v16-auth-error"><strong>!</strong><div><b>Let’s fix that</b><small>{error}</small></div></div>}
            <button className="v16-auth-submit" disabled={loading}>{loading ? 'Signing you in…' : 'Sign in securely'}<span>→</span></button>
            <div className="v16-auth-divider"><i /> <span>or continue with</span> <i /></div>
            <button type="button" className="v16-google" onClick={google} disabled={loading}><b>G</b><span>Continue with Google</span><em>→</em></button>
            <div className="v16-auth-create">New to ViboraQ? <button type="button" onClick={() => openModal('onboarding', { reset: true })}>Create a free profile</button></div>
            <small className="v16-auth-safe">🔒 Private account experience · You control your profile</small>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
