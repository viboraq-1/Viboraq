import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const photos = {
  hero: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=88&w=1500&auto=format&fit=crop',
  woman: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=88&w=1100&auto=format&fit=crop',
  man: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=88&w=1100&auto=format&fit=crop',
  couple: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=88&w=1400&auto=format&fit=crop',
  friends: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=88&w=1200&auto=format&fit=crop',
};

const profiles = [
  { name: 'Areeba', age: 23, city: 'Lahore', vibe: 'Coffee · Art · Travel', image: photos.woman },
  { name: 'Hamza', age: 26, city: 'Islamabad', vibe: 'Music · Fitness · Tech', image: photos.man },
  { name: 'Maham', age: 24, city: 'Karachi', vibe: 'Books · Food · Travel', image: photos.couple },
];

const reviews = [
  ['A', 'Lahore', 'The profile-first experience makes meeting someone feel much more intentional.'],
  ['M', 'Islamabad', 'It feels calm, polished and personal instead of another noisy social feed.'],
  ['H', 'Karachi', 'Shared interests give you an easy reason to say hello.'],
];

export default function LandingPage() {
  const { session, authReady, openModal } = useApp();
  const [review, setReview] = useState(0);
  if (authReady && session) return null;

  const join = () => openModal('onboarding', { reset: true });
  const login = () => openModal('login');

  return (
    <main className="vq17-landing vq18-landing">
      <div className="vq17-backdrop" aria-hidden="true" />
      <header className="vq17-nav">
        <button className="vq17-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="vq17-brand-mark">♡</span><span>ViboraQ</span><small>PAKISTAN</small>
        </button>
        <nav><a href="#discover">Discover</a><a href="#why">Why us</a><a href="#stories">Stories</a></nav>
        <div className="vq17-nav-actions"><button className="vq17-login" onClick={login}>Sign in</button><button className="vq17-join" onClick={join}>Join free <b>↗</b></button></div>
      </header>

      <section className="vq17-hero vq18-hero">
        <div className="vq17-hero-copy">
          <div className="vq17-kicker"><i /> MADE FOR MEANINGFUL CONNECTIONS IN PAKISTAN</div>
          <h1>Some connections<br /><em>feel like they were meant to happen.</em></h1>
          <p>Meet people through personality, shared interests and real conversation. ViboraQ is a warmer, more thoughtful way to discover someone who feels right.</p>
          <div className="vq17-actions"><button className="vq17-primary" onClick={join}>Create your profile <span>→</span></button><button className="vq17-secondary" onClick={login}>I already have an account</button></div>
          <div className="vq17-trust"><span>♡ Thoughtful profiles</span><span>✦ Private by design</span><span>● Across Pakistan</span></div>
        </div>
        <div className="vq17-hero-art">
          <div className="vq17-photo-main" style={{ backgroundImage: `url(${photos.hero})` }}><div className="vq17-photo-gradient" /><div className="vq17-photo-caption"><b>A connection worth discovering</b><small>Personality · Interests · Conversation</small></div></div>
          <div className="vq17-photo-small" style={{ backgroundImage: `url(${photos.woman})` }}><span>♡ 94% vibe</span></div>
          <div className="vq17-match"><strong>✦</strong><div><small>VIBE MATCH</small><b>3 shared interests</b><em>Coffee · Travel · Music</em></div></div>
          <div className="vq17-online"><i /> <div><b>People are discovering</b><small>new connections near you</small></div></div>
          <div className="vq17-ring r1" /><div className="vq17-ring r2" />
        </div>
      </section>

      <section className="vq17-story-strip"><div><b>01</b><span>Show the real<br />you</span></div><div><b>02</b><span>Find shared<br />interests</span></div><div><b>03</b><span>Start something<br />natural</span></div><button onClick={join}>Begin your story <span>→</span></button></section>

      <section id="why" className="vq17-section"><header className="vq17-section-head"><span>WHY VIBORAQ</span><h2>Dating should feel<br /><em>beautiful, not exhausting.</em></h2><p>No endless noise. No pressure to perform. Just profiles with personality and better reasons to start a conversation.</p></header><div className="vq17-feature-grid"><article><span>♡</span><h3>Personality first</h3><p>Interests, city, vibe and little details help people see more than a photo.</p></article><article><span>✦</span><h3>Natural conversation</h3><p>Shared interests turn an empty chat box into an easy first hello.</p></article><article><span>⌁</span><h3>Privacy matters</h3><p>Account controls and respectful discovery are part of the experience from day one.</p></article></div></section>

      <section id="discover" className="vq17-section vq17-discover"><header className="vq17-section-head left"><span>DISCOVER</span><h2>People with a<br /><em>similar vibe.</em></h2><p>Large, expressive profiles designed to feel good on a phone and beautiful on a desktop.</p></header><div className="vq17-profile-grid">{profiles.map((p) => <article key={p.name} className="vq17-profile-card"><div className="vq17-profile-photo" style={{ backgroundImage: `url(${p.image})` }}><span className="vq17-online-dot">● Online</span><button onClick={login}>♡</button><div><b>{p.name}, {p.age}</b><small>📍 {p.city} · {p.vibe}</small></div></div></article>)}</div></section>

      <section id="stories" className="vq17-section vq17-review-section"><div className="vq17-review-photo" style={{ backgroundImage: `url(${photos.friends})` }} /><div className="vq17-review-copy"><span>COMMUNITY STORIES</span><h2>The right feeling<br /><em>starts with hello.</em></h2><div className="vq17-review-card"><b className="vq17-stars">★★★★★</b><p>“{reviews[review][2]}”</p><footer><span>{reviews[review][0]}</span><div><b>{reviews[review][0]} · {reviews[review][1]}</b><small>Community preview</small></div></footer></div><div className="vq17-dots">{reviews.map((_, i) => <button key={i} className={i === review ? 'active' : ''} onClick={() => setReview(i)} />)}</div><small className="vq17-note">Preview stories — replace with verified member reviews at launch.</small></div></section>

      <section className="vq17-how"><span>HOW IT WORKS</span><h2>Four simple steps to<br /><em>a better first hello.</em></h2><div className="vq17-steps"><article><b>01</b><span>♡</span><h3>Create your profile</h3><p>Build a profile that feels like you, not a generic form.</p></article><article><b>02</b><span>✦</span><h3>Discover your people</h3><p>Explore personalities, interests and cities across Pakistan.</p></article><article><b>03</b><span>→</span><h3>Find your reason to talk</h3><p>Shared interests make the first message easier.</p></article><article><b>04</b><span>♥</span><h3>See where it goes</h3><p>Take your time and build a genuine connection.</p></article></div></section>

      <section className="vq17-final"><div className="vq17-final-glow" /><span>YOUR NEXT CHAPTER</span><h2>Someone wonderful<br /><em>could be one hello away.</em></h2><p>Join ViboraQ free and make your first impression count.</p><div><button className="vq17-primary" onClick={join}>Join ViboraQ free <span>→</span></button><button className="vq17-secondary" onClick={login}>Sign in</button></div></section>
      <footer className="vq17-footer"><button className="vq17-brand"><span className="vq17-brand-mark">♡</span><span>ViboraQ</span><small>PAKISTAN</small></button><p>Meaningful connections, thoughtfully designed.</p><button onClick={login}>Sign in</button></footer>
    </main>
  );
}
