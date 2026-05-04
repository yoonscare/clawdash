import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ijbkxglwkhwluolkamcz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ZF_-VM8ji3IAuFVtVF9zaA_Dd96LZ02';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

const isServer = typeof window === 'undefined';
const serverKey = supabaseSecretKey || supabaseServiceRoleKey;
const supabaseKey = isServer && serverKey ? serverKey : supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
