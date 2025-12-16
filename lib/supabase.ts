// // import { createClient } from '@supabase/supabase-js'

// // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// // const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// // export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// process.env.SUPABASE_SERVICE_ROLE_KEY!

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// console.log('✅ Supabase client initialized');

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client (service role) – upload, insert, etc.
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Client-side usage (browser) ke liye anon key
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase clients initialized (service role + anon)');
