import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../services/supabase.js';
import './phase38.css';

const profiles = [
  { id: 1, name: 'Areeba', age: 25, city: 'Lahore', vibe: 'Coffee', match: '94%', img: '/profile-areeba.jpg', online: true, bio: 'Weekend drives, quiet cafés and finding the best chai in Lahore.' },
  { id: 2, name: 'Zain', age: 28, city: 'Islamabad', vibe: 'Books', match: '91%', img: '/profile-zain.jpg', online: true, bio: 'Books, long walks and food worth travelling for.' },
  { id: 3, name: 'Hira', age: 24, city: 'Karachi', vibe: 'Art', match: '89%', img: '/profile-hira.jpg', online: true, bio: 'Films, design and discovering little places around the city.' },
  { id: 4, name: 'Usama', age: 27, city: 'Rawalpindi', vibe: 'Fitness', match: '87%', img: '/profile-usama.jpg', online: true, bio: 'Gym before work, mountains whenever possible.' },
];

const cities = ['Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Gujranwala'];
const interests = ['Travel', 'Coffee', 'Music', 'Art', 'Books', 'Food', 'Films', 'Fitness'];

function useLivePresence() {
  const [data, setData] = useState({ count: 0, cities: {}, live: false });
  useEffect(() => {
    const key = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    const channel = supabase.channel('vq38-public-radar', { config: { presence: { key } } });
    const sync = () => {
      const all = Object.values(channel.presenceState()).flat();
      const cityCounts = {};
      all.forEach(item => { if (item?.city && item.city !== 'Unknown') cityCounts[item.city] = (cityCounts[item.city] || 0) + 1; });
      setData({ count: all.length, cities: cityCounts, live: true });
    };
    channel.on('presence', { event: 'sync' }, sync).on('presence', { event: 'join' }, sync).on('presence', { event: 'leave' }, sync);
    channel.subscribe(async state => {
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
          <button className="ref-heart" onClick={e => { e.stopPropagation(); onProfile(p); }}>♡</button>
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
    <button className="ref-login-x" onClick={() => openAuth('login')} aria-label="Open sign in">×</button>
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

function RadarBar({ count, cityCounts, openAuth }) {
  const displayCities = ['Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Other'];
  const known = displayCities.slice(0, 4).reduce((sum, city) => sum + (cityCounts[city] || 0), 0);
  return <section className="ref-radar-bar" id="radar">
    <div className="ref-radar-orbit"><span>V</span><i/><i/><i/><i/></div>
    <div className="ref-radar-title"><small>VIBORAQ LIVE RADAR</small><strong>{count || '—'} <em>people online right now</em></strong><p>Someone new could be here…</p></div>
    <button className="ref-view-all" onClick={() => openAuth('signup')}>View all</button>
    <div className="ref-cities"><div className="ref-city-heading">♧ <span><b>Cities</b><small>Live by city</small></span></div>{displayCities.map((city, i) => <div className="ref-city" key={city}><i className={`c${i}`} />{city}<b>{city === 'Other' ? Math.max(0, (count || 0) - known) : (cityCounts[city] || 0)}</b></div>)}</div>
    <div className="ref-recent"><div className="ref-avatar-stack"><span/><span/><span/><span/></div><div><b>Recent activity</b><small>New people joined in the last 5 minutes</small></div><label><i/> Live Now</label></div>
  </section>;
}

function FeatureCard({ icon, title, text }) {
  return <article className="ref-feature-card"><span>{icon}</span><h3>{title}</h3><p>{text}</p><b>Explore →</b></article>;
}

function InfoModal({ type, close }) {
  const content = {
    terms: ['Terms & Conditions', 'ViboraQ is designed for adults 18+. Be respectful, do not impersonate others, and never use the service to harass, scam or share another person’s private information.'],
    privacy: ['Privacy', 'Your profile should reveal only what you choose to share. Exact location is never presented as a public profile detail; live radar is designed around aggregate presence rather than an address.'],
    contact: ['Contact with us', 'For account, safety or support questions, contact the ViboraQ support team from your account area.'],
    support: ['ViboraQ Support', 'Need help with sign in, profile settings, safety or membership? Open your account and use the support centre.'],
    reviews: ['Member Notes', 'Presentation previews from the ViboraQ concept: Areeba — Lahore; Saad — Islamabad; Hira — Karachi. These are demo stories, not verified testimonials.']
  }[type];
  if (!content) return null;
  return <div className="ref-info-backdrop" onMouseDown={e => e.target === e.currentTarget && close()}><div className="ref-info-modal"><button onClick={close}>×</button><span>VIBORAQ</span><h2>{content[0]}</h2><p>{content[1]}</p><button className="ref-modal-cta" onClick={close}>Close</button></div></div>;
}

export default function LandingPage() {
  const { authReady, session, openAuth } = useApp();
  const { count, cities: cityCounts, live } = useLivePresence();
  const [pearl, setPearl] = useState(false);
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState(null);
  const scroll = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setMenu(false); };
  if (!authReady || session) return null;
  return <div className={`ref-landing ${pearl ? 'pearl' : ''}`}>
    <div className="ref-bg" />
    <header className="ref-nav">
      <button className="ref-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span>V</span><b>VIBORAQ</b></button>
      <nav className={menu ? 'open' : ''}><button className="active" onClick={() => scroll('discover')}>Explore</button><button onClick={() => scroll('radar')}>Live Radar</button><button onClick={() => scroll('how')}>How it works</button><button onClick={() => scroll('stories')}>Stories</button><button onClick={() => scroll('premium')}>Premium</button><button onClick={() => scroll('safety')}>Safety</button></nav>
      <div className="ref-nav-actions"><button className="ref-sign-link" onClick={() => openAuth('login')}>Sign in</button><button className="ref-join" onClick={() => openAuth('signup')}>Join Free <span>→</span></button><button className="ref-sun" onClick={() => setPearl(v => !v)} aria-label="Toggle appearance">☼</button><button className="ref-menu" onClick={() => setMenu(v => !v)}>{menu ? '×' : '☰'}</button></div>
    </header>

    <main>
      <section className="ref-hero">
        <div className="ref-hero-image" /><div className="ref-hero-overlay" />
        <div className="ref-copy">
          <LivePill count={count} live={live} />
          <h1>Real People. Real Connections.<br/><em>Find Your Someone Special.</em></h1>
          <p>ViboraQ is more than a dating platform — it’s a place where real people build meaningful connections. Join today and discover your next chapter.</p>
          <div className="ref-proof"><span>♥ <b>Verified Profiles</b></span><span>⬡ <b>Safe & Secure</b></span><span>✦ <b>Smart Matching</b></span><span>♛ <b>Premium Features</b></span></div>
          <ProfileRail onProfile={() => openAuth('login')} />
        </div>
        <div className="ref-login-wrap"><PreviewLogin openAuth={openAuth} /></div>
      </section>

      <RadarBar count={count} cityCounts={cityCounts} openAuth={openAuth} />

      <section className="ref-section" id="discover">
        <div className="ref-section-heading"><span>REAL PEOPLE. REAL CONNECTIONS.</span><h2>Profiles with a little <em>more personality.</em></h2><p>Discover people by interests, city and conversation style. Every profile is a starting point for a genuine hello.</p></div>
        <div className="ref-discover-grid">{profiles.map(p => <article className="ref-discover-card" key={p.id} onClick={() => openAuth('login')}><div className="discover-photo"><img src={p.img} alt={p.name}/><span>{p.match} match</span><i>● Online</i></div><div><h3>{p.name}, {p.age}</h3><small>{p.city} · {p.vibe}</small><p>{p.bio}</p><button onClick={e => { e.stopPropagation(); openAuth('login'); }}>View profile →</button></div></article>)}</div>
        <div className="ref-center-action"><button onClick={() => openAuth('signup')}>Explore more people →</button></div>
      </section>

      <section className="ref-how" id="how">
        <div className="ref-section-heading center"><span>HOW IT WORKS</span><h2>A better way to <em>meet.</em></h2><p>No noisy swipe marathon. Build a profile, discover compatible people and let the conversation decide.</p></div>
        <div className="ref-steps"><FeatureCard icon="01" title="Create your profile" text="Add a photo, your city, interests and the little details that make you you."/><FeatureCard icon="02" title="Discover your people" text="Browse by personality, interests and live activity across Pakistan."/><FeatureCard icon="03" title="Start naturally" text="Like a profile, say hello and keep the conversation respectful and easy."/><FeatureCard icon="04" title="Build a connection" text="Move from first hello to a real conversation at your own pace."/></div>
      </section>

      <section className="ref-story" id="stories"><div><span>THE VIBORAQ WAY</span><h2>Better people.<br/><em>Better conversations.</em></h2><p>Explore by personality, interests and city — then let the first hello happen naturally. ViboraQ is built around profiles with context, not just pictures.</p><div className="ref-button-row"><button onClick={() => openAuth('signup')}>Create your free profile →</button><button className="ghost" onClick={() => scroll('discover')}>Explore profiles</button></div></div><div className="ref-story-card"><img src="/couple-hero-clean.jpg" alt="Romantic couple"/><div><b>Someone noticed you</b><small>“Your travel story made me smile.”</small></div></div></section>

      <section className="ref-interest" id="interests"><div className="ref-section-heading center"><span>DISCOVER BY VIBE</span><h2>Find something you <em>actually enjoy.</em></h2><p>Shared interests make the first message easier.</p></div><div className="ref-interest-grid">{interests.map((x,i)=><button key={x} onClick={() => openAuth('signup')}><span>{['✦','◌','♫','◇','▤','⌁','◉','♢'][i]}</span>{x}<b>→</b></button>)}</div></section>

      <section className="ref-safety" id="safety"><div><span>COMFORT MATTERS</span><h2>Romance should <em>feel safe.</em></h2><p>Private conversations, profile controls, respectful discovery and account security stay close to the experience.</p></div><div className="ref-safety-grid"><FeatureCard icon="✓" title="Privacy first" text="Control what you share and keep exact location details private."/><FeatureCard icon="⌁" title="Report & block" text="Remove unwanted contact and flag suspicious behaviour."/><FeatureCard icon="◇" title="Secure account" text="Email confirmation, password controls and room for stronger authentication."/></div></section>

      <section className="ref-premium" id="premium"><div className="ref-section-heading"><span>VIBORAQ PREMIUM</span><h2>More access.<br/><em>More possibility.</em></h2><p>Choose when you want extra discovery tools, visibility and premium conversation features.</p></div><div className="ref-premium-grid"><article><small>WEEKLY</small><strong>PKR 350</strong><span>7 days</span><button onClick={() => openAuth('signup')}>Choose plan →</button></article><article className="featured"><label>POPULAR</label><small>MONTHLY</small><strong>PKR 1,000</strong><span>1 month</span><button onClick={() => openAuth('signup')}>Choose plan →</button></article><article><small>3 MONTHS</small><strong>PKR 2,500</strong><span>Save vs monthly</span><button onClick={() => openAuth('signup')}>Choose plan →</button></article><article><small>6 MONTHS · ELITE</small><strong>PKR 4,500</strong><span>Full experience</span><button onClick={() => openAuth('signup')}>Choose plan →</button></article></div></section>

      <section className="ref-reviews" id="reviews"><div className="ref-section-heading center"><span>MEMBER NOTES</span><h2>Small stories. <em>Big feeling.</em></h2><p>Presentation previews for the ViboraQ experience — not verified testimonials.</p></div><div className="ref-review-grid"><article><div>★★★★★</div><p>“The profile details make it much easier to know what to say first.”</p><b>Areeba</b><small>Lahore</small></article><article><div>★★★★★</div><p>“I like that the design feels calm instead of another endless swipe screen.”</p><b>Saad</b><small>Islamabad</small></article><article><div>★★★★★</div><p>“Shared interests give the conversation somewhere to start.”</p><b>Hira</b><small>Karachi</small></article></div></section>

      <section className="ref-final" id="join"><span>YOUR NEXT HELLO</span><h2>Maybe it starts <em>here.</em></h2><p>Create a free profile and explore ViboraQ at your own pace.</p><button onClick={() => openAuth('signup')}>Join ViboraQ — it’s free →</button></section>
    </main>

    <footer className="ref-footer"><div className="ref-footer-brand"><button className="ref-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span>V</span><b>VIBORAQ</b></button><p>Real people. Real connections.</p></div><div className="ref-footer-col"><b>Explore</b><button onClick={() => scroll('discover')}>Profiles</button><button onClick={() => scroll('radar')}>Live Radar</button><button onClick={() => scroll('how')}>How it works</button></div><div className="ref-footer-col"><b>Experience</b><button onClick={() => scroll('stories')}>Stories</button><button onClick={() => scroll('premium')}>Premium</button><button onClick={() => scroll('safety')}>Safety</button></div><div className="ref-footer-col"><b>Help</b><button onClick={() => setInfo('support')}>Support</button><button onClick={() => setInfo('contact')}>Contact with us</button><button onClick={() => setInfo('reviews')}>Reviews</button></div><div className="ref-footer-col"><b>Legal</b><button onClick={() => setInfo('terms')}>Terms & Conditions</button><button onClick={() => setInfo('privacy')}>Privacy</button></div><div className="ref-footer-bottom"><span>© 2026 ViboraQ</span><span>18+ · Private conversations · Made for meaningful connections</span></div></footer>
    <button className="ref-support" onClick={() => setInfo('support')}>?</button>
    {info && <InfoModal type={info} close={() => setInfo(null)} />}
  </div>;
}
