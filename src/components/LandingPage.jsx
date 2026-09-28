import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../services/supabase.js';
import './phase38.css';

const profiles = [
  { id: 1, name: 'Areeba', age: 25, city: 'Lahore', vibe: 'Coffee', match: '94%', img: '/profile-areeba.jpg', online: true },
  { id: 2, name: 'Zain', age: 28, city: 'Islamabad', vibe: 'Books', match: '91%', img: '/profile-zain.jpg', online: true },
  { id: 3, name: 'Hira', age: 24, city: 'Karachi', vibe: 'Art', match: '89%', img: '/profile-hira.jpg', online: true },
  { id: 4, name: 'Usama', age: 27, city: 'Lahore', vibe: 'Fitness', match: '87%', img: '/profile-usama.jpg', online: true },
];

function useLivePresence() {
  const [data, setData] = useState({ count: 0, cities: {}, live: false });
  useEffect(() => {
    const key = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    const channel = supabase.channel('vq38-public-radar', { config: { presence: { key } } });
    const sync = () => {
      const all = Object.values(channel.presenceState()).flat();
      const cities = {};
      all.forEach(item => { if (item?.city && item.city !== 'Unknown') cities[item.city] = (cities[item.city] || 0) + 1; });
      setData({ count: all.length, cities, live: true });
    };
    channel.on('presence', { event: 'sync' }, sync)
      .on('presence', { event: 'join' }, sync)
      .on('presence', { event: 'leave' }, sync)
      .subscribe(async state => {
        if (state === 'SUBSCRIBED') {
          await channel.track({ city: 'Unknown', surface: 'landing', version: '3.8' });
          sync();
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, []);
  return data;
}

function LivePill({ count, live }) {
  return <div className="ref-live-pill"><i /> <b>LIVE RADAR</b><strong>{count || '—'}</strong><span>{live ? 'people online right now' : 'connecting…'}</span><em>⌁</em></div>;
}

function ProfileRail({ onProfile }) {
  return <div className="ref-profile-area">
    <button className="ref-rail-arrow left" aria-label="Previous profiles">‹</button>
    <div className="ref-profile-grid">
      {profiles.map((p, index) => <article className={`ref-profile ${index === 0 ? 'selected' : ''}`} key={p.id} onClick={() => onProfile(p)} onKeyDown={e => e.key === 'Enter' && onProfile(p)} tabIndex="0">
        <div className="ref-photo">
          <img src={p.img} alt={`${p.name} profile`} />
          <span className="ref-online"><i />{p.online ? 'Online' : 'Recently'}</span>
          <button className="ref-heart" onClick={e => e.stopPropagation()}>♡</button>
          <button className="ref-chat" onClick={e => { e.stopPropagation(); onProfile(p); }}>◌</button>
        </div>
        <div className="ref-profile-meta"><div><b>{p.name}, {p.age}</b><small>{p.city}</small></div><span>{p.vibe}</span></div>
      </article>)}
    </div>
    <button className="ref-rail-arrow right" aria-label="Next profiles">›</button>
    <div className="ref-dots"><i className="active"/><i/><i/><i/><i/></div>
  </div>;
}

function PreviewLogin({ openAuth }) {
  return <aside className="ref-login-card">
    <button className="ref-login-x" aria-label="Close">×</button>
    <div className="ref-mini-brand"><span>V</span><b>VIBORAQ</b></div>
    <h2>Welcome Back</h2>
    <p>Sign in to continue your journey.</p>
    <button onClick={() => openAuth('login')} className="ref-social"><b className="google">G</b>Continue with Google</button>
    <button onClick={() => openAuth('login')} className="ref-social"><b className="apple">●</b>Continue with Apple</button>
    <div className="ref-or"><span>OR</span></div>
    <button onClick={() => openAuth('login')} className="ref-input"><span>✉</span>Email or username</button>
    <button onClick={() => openAuth('login')} className="ref-input"><span>▣</span>Password <b>◉</b></button>
    <div className="ref-login-row"><label><i /> Remember me</label><button onClick={() => openAuth('login')}>Forgot password?</button></div>
    <button onClick={() => openAuth('login')} className="ref-signin">Sign In <span>→</span></button>
    <small>Don’t have an account? <button onClick={() => openAuth('signup')}>Create one</button></small>
  </aside>;
}

function RadarBar({ count, cities, openAuth }) {
  const cityNames = ['Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Other'];
  return <section className="ref-radar-bar" id="radar">
    <div className="ref-radar-orbit"><span>V</span><i/><i/><i/><i/></div>
    <div className="ref-radar-title"><small>VIBORAQ LIVE RADAR</small><strong>{count || '—'} <em>people online right now</em></strong><p>Someone new could be here…</p></div>
    <button className="ref-view-all" onClick={() => openAuth('signup')}>View all</button>
    <div className="ref-cities"><div className="ref-city-heading">♧ <span><b>Cities</b><small>Live by city</small></span></div>{cityNames.map((city, i) => <div className="ref-city" key={city}><i className={`c${i}`} />{city}<b>{city === 'Other' ? Math.max(0, (count || 0) - cityNames.slice(0,4).reduce((s,n) => s + (cities[n] || 0), 0)) : (cities[city] || 0)}</b></div>)}</div>
    <div className="ref-recent"><div className="ref-avatar-stack"><span/><span/><span/><span/></div><div><b>Recent activity</b><small>New people joined in the last 5 minutes</small></div><label><i/> Live Now</label></div>
  </section>;
}

export default function LandingPage() {
  const { authReady, session, openAuth } = useApp();
  const { count, cities, live } = useLivePresence();
  const [pearl, setPearl] = useState(false);
  const [menu, setMenu] = useState(false);
  const scroll = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenu(false); };
  if (!authReady || session) return null;
  return <div className={`ref-landing ${pearl ? 'pearl' : ''}`}>
    <div className="ref-bg" />
    <header className="ref-nav">
      <button className="ref-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span>V</span><b>VIBORAQ</b></button>
      <nav className={menu ? 'open' : ''}><button className="active" onClick={() => scroll('discover')}>Explore</button><button onClick={() => scroll('radar')}>Live Radar</button><button onClick={() => scroll('stories')}>Stories</button><button onClick={() => scroll('premium')}>Premium</button><button onClick={() => scroll('safety')}>Safety</button></nav>
      <div className="ref-nav-actions"><button className="ref-sign-link" onClick={() => openAuth('login')}>Sign in</button><button className="ref-join" onClick={() => openAuth('signup')}>Join Free <span>→</span></button><button className="ref-sun" onClick={() => setPearl(v => !v)} aria-label="Toggle appearance">☼</button><button className="ref-menu" onClick={() => setMenu(v => !v)}>{menu ? '×' : '☰'}</button></div>
    </header>

    <main>
      <section className="ref-hero">
        <div className="ref-hero-image" />
        <div className="ref-hero-overlay" />
        <div className="ref-copy">
          <LivePill count={count} live={live} />
          <h1>Real People. Real Connections.<br/><em>Find Your Someone Special.</em></h1>
          <p>ViboraQ is more than a dating platform — it’s a place where real people build meaningful connections. Join today and discover your next chapter.</p>
          <div className="ref-proof"><span>♥ <b>Verified Profiles</b></span><span>⬡ <b>Safe & Secure</b></span><span>✦ <b>Smart Matching</b></span><span>♛ <b>Premium Features</b></span></div>
          <ProfileRail onProfile={() => openAuth('login')} />
        </div>
        <div className="ref-login-wrap"><PreviewLogin openAuth={openAuth} /></div>
      </section>

      <RadarBar count={count} cities={cities} openAuth={openAuth} />

      <section className="ref-section" id="discover"><div className="ref-section-heading"><span>REAL PEOPLE. REAL CONNECTIONS.</span><h2>Profiles with a little <em>more personality.</em></h2><p>Tap a profile to continue. Member details open after sign in.</p></div></section>
      <section className="ref-story" id="stories"><div><span>THE VIBORAQ WAY</span><h2>Better people.<br/><em>Better conversations.</em></h2><p>Explore by personality, interests and city — then let the first hello happen naturally.</p><button onClick={() => openAuth('signup')}>Create your free profile →</button></div><div className="ref-story-card"><img src="/couple-hero-clean.jpg" alt="Romantic couple"/></div></section>
      <section className="ref-safety" id="safety"><span>COMFORT MATTERS</span><h2>Romance should <em>feel safe.</em></h2><p>Private conversations, profile controls and account security stay close to the experience.</p></section>
      <section className="ref-final" id="premium"><span>YOUR NEXT HELLO</span><h2>Maybe it starts <em>here.</em></h2><button onClick={() => openAuth('signup')}>Join ViboraQ — it’s free →</button></section>
    </main>
    <button className="ref-support" onClick={() => openAuth('login')}>?</button>
  </div>;
}
