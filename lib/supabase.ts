import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pwdhrqenndnjmkbulyml.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZGhycWVubmRuam1rYnVseW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMTM4NzAsImV4cCI6MjA4Njg4OTg3MH0.AaPoT2tcW5yYWPt0EcJBIDArBzjr2Z_h08dhJ85GqAs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);