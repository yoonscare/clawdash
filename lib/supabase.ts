import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ijbkxglwkhwluolkamcz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ZF_-VM8ji3IAuFVtVF9zaA_Dd96LZ02';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
