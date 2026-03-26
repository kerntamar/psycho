import { createClient } from '@supabase/supabase-js';

const isClient = typeof window !== 'undefined';
const supabaseUrl = (isClient ? localStorage.getItem('NEXT_PUBLIC_SUPABASE_URL') : null) || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = (isClient ? localStorage.getItem('NEXT_PUBLIC_SUPABASE_ANON_KEY') : null) || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
