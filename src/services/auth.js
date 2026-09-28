import { supabase } from './supabase.js';
export const EMAIL_PATTERN=/^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
export function validateEmail(email=''){return EMAIL_PATTERN.test(email.trim())}
export function validatePassword(password=''){return {length:password.length>=8&&password.length<=72,upper:/[A-Z]/.test(password),lower:/[a-z]/.test(password),number:/[0-9]/.test(password),symbol:/[^A-Za-z0-9]/.test(password)}}
export function isStrongPassword(password=''){return Object.values(validatePassword(password)).every(Boolean)}
export function friendlyAuthError(error){const m=String(error?.message||'').toLowerCase();if(m.includes('invalid login credentials'))return 'Email or password does not match. Please check your details.';if(m.includes('email not confirmed'))return 'Please confirm your email address first, then sign in again.';if(m.includes('user already registered'))return 'This email already has a ViboraQ account. Try signing in instead.';if(m.includes('password'))return 'Please check your password and try again.';if(m.includes('rate limit')||m.includes('too many'))return 'Too many attempts. Please wait a little and try again.';if(m.includes('network')||m.includes('fetch'))return 'We could not reach ViboraQ right now. Check your internet connection.';return error?.message||'Something went wrong. Please try again.'}
export function login(email,password){return supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password})}
export function signUpAccount({email,password,metadata}){return supabase.auth.signUp({email:email.trim().toLowerCase(),password,options:{data:metadata,emailRedirectTo:window.location.origin}})}
export function sendPasswordReset(email){return supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo:`${window.location.origin}/?reset=1`})}
export function updateAccountProfile(data){return supabase.auth.updateUser({data})}
export function updateAccountPassword(password){return supabase.auth.updateUser({password})}
