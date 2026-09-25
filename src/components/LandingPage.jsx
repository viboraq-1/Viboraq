import React,{useState} from 'react';
import {useApp} from '../context/AppContext.jsx';
const pics=[
['Areeba','23','Lahore','https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=85&w=1000&auto=format&fit=crop'],
['Hamza','26','Lahore','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=85&w=1000&auto=format&fit=crop'],
['Maham','24','Islamabad','https://images.unsplash.com/photo-1517841905240-472988babdf9?q=85&w=1000&auto=format&fit=crop']];
const reviews=[
['A.','Lahore','“The profile-first experience feels calmer. I can actually understand someone before I start a conversation.”'],
['M.','Islamabad','“The whole experience feels much more intentional than endless swiping.”'],
['H.','Karachi','“Interests give you an easy first message. That small detail changes the experience.”']];
export default function LandingPage(){
 const {session,authReady,openModal}=useApp(); const [review,setReview]=useState(0);
 if(authReady&&session)return null;
 return <main className="app-landing">
   <div className="landing-orb orb-a"/><div className="landing-orb orb-b"/><div className="landing-orb orb-c"/>
   <header className="app-topbar"><button className="app-brand" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><span>✦</span><b>ViboraQ</b></button><button className="top-signin" onClick={()=>openModal('login')}>Sign in</button></header>
   <section className="mobile-hero">
     <div className="hero-badge">♡ MADE FOR MEANINGFUL CONNECTIONS</div>
     <h1>Meet someone<br/><em>worth knowing.</em></h1>
     <p>Discover thoughtful people, shared interests and conversations that can become something real.</p>
     <div className="hero-cta-stack"><button className="primary-app-btn" onClick={()=>openModal('onboarding',{reset:true})}>Create my profile <span>→</span></button><button className="secondary-app-btn" onClick={()=>openModal('login')}>I already have an account</button></div>
     <div className="hero-trust"><span>✦ Private</span><span>♡ Profile-first</span><span>🇵🇰 Pakistan</span></div>
     <div className="hero-collage"><div className="hero-photo hero-photo-main" style={{backgroundImage:`url(${pics[0][3]})`}}><span>Online</span></div><div className="hero-photo hero-photo-small" style={{backgroundImage:`url(${pics[1][3]})`}}/><div className="floating-match"><span>♡</span><div><b>Potential vibe</b><small>3 shared interests</small></div></div></div>
   </section>
   <section className="app-section intro-section"><span className="section-label">A DIFFERENT KIND OF DATING</span><h2>Less noise.<br/><em>More connection.</em></h2><p>ViboraQ puts personality before endless swiping. Build a profile that feels like you, discover people with compatible interests and start conversations naturally.</p></section>
   <section className="feature-cards">
    {[["♡","Profiles with personality","Show your interests, city and vibe—not just a photo."],["✦","Conversation first","Find an easy reason to say hello before you connect."],["⌁","Private by design","Your account and personal information stay under your control."]].map(([i,t,d])=><article key={t}><span>{i}</span><h3>{t}</h3><p>{d}</p></article>)}
   </section>
   <section className="app-section discover-preview"><div className="section-row"><div><span className="section-label">DISCOVER</span><h2>People with a<br/><em>similar vibe.</em></h2></div><button onClick={()=>openModal('onboarding',{reset:true})}>Join free</button></div><div className="mini-profiles">{pics.map((p,i)=><article key={p[0]}><div className="mini-photo" style={{backgroundImage:`url(${p[3]})`}}><i/></div><div><b>{p[0]}, {p[1]}</b><small>{p[2]} · {i===0?'Coffee · Art':'Travel · Music'}</small></div><span>♡</span></article>)}</div></section>
   <section className="app-section review-section"><span className="section-label">COMMUNITY STORIES</span><h2>What the vibe<br/><em>should feel like.</em></h2><article className="mobile-review"><div className="stars">★★★★★</div><p>{reviews[review][2]}</p><footer><div className="review-avatar">{reviews[review][0]}</div><span><b>{reviews[review][0]}</b><small>{reviews[review][1]} · preview</small></span></footer></article><div className="review-dots">{reviews.map((_,i)=><button key={i} className={i===review?'active':''} onClick={()=>setReview(i)}/>)}</div><small className="demo-note">Design preview — replace with verified member reviews at launch.</small></section>
   <section className="app-section steps-section"><span className="section-label">HOW IT WORKS</span><h2>One good hello<br/><em>can change a day.</em></h2>{[['01','Create','Build a profile that actually says something about you.'],['02','Discover','Browse compatible people by interests and vibe.'],['03','Connect','Start a thoughtful conversation and see where it goes.']].map(x=><div className="app-step" key={x[0]}><b>{x[0]}</b><div><strong>{x[1]}</strong><p>{x[2]}</p></div><span>→</span></div>)}</section>
   <section className="final-app-cta"><div className="cta-glow"/><span className="section-label">YOUR NEXT CHAPTER</span><h2>Someone worth meeting<br/><em>could be one hello away.</em></h2><button className="primary-app-btn" onClick={()=>openModal('onboarding',{reset:true})}>Join ViboraQ free <span>→</span></button><small>No payment required to create your profile.</small></section>
   <footer className="app-footer"><div className="app-brand"><span>✦</span><b>ViboraQ</b></div><small>Meaningful connections across Pakistan.</small><button onClick={()=>openModal('login')}>Sign in</button></footer>
 </main>;
}
