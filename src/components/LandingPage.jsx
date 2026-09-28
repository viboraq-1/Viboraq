import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../services/supabase.js';
import './phase38.css';

const profiles = [
  { id:1, name:'Areeba', age:25, city:'Lahore', vibe:'Coffee · Art · Travel', match:'94%', img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=84', online:true },
  { id:2, name:'Zain', age:28, city:'Islamabad', vibe:'Books · Food · Nature', match:'91%', img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=84', online:true },
  { id:3, name:'Hira', age:24, city:'Karachi', vibe:'Films · Design · Music', match:'89%', img:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=84', online:true },
  { id:4, name:'Usama', age:27, city:'Rawalpindi', vibe:'Fitness · Travel · Music', match:'87%', img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=84', online:true },
  { id:5, name:'Maham', age:26, city:'Faisalabad', vibe:'Art · Books · Cafés', match:'86%', img:'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=84', online:false },
  { id:6, name:'Saad', age:29, city:'Multan', vibe:'Travel · Food · Films', match:'84%', img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=84', online:true }
];

const interests=['Travel','Coffee','Music','Art','Books','Food'];

function LiveRadar(){
  const [count,setCount]=useState(null);
  const [live,setLive]=useState(false);
  useEffect(()=>{
    const key=`landing-${globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2)}`;
    const channel=supabase.channel('vq38-public-radar',{config:{presence:{key}}});
    const sync=()=>{
      const state=channel.presenceState();
      setCount(Object.values(state).flat().length);
      setLive(true);
    };
    channel.on('presence',{event:'sync'},sync).on('presence',{event:'join'},sync).on('presence',{event:'leave'},sync)
      .subscribe(async state=>{
        if(state==='SUBSCRIBED'){await channel.track({surface:'landing',version:'3.8'});sync();}
        if(state==='CHANNEL_ERROR'||state==='TIMED_OUT')setLive(false);
      });
    return()=>{supabase.removeChannel(channel)};
  },[]);
  return <div className="v38-live-pill"><span className="live-dot"/><b>LIVE RADAR</b><strong>{count ?? '—'}</strong><small>{live?'people online right now':'connecting…'}</small><span className="pulse-line">⌁</span></div>;
}

function ProfileCards({onOpen}){
  const [liked,setLiked]=useState([]);
  return <div className="v38-profile-rail">
    <button className="rail-arrow left" aria-label="Previous profiles">‹</button>
    <div className="v38-cards">
      {profiles.slice(0,4).map((p,index)=><article className={`v38-card ${index===0?'active-card':''}`} key={p.id} onClick={onOpen} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&onOpen()}>
        <div className="card-photo"><img src={p.img} alt={`${p.name} profile preview`} loading={index<2?'eager':'lazy'}/><span className="card-online"><i/>{p.online?'Online':'Recently'}</span><span className="card-match">{p.match}</span><button className="card-like" onClick={e=>{e.stopPropagation();setLiked(v=>v.includes(p.id)?v.filter(x=>x!==p.id):[...v,p.id])}}>{liked.includes(p.id)?'♥':'♡'}</button><button className="card-chat" onClick={e=>{e.stopPropagation();onOpen()}}>◌</button></div>
        <div className="card-meta"><div><b>{p.name}, {p.age}</b><small>{p.city}</small></div><span>{p.vibe.split(' · ')[0]}</span></div>
      </article>)}
    </div>
    <button className="rail-arrow right" aria-label="Next profiles">›</button>
    <div className="rail-dots"><i className="on"/><i/><i/><i/><i/></div>
  </div>;
}

function LandingLoginCard({openAuth}){
  return <aside className="v38-login-card">
    <button className="login-mini-close" aria-label="Close preview">×</button>
    <div className="login-brand"><span>V</span><b>VIBORAQ</b></div>
    <h2>Welcome Back</h2>
    <p>Sign in to continue your journey.</p>
    <button className="social-login" onClick={()=>openAuth('login')}><span className="google-mark">G</span>Continue with Google</button>
    <button className="social-login" onClick={()=>openAuth('login')}><span className="apple-mark">●</span>Continue with Apple</button>
    <div className="or-line"><span>OR</span></div>
    <button className="fake-input" onClick={()=>openAuth('login')}>✉ <span>Email or username</span></button>
    <button className="fake-input" onClick={()=>openAuth('login')}>▣ <span>Password</span><b>◉</b></button>
    <div className="login-row"><label><span/> Remember me</label><button onClick={()=>openAuth('login')}>Forgot password?</button></div>
    <button className="login-submit" onClick={()=>openAuth('login')}>Sign In <span>→</span></button>
    <small>Don’t have an account? <button onClick={()=>openAuth('signup')}>Create one</button></small>
  </aside>;
}

export default function LandingPage(){
  const { authReady, session, openAuth } = useApp();
  const [menu,setMenu]=useState(false);
  const [active,setActive]=useState('Travel');
  const [theme,setTheme]=useState('rose');
  const scroll=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)};
  const cards=useMemo(()=>profiles.filter(p=>p.vibe.includes(active)),[active]);
  if(!authReady||session)return null;
  return <div className={`v38-landing ${theme==='pearl'?'pearl-mode':''}`}>
    <div className="v38-ambient a1"/><div className="v38-ambient a2"/><div className="v38-noise"/>
    <header className="v38-nav">
      <button className="v38-logo" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><span>V</span><b>VIBORAQ</b></button>
      <nav className={menu?'open':''}><button className="active" onClick={()=>scroll('discover')}>Explore</button><button onClick={()=>scroll('radar')}>Live Radar</button><button onClick={()=>scroll('stories')}>Stories</button><button onClick={()=>scroll('premium')}>Premium</button><button onClick={()=>scroll('safety')}>Safety</button></nav>
      <div className="v38-nav-actions"><button className="v38-sign" onClick={()=>openAuth('login')}>Sign in</button><button className="v38-join" onClick={()=>openAuth('signup')}>Join Free <span>→</span></button><button className="v38-theme" onClick={()=>setTheme(v=>v==='rose'?'pearl':'rose')} aria-label="Toggle appearance">☼</button><button className="v38-menu" onClick={()=>setMenu(v=>!v)}>{menu?'×':'☰'}</button></div>
    </header>

    <main>
      <section className="v38-hero">
        <div className="v38-hero-backdrop"/>
        <div className="v38-hero-copy">
          <LiveRadar/>
          <span className="v38-kicker"><i/> REAL PEOPLE. REAL CONNECTIONS.</span>
          <h1>Real People.<br/>Real Connections.<br/><em>Find Your Someone Special.</em></h1>
          <p>ViboraQ is more than a dating platform — it’s a place where real people build meaningful connections. Join today and discover your next chapter.</p>
          <div className="v38-proof"><span>♥ <b>Verified Profiles</b></span><span>⬡ <b>Safe & Secure</b></span><span>✦ <b>Smart Matching</b></span><span>♛ <b>Premium Features</b></span></div>
          <ProfileCards onOpen={()=>openAuth('login')}/>
        </div>
        <div className="v38-hero-side">
          <div className="couple-glow"/>
          <LandingLoginCard openAuth={openAuth}/>
        </div>
      </section>

      <section className="v38-radar-bar" id="radar">
        <div className="radar-orbit"><span>V</span><i/><i/><i/><b/></div>
        <div className="radar-main"><small>VIBORAQ LIVE RADAR</small><strong>Someone new could be here…</strong></div>
        <div className="radar-count"><b>LIVE</b><strong>Now</strong></div>
        <div className="city-counts"><span><i/>Lahore <b>•</b></span><span><i/>Islamabad <b>•</b></span><span><i/>Karachi <b>•</b></span><span><i/>Rawalpindi <b>•</b></span><span><i/>Other <b>•</b></span></div>
        <button onClick={()=>openAuth('signup')}>View all →</button>
      </section>

      <section className="v38-section" id="discover">
        <div className="v38-section-head"><div><span className="v38-kicker"><i/> DISCOVER</span><h2>Profiles with a little<br/><em>more personality.</em></h2></div><p>Tap a profile to continue. ViboraQ asks you to sign in before member details open.</p></div>
        <div className="v38-chips">{interests.map(i=><button key={i} className={active===i?'active':''} onClick={()=>setActive(i)}>{i}</button>)}</div>
        <div className="v38-discover-grid">{profiles.slice(0,4).map(p=><article key={p.id} onClick={()=>openAuth('login')}><img src={p.img} alt={p.name}/><div><b>{p.name}, {p.age}</b><small>{p.city} · {p.match} vibe</small></div></article>)}</div>
      </section>

      <section className="v38-story-section" id="stories"><div className="story-photo"><img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1400&q=84" alt="Romantic couple" loading="lazy"/></div><div><span className="v38-kicker"><i/> THE VIBORAQ WAY</span><h2>Better people.<br/><em>Better conversations.</em></h2><p>Explore by personality, interests and city — then let the first hello happen naturally.</p><button onClick={()=>openAuth('signup')}>Create your free profile →</button></div></section>

      <section className="v38-safety" id="safety"><div><span className="v38-kicker"><i/> COMFORT MATTERS</span><h2>Romance should<br/><em>feel safe.</em></h2><p>Private conversations, block/report controls and account security stay close to the experience.</p></div><div className="safety-pills"><span>Private chat</span><span>Block & report</span><span>Profile controls</span><span>Security center</span></div></section>

      <section className="v38-final" id="premium"><span className="v38-kicker"><i/> YOUR NEXT HELLO</span><h2>Maybe it starts<br/><em>here.</em></h2><p>Join free. Explore naturally. Upgrade when you want more.</p><button onClick={()=>openAuth('signup')}>Join ViboraQ — it’s free <span>→</span></button><footer><b>VIBORAQ</b><div><button onClick={()=>openAuth('login')}>Sign in</button><button onClick={()=>openAuth('signup')}>Create account</button><button onClick={()=>scroll('safety')}>Safety</button><button onClick={()=>scroll('radar')}>Live Radar</button></div></footer></section>
    </main>
    <button className="v38-support" onClick={()=>openAuth('login')}>?</button>
  </div>;
}
