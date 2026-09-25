import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const portraits = [
  { name: 'Areeba', age: 23, city: 'Lahore', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=90&w=1200&auto=format&fit=crop' },
  { name: 'Maham', age: 24, city: 'Islamabad', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=90&w=1200&auto=format&fit=crop' },
  { name: 'Hamza', age: 26, city: 'Lahore', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=90&w=1200&auto=format&fit=crop' },
];

const reviews = [
  ['A.', 'Lahore', '“It feels less like scrolling and more like discovering a person. The profile details make starting a conversation much easier.”'],
  ['M.', 'Islamabad', '“The visual experience feels calm and premium. I can take my time and actually see whether someone shares my interests.”'],
  ['H.', 'Karachi', '“The little conversation prompts are a great touch. They make the first hello feel natural instead of awkward.”'],
];

export default function LandingPage() {
  const { session, authReady, openModal } = useApp();
  const [reviewIndex, setReviewIndex] = useState(0);
  if (authReady && session) return null;

  const join = () => openModal('onboarding', { reset: true });
  const signIn = () => openModal('login');

  return (
    <main className="v16-landing">
      <div className="v16-noise" aria-hidden="true" />
      <div className="v16-aurora v16-aurora-one" aria-hidden="true" />
      <div className="v16-aurora v16-aurora-two" aria-hidden="true" />
      <div className="v16-aurora v16-aurora-three" aria-hidden="true" />

      <header className="v16-nav">
        <button className="v16-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="ViboraQ home">
          <span className="v16-logo-mark">✦</span><span>ViboraQ</span><small>PAKISTAN</small>
        </button>
        <nav className="v16-desktop-links" aria-label="Main navigation">
          <a href="#discover">Discover</a><a href="#why">Why ViboraQ</a><a href="#stories">Stories</a>
        </nav>
        <div className="v16-nav-actions">
          <button className="v16-signin" onClick={signIn}>Sign in</button>
          <button className="v16-join" onClick={join}>Join free <span>↗</span></button>
        </div>
      </header>

      <section className="v16-hero">
        <div className="v16-hero-copy">
          <div className="v16-eyebrow"><span>♡</span> A MORE THOUGHTFUL WAY TO MEET</div>
          <h1>Meet someone<br /><em>worth staying curious about.</em></h1>
          <p>ViboraQ brings people together through personality, shared interests and real conversation — designed with a little more warmth and a lot more intention.</p>
          <div className="v16-hero-actions">
            <button className="v16-primary" onClick={join}>Create your profile <span>→</span></button>
            <button className="v16-secondary" onClick={signIn}><span className="v16-play">↗</span> I already have an account</button>
          </div>
          <div className="v16-proof-row"><span>✦ Profile-first</span><span>♡ Private by design</span><span>🇵🇰 Across Pakistan</span></div>
          <div className="v16-microcopy"><i /> No payment required to join <b>·</b> Create your profile in minutes</div>
        </div>

        <div className="v16-hero-visual" aria-label="ViboraQ connection preview">
          <div className="v16-glow-ring ring-a" />
          <div className="v16-glow-ring ring-b" />
          <div className="v16-main-portrait" style={{ backgroundImage: `url(${portraits[0].image})` }}>
            <div className="v16-photo-shade" />
            <div className="v16-photo-caption"><div><b>{portraits[0].name}, {portraits[0].age}</b><small>📍 {portraits[0].city} · Coffee · Art</small></div><span>●</span></div>
          </div>
          <div className="v16-secondary-portrait" style={{ backgroundImage: `url(${portraits[2].image})` }}><span>✦ Verified</span></div>
          <div className="v16-match-card"><span className="v16-match-heart">♡</span><div><small>YOUR VIBE MATCH</small><b>3 shared interests</b><em>Music · Travel · Coffee</em></div><strong>94%</strong></div>
          <div className="v16-float-note"><span>✦</span><div><b>Someone is nearby</b><small>2 new profiles in Lahore</small></div></div>
        </div>
      </section>

      <section className="v16-trust-strip"><div><strong>01</strong><span>Build a profile<br />with personality</span></div><div><strong>02</strong><span>Discover shared<br />interests</span></div><div><strong>03</strong><span>Start a better<br />conversation</span></div><button onClick={join}>Start discovering <span>→</span></button></section>

      <section id="why" className="v16-section v16-editorial">
        <div className="v16-section-head"><span className="v16-label">WHY VIBORAQ</span><h2>Dating can feel<br /><em>beautiful again.</em></h2><p>Not another noisy feed. A calmer space where the details of a person matter as much as the first impression.</p></div>
        <div className="v16-feature-grid">
          <article className="v16-feature feature-large"><span>♡</span><h3>Personality before pressure</h3><p>Show your interests, city, vibe and what you actually enjoy — so people have something meaningful to connect over.</p><div className="feature-line"><b>01</b><i /></div></article>
          <article className="v16-feature"><span>✦</span><h3>Better first hellos</h3><p>Shared interests create natural conversation starters instead of awkward blank screens.</p><div className="feature-line"><b>02</b><i /></div></article>
          <article className="v16-feature"><span>⌁</span><h3>Private by design</h3><p>Your profile and account experience are built around control, clarity and respectful discovery.</p><div className="feature-line"><b>03</b><i /></div></article>
        </div>
      </section>

      <section id="discover" className="v16-section v16-discover">
        <div className="v16-section-head v16-discover-head"><div><span className="v16-label">DISCOVER</span><h2>People with a<br /><em>similar vibe.</em></h2></div><button className="v16-outline" onClick={join}>Explore the vibe <span>→</span></button></div>
        <div className="v16-discover-grid">
          {portraits.map((p, i) => <article className={`v16-discover-card card-${i + 1}`} key={p.name}>
            <div className="v16-discover-photo" style={{ backgroundImage: `url(${p.image})` }}><div className="v16-card-top"><span>● Online</span><button onClick={signIn}>♡</button></div><div className="v16-card-bottom"><div><b>{p.name}, {p.age}</b><small>📍 {p.city} · {i === 0 ? 'Coffee · Art' : i === 1 ? 'Books · Travel' : 'Gym · Music'}</small></div><span>✦</span></div></div>
          </article>)}
        </div>
      </section>

      <section id="stories" className="v16-section v16-stories">
        <div className="v16-story-photo" style={{ backgroundImage: `url(${portraits[1].image})` }}><span>♡</span></div>
        <div className="v16-story-copy"><span className="v16-label">COMMUNITY STORIES</span><h2>The right feeling<br /><em>starts with hello.</em></h2><div className="v16-review"><div className="v16-stars">★★★★★</div><p>{reviews[reviewIndex][2]}</p><div className="v16-review-person"><span>{reviews[reviewIndex][0]}</span><div><b>{reviews[reviewIndex][0]} · {reviews[reviewIndex][1]}</b><small>Community preview</small></div></div></div><div className="v16-review-controls">{reviews.map((_, i) => <button key={i} className={i === reviewIndex ? 'active' : ''} onClick={() => setReviewIndex(i)} aria-label={`Review ${i + 1}`} />)}</div><small className="v16-demo-note">Preview copy — replace with verified member stories at launch.</small></div>
      </section>

      <section className="v16-how"><div className="v16-how-head"><span className="v16-label">HOW IT WORKS</span><h2>One good connection<br /><em>can change a day.</em></h2></div><div className="v16-how-grid"><article><b>01</b><span>♡</span><h3>Create your profile</h3><p>Tell people who you are, what you enjoy and what kind of connection you are looking for.</p></article><article><b>02</b><span>✦</span><h3>Find your people</h3><p>Discover profiles around Pakistan through interests, city and shared vibe.</p></article><article><b>03</b><span>→</span><h3>Start talking</h3><p>Turn a shared interest into a natural first message and see where it goes.</p></article></div></section>

      <section className="v16-final"><div className="v16-final-orb" /><span className="v16-label">YOUR NEXT CHAPTER</span><h2>Someone worth meeting<br /><em>could be one hello away.</em></h2><p>Join ViboraQ and create a profile that feels like you.</p><div><button className="v16-primary" onClick={join}>Join ViboraQ free <span>→</span></button><button className="v16-secondary" onClick={signIn}>Sign in instead</button></div></section>

      <footer className="v16-footer"><button className="v16-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="v16-logo-mark">✦</span><span>ViboraQ</span><small>PAKISTAN</small></button><p>Meaningful connections, thoughtfully designed for Pakistan.</p><button onClick={signIn}>Sign in</button></footer>
    </main>
  );
}
