import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase.js';

const AppContext=createContext(null);
const emptyProfile={nickname:'',city:'',bio:'',interests:[],avatar:'',membership:'free'};
export function AppProvider({children}){
 const [session,setSession]=useState(null),[authReady,setAuthReady]=useState(false),[authMode,setAuthMode]=useState(null),[profile,setProfile]=useState(emptyProfile),[toast,setToast]=useState(null);
 useEffect(()=>{let alive=true; supabase.auth.getSession().then(({data})=>{if(!alive)return;setSession(data.session??null);setAuthReady(true)}).catch(()=>alive&&setAuthReady(true)); const {data}=supabase.auth.onAuthStateChange((_e,next)=>{if(!alive)return;setSession(next??null);setAuthReady(true)}); return()=>{alive=false;data?.subscription?.unsubscribe()}},[]);
 useEffect(()=>{if(!session?.user){setProfile(emptyProfile);return} const m=session.user.user_metadata||{}; setProfile({nickname:m.nickname||session.user.email?.split('@')[0]||'',city:m.city||'Pakistan',bio:m.bio||'',interests:Array.isArray(m.interests)?m.interests:[],avatar:m.avatar||'',membership:m.membership||'free'})},[session]);
 const notify=useCallback((message,type='success')=>{setToast({message,type});window.clearTimeout(window.__vqToast);window.__vqToast=window.setTimeout(()=>setToast(null),4200)},[]);
 const openAuth=useCallback(mode=>setAuthMode(mode||'login'),[]),closeAuth=useCallback(()=>setAuthMode(null),[]);
 const signOut=useCallback(async()=>{const {error}=await supabase.auth.signOut(); if(error)notify(error.message,'error'); else notify('You are signed out.','info')},[notify]);
 const value=useMemo(()=>({session,authReady,profile,setProfile,authMode,openAuth,closeAuth,notify,toast,signOut}),[session,authReady,profile,authMode,openAuth,closeAuth,notify,toast,signOut]);
 return <AppContext.Provider value={value}>{children}{toast&&<div className={`vq33-toast ${toast.type}`} role="status">{toast.message}</div>}</AppContext.Provider>
}
export const useApp=()=>React.useContext(AppContext);
