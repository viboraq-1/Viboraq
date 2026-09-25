import { supabase } from './supabase.js';

export const EMAIL_PATTERN = /^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|live\.com|icloud\.com|msn\.com|aol\.com)$/i;

export function validatePassword(password = '') {
  return {
    length: password.length >= 6 && password.length <= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

export function isStrongPassword(password = '') {
  const rules = validatePassword(password);
  return Object.values(rules).every(Boolean);
}

export function getAge(dateString) {
  if (!dateString) return NaN;
  const birth = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return NaN;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export async function login(email, password) {
  return supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
}

export async function signUpAccount({ email, password, metadata }) {
  return supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: metadata },
  });
}
