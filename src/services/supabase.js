import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://gwbvfmnkkbrwnzejythu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_dZSR-Z2xdbGQKUWAR_3Jkg_HTUuPSGO';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
