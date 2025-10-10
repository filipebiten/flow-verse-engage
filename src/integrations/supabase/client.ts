import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = 'https://snvdhdwoxvyfjzeqyhoy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNudmRoZHdveHZ5Zmp6ZXF5aG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MTM2NDksImV4cCI6MjA2Njk4OTY0OX0.8t2TSS0xcD1tYyE5_E7cZEhlIgCSBkER2K7mbhRNCDE';

export const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: localStorage,
      },
    }
);
